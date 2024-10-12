import {
  ChatContainer,
  ConversationHeader,
  Message,
  MessageList,
  Avatar,
  MessageInput,
  Sidebar,
  MainContainer,
  Search,
  ConversationList,
  Conversation,
  VoiceCallButton,
  VideoCallButton,
  MessageSeparator
} from "@chatscope/chat-ui-kit-react";
import HomeHeader from "./HomeHeader";
import { useState, useEffect, useContext, useMemo ,useRef } from "react";
import { ActiveData } from "../config/context";
import DP from "../assets/default-profile.png";
import {
  getDocs, query, where, collection, db, doc, serverTimestamp, updateDoc,
  addDoc, orderBy, onSnapshot, increment
} from "../config/firebase";
import Spinner from "./loading";
import { useSearchParams, useNavigate } from "react-router-dom";
import LOGO from "../assets/Gossip-logo-mini.svg";


function HomeContainer() {

  const user = useContext(ActiveData);

  const [friends, setFriends] = useState([]);

  const [mess, setMess] = useState([]);

  const [allMess, setAllMess] = useState([]);

  const [search, setSearch] = useState("");

  const [isSearch, setIsSearch] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [unseenMess, setUnseenMess] = useState();

  const [searchParam] = useSearchParams();

  const navigate = useNavigate();

  //  <<<-------------------- Create ChatID -------------------->>>

  function chatID(id) {
    if (id < user.uid) {
      return user.uid + id;
    } else {
      return id + user.uid;
    }
  }

  //  <<<-------------------- Select Chat ---------------------->>>

  function selectChat(id) {
    searchParam.set("id", id)
    navigate(`/chat?${searchParam}`);
  }


  //  <<<-------------------- Send Messages -------------------->>>

  async function sendMess(value, fr) {

    let count = 1;
    if (fr[chatID(fr.uid)]?.recCount) {
      count = fr[chatID(fr.uid)].recCount + 1;
    }

    let text = value.trim();
    let date = serverTimestamp(); 

    await addDoc(collection(db, "Messages"), {
      message: value,
      position: "single",
      sender: user.username,
      timeStamp: date,
      sentTime: new Date().toISOString(),
      chatID: chatID(fr.uid),
      messStatus: "unseen"
    });

    let userRef = doc(db, "Users", user.uid);
    let frRef = doc(db, "Users", fr.uid);

    updateDoc(userRef, {
      chatID: chatID(fr.uid),
      [chatID(fr.uid)]: {
        lastMessage: value,
        lastSender: user.username,
        sendCount: count
      }
    })

    updateDoc(frRef, {
      chatID: chatID(fr.uid),
      [chatID(fr.uid)]: {
        lastMessage: value,
        lastSender: user.username,
        recCount: count
      }
    })

  }


  // <<<-------------------- get Messages -------------------->>>

  function getMessage() {
    let passArr = []
    // const q = query(collection(db, "Messages"), orderBy("timeStamp"), where("chatID", "==", chatID(chatters?.uid)));
    const q = query(collection(db, "Messages"), orderBy("timeStamp"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let change = querySnapshot._snapshot.docChanges[querySnapshot._snapshot.docChanges.length - 1]?.doc.data.value.mapValue.fields.chatID.stringValue;
      const arr = [];
      querySnapshot.forEach((doc) => {
          arr.push(doc.data());
      });
        setAllMess(arr);
    });
  setIsLoading(false);
}

  let [chatters, setChatters] = useState(); //   open the selected chat 

  //  <<<-------------------- get Users -------------------->>>


  async function getUsers() {

    const q = query(collection(db, "Users"), where("email", "!=", user.email))
    const unsubscribe = onSnapshot(q, (querySnapShot) => {
      let fr = [];
      querySnapShot.forEach((v, i) => {
        fr.push(
          {
            ...v.data(),
            active: false,
            lastSender: v.data().username,
            status: v.data().status,
            lastMessage: "hello",
          });
      })
      setFriends(fr);
    })

  }

  async function selectFun(c) {
    if (c) {
      if (c[chatID(c.uid)]?.sendCount) {
        let userRef = doc(db, "Users", user.uid);
        let frRef = doc(db, "Users", c.uid);
        await updateDoc(userRef, {
          [chatID(c.uid)]: {
            lastMessage: c[chatID(c.uid)]?.lastMessage,
            lastSender: c[chatID(c.uid)]?.lastSender,
            recCount: 0
          }
        })
        await updateDoc(frRef, {
          [chatID(c.uid)]: {
            lastMessage: c[chatID(c.uid)]?.lastMessage,
            lastSender: c[chatID(c.uid)]?.lastSender,
            sendCount: 0
          }
        })
      } else {
        console.log("not done");
      }
    }
  }
  
  
  //  <<<------------------- Use Effect -------------------->>>
  
  useEffect(() => {
      getMessage();
      let arr = []
      allMess.forEach((v) => {
        if (v.chatID == chatters.chatID) {
          arr.push(v);
        }
      });
      console.log(arr)
      setMess(arr)
    selectFun(chatters);
  }, [chatters])
  
  useEffect(() => {
      let c = friends.find((v) => v.uid == searchParam.get("id"));
      if (c) {
        selectFun(c);
        setChatters(c);
      }
  }, [friends])

  useEffect(() => {

    getUsers();
  }, [])

  return (
    <MainContainer
      responsive
      style={{
        height: "100svh",
      }}
    >
      <Sidebar position="left">
        <HomeHeader></HomeHeader>
        <Search onChange={(e) => {
          let s = friends.find((v) => v.username.match(e));
          e == "" | !s ? setIsSearch(false) : setIsSearch(true)
          setSearch([s])
          // console.log([s])
        }} placeholder="Search..." />
        <ConversationList>
          {!isSearch ? friends.map((v, i) => (
            <Conversation
              onClick={() => {
                selectChat(v.uid);
                setChatters(v);
              }}
              unreadCnt={chatters?.uid == v.uid ? 0 : v[chatID(v.uid)]?.sendCount ? v[chatID(v.uid)].sendCount : 0}
              active={searchParam.get("id") == v.uid ? true : false}
              key={v.uid}
              name={v.username}
              info={v[chatID(v.uid)]?.lastMessage}
              lastSenderName={v[chatID(v.uid)]?.lastSender == user.username ? "you" : v[chatID(v.uid)]?.lastSender}
            >
              <Avatar name={v.username} src={DP} status={v.status} />
            </Conversation>
          )) :
            search.map((v, i) => (
              <Conversation
                onClick={() => {
                  selectChat(v.uid);
                  setChatters(v);
                }}
                active={searchParam.get("id") == v.uid ? true : false}
                key={v.uid}
                name={v.username}
                info={v[chatID(v.uid)]?.lastMessage}
                lastSenderName={v[chatID(v.uid)]?.lastSender == user.username ? "you" : v[chatID(v.uid)]?.lastSender}
              >
                <Avatar name={v.username} src={DP} status={v.status} />
              </Conversation>))
          }
        </ConversationList>
      </Sidebar>
      {chatters ?
        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Back />
            <Avatar
              name={chatters.username}
              src={DP}
            />
            <ConversationHeader.Content
              info={chatters.status == "available" ? "online" : chatters.statusTime ? `last seen at ${chatters.statusTime}` : "offline"}
              userName={chatters.username}
            />
            <ConversationHeader.Actions>
              <VoiceCallButton style={{ fontSize: "1.2em", padding: "3px 10px" }} border />
              <VideoCallButton style={{ fontSize: "1.2em", padding: "3px 10px" }} border />
            </ConversationHeader.Actions>
          </ConversationHeader>
          <MessageList
          // typingIndicator={<TypingIndicator content="Zoe is typing" />}
          >
            {isLoading ? <div className="w-full h-full flex justify-center items-center">
              <Spinner className=""></Spinner>
            </div>
              : mess && mess.map((v, i) => {
                let time = new Date(v.sentTime).toLocaleTimeString();
                time = time.split("");
                time.splice(time.lastIndexOf(":"), 3);
                time = time.join("");

                return <Message
                  key={i}
                  model={{
                    direction: v.sender == user.username ? "outgoing" : "incoming",
                    message: v.message,
                    position: v.position,
                    sender: v.sender,
                    sentTime: v.sentTime,
                  }}
                >
                  <Message.Footer
                    sentTime={time}
                  />
                </Message>
              })}
            {/* {unseenMess ? <MessageSeparator>new</MessageSeparator> : <></>} {
                unseenMess ? unseenMess.map((v, i) => {
                  let time = new Date(v.sentTime).toLocaleTimeString();
                time = time.split("");
                time.splice(time.lastIndexOf(":"), 3);
                time = time.join("");

                return<Message
                  key={i}
                  model={{
                    direction: v.sender == user.username ? "outgoing" : "incoming",
                    message: v.message,
                    position: v.position,
                    sender: v.sender,
                    sentTime: v.sentTime,
                  }}
                >
                  <Message.Footer
                    sentTime={time}
                  />
                </Message>
                }) : <></>
              } */}
          </MessageList>
          <MessageInput
            autoFocus={true}
            onSend={(value) => {
              value = value.replaceAll("&nbsp;", " ")
              sendMess(value, chatters);
            }}
            placeholder="Type message here"
          />
        </ChatContainer> : <div className="w-full h-full flex justify-center">
          <div className="flex flex-col justify-center items-center">
            <img src={LOGO} alt="Gossip-logo" />
            <h1 className="text-center text-xl">Gossip for Web</h1>
            <div className="text-md text-center text-gray-500">Where Every Conversation Lights Up Your Day</div>
          </div>
        </div>
      }
    </MainContainer>
  );
}

export default HomeContainer;
