// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXbQIV-cnFxUcJWeIovxlEYtrwGOBVDAE",
  authDomain: "meat-shop-7c531.firebaseapp.com",
  projectId: "meat-shop-7c531",
  storageBucket: "meat-shop-7c531.firebasestorage.app",
  messagingSenderId: "568807348705",
  appId: "1:568807348705:web:62814e755536b6f3bf9aa0",
  measurementId: "G-93P7GSJE88"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;