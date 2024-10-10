import './App.css';
import "./index.css";
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import AppRouter from './router/router';
import { onAuthStateChanged, auth, getDoc, db, doc, updateDoc, onSnapshot } from './config/firebase';
import { User, ActiveData } from './config/context';
import { useEffect, useState } from 'react';
import Spinner from './components/loading';

function App() {

  let [value, setValue] = useState("")
  let [data, setData] = useState(null)
  let [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, async (u) => {
      if (u) {
        let docRef = doc(db, "Users", u.uid);
        let docSnap = await getDoc(docRef)
        setData(docSnap.data());
        setValue(u);
        setIsLoading(false);
        await updateDoc(docRef, {
          status: "available"
        })
      } else {
        let date = new Date().toLocaleTimeString();
        let arr = date.split("");
        arr.splice(date.lastIndexOf(":"), 3);
        date = arr.join("")
        setValue("");
        setIsLoading(false);
        let docRef = doc(db, "Users", u.uid);
        await updateDoc(docRef, {
          status: "unavailable",
          statusTime: date
        })
      }
    })
  }, [])

  return (
    <User.Provider value={value}>
      <ActiveData.Provider value={data}>
        {isLoading ? <div className='w-full h-svh absolute top-0 left-0'>
          <Spinner className="flex justify-center mt-60"></Spinner>
        </div> : <AppRouter />
        }
      </ActiveData.Provider>
    </User.Provider>
  )
}

export default App
