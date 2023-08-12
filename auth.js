// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBAMn46OvYvoxI1STttMBW2QQzNMkVK3QI",
  authDomain: "fir-38a44.firebaseapp.com",
  databaseURL:
    "https://fir-38a44-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fir-38a44",
  storageBucket: "fir-38a44.appspot.com",
  messagingSenderId: "964306008147",
  appId: "1:964306008147:web:442519f6ed3319679eaea6",
  measurementId: "G-XQP42QYYH5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();

//my initializations
const signup = document.getElementById("sign-up");
const login = document.getElementById("log-in");

signup.addEventListener("click", (event) => {
  event.preventDefault();
  let email = document.getElementById("exampleInputEmail1").value;
  let password = document.getElementById("exampleInputPassword1").value;
  document.getElementById("exampleInputEmail1").value = "";
  document.getElementById("exampleInputPassword1").value = "";
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      document.getElementById("user-created").style.display = "block";
      setTimeout(function () {
        document.getElementById("user-created").style.display = "none";
      }, 3000);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      //   alert(errorMessage);
      if (errorCode == "auth/email-already-in-use") {
        document.getElementById("user-exists").style.display = "block";
        setTimeout(function () {
          document.getElementById("user-exists").style.display = "none";
        }, 3000);
      }
    });
});

login.addEventListener("click", (event) => {
  event.preventDefault();
  let email = document.getElementById("exampleInputEmail2").value;
  let password = document.getElementById("exampleInputPassword2").value;
  document.getElementById("exampleInputEmail2").value = "";
  document.getElementById("exampleInputPassword2").value = "";
  console.log("here!");
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      document.getElementById("user-loggedin").style.display = "block";
      setTimeout(function () {
        document.getElementById("user-loggedin").style.display = "none";
      }, 3000);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode == "auth/user-not-found") {
        document.getElementById("user-invalid").style.display = "block";
        setTimeout(function () {
          document.getElementById("user-invalid").style.display = "none";
        }, 3000);
      }
    });
});
