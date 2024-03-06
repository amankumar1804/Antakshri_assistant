import { initializeApp } from "firebase/app";
import {getFirestore} from '@firebase/firestore'
const firebaseConfig = {
    apiKey: "AIzaSyBeeDp8XVjlVkPfyeiTcC39w8XaK2Oo_4g",
    authDomain: "antakshari-assistant.firebaseapp.com",
    projectId: "antakshari-assistant",
    storageBucket: "antakshari-assistant.appspot.com",
    messagingSenderId: "71566900876",
    appId: "1:71566900876:web:50dcbdb49fff9bb2af45a9",
    measurementId: "G-VM6VX0WVNF"
  };
  const app = initializeApp(firebaseConfig) 
  export const db = getFirestore(app)