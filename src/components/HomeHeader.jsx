import {
  ConversationHeader,
  Avatar,
  Button
} from "@chatscope/chat-ui-kit-react";
import { useContext, useEffect, useState } from "react";
import { ActiveData, User } from "../config/context";
import { doc, db, auth, signOut, updateDoc } from "../config/firebase";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DP from "../assets/default-profile.png";

function HomeHeader() {
  let activeUser = useContext(ActiveData);
  let navigate = useNavigate();
 const context = useContext(User);

  function logOut() {
    let date = new Date().toLocaleTimeString();
    let arr = date.split("");
    arr.splice(date.lastIndexOf(":"), 3);
    date = arr.join("")
    signOut(auth).then(async() => {
      await updateDoc(doc(db, "Users", activeUser.uid), {
        status : "unavailable",
        statusTime : date
      })
      navigate("/login")
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  }

  let [name, setName] = useState("")

  useEffect(() => {
    setName(activeUser.username)
  }, []);

  return (
    <ConversationHeader>
      <Avatar
        name={activeUser.username}
        src={DP}      />
      <ConversationHeader.Content userName={name} />
      <ConversationHeader.Actions>
        <Button onClick={() => {logOut()}}><FiLogOut size={22} /></Button>
      </ConversationHeader.Actions>
    </ConversationHeader>
  );
}

export default HomeHeader;
