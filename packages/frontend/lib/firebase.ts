import firebase from "firebase/app";
import "firebase/analytics";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5KGLwnSSHQ6AjO4LRIA6xXac0MdulDMc",
  authDomain: "artistake-prod.firebaseapp.com",
  projectId: "artistake-prod",
  storageBucket: "artistake-prod.appspot.com",
  messagingSenderId: "462334348518",
  appId: "1:462334348518:web:19bb698c6b13964ddf7f27",
  measurementId: "G-NSNQHLGFG5",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
