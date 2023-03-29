import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDoxMidcoWg4QUjvXE4ny68CXqgNrNZvNo",
  authDomain: "thullo-77657.firebaseapp.com",
  projectId: "thullo-77657",
  storageBucket: "thullo-77657.appspot.com",
  messagingSenderId: "40180302396",
  appId: "1:40180302396:web:bdb232448ae4a02d96f939",
  measurementId: "G-TDYTNJKT32"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);