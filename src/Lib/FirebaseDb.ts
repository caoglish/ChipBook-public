// @ is an alias to /src
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "***SecretKey***",
  authDomain: "***authDomain***",
  projectId: "***projectid***",
  storageBucket: "***storageBucket***",
  messagingSenderId: "***messagingSenderId***",
  appId: "***appId***",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firebaseDb = getFirestore(app);


export default firebaseDb
