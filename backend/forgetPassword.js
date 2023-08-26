import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getAuth,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

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

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const forgetPasswordBtn = document.getElementById("forget-password");

//forget-password logic
forgetPasswordBtn.addEventListener("click", (event) => {
  event.preventDefault();
  let email = document.getElementById("forget-password-email").value;
  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("Password reset email sent!");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if(errorCode == "auth/user-not-found") {
        document.getElementById("user-invalid").style.display = "block";
        setTimeout(function () {
            document.getElementById("user-invalid").style.display = "none";
          }, 3000);
      }
    });
});
