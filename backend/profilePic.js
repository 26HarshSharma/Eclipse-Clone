import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getStorage,
  ref,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

const appSettings = {
  databaseURL:
    "https://fir-38a44-default-rtdb.europe-west1.firebasedatabase.app/",
  apiKey: "AIzaSyBAMn46OvYvoxI1STttMBW2QQzNMkVK3QI",
  authDomain: "fir-38a44.firebaseapp.com",
  projectId: "fir-38a44",
  storageBucket: "fir-38a44.appspot.com",
  messagingSenderId: "964306008147",
  appId: "1:964306008147:web:442519f6ed3319679eaea6",
  measurementId: "G-XQP42QYYH5",
};

document.getElementById("preloader").style.display = "inline-block";
document.getElementById("loader-container").style.display = "block";
// Initialize Firebase Services
const app = initializeApp(appSettings);
const auth = getAuth();
const storage = getStorage();
let storageRef;

let loggedInUserId;
let loggedInUserEmail;

const profilePic = document.getElementById("pro-pic");

auth.onAuthStateChanged((user) => {
  if (user === null) return;
  loggedInUserId = user.uid;
  getUserPic(loggedInUserId);
});

//get user profile-pic
async function getUserPic(loggedInUserId) {
  try {
    storageRef = ref(storage, `images/${loggedInUserId}`);
    getDownloadURL(storageRef).then((url) => {
      if (url !== "") {
        profilePic.style.display = "block";
        profilePic.setAttribute("src", url);
        // profilePic.style.borderRadius = "50%";
        document.getElementById("preloader").style.display = "none";
      document.getElementById("loader-container").style.display = "none";
      }
    });
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}
