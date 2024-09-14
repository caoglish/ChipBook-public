// @ is an alias to /src
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "***SecretKey***",
//   authDomain: "***authDomain***",
//   projectId: "***projectid***",
//   storageBucket: "***storageBucket***",
//   messagingSenderId: "***messagingSenderId***",
//   appId: "***appId***",
// };

const firebaseConfig = {
	apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
	authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.VUE_APP_FIREBASE_APP_ID,
	
  };
console.log(firebaseConfig);
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firebaseDb = getFirestore(app);


export default firebaseDb
