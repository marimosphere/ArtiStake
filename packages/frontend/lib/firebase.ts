import firebase from "firebase/app";
import "firebase/analytics";

const config = {
  authDomain: "artistake-prod.firebaseapp.com",
  projectId: "artistake-prod",
  storageBucket: "artistake-prod.appspot.com",
  messagingSenderId: "462334348518",
  appId: "1:462334348518:web:19bb698c6b13964ddf7f27",
};

firebase.initializeApp(config);

export default firebase;
