import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

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
//some firebase stuff, needed for all projects based on firebase.
const app = initializeApp(appSettings);

const auth = getAuth();
const fireDB = getFirestore();
const colref = collection(fireDB, "seller");

const logout = document.getElementById("logout");








//Main code to fetch items from DB and Push into the DB (*NOTE - Very Important!)
function loggedInUser(flag) {
  let loggedInUserId;
  auth.onAuthStateChanged((user) => {
    if (user === null) return;
    loggedInUserId = user.uid;
    if (flag) {
      profile(loggedInUserId);
    }
  });
}

//profile
loggedInUser(true);
async function profile(loggedInUserId) {
  const q = query(colref, where("id", "==", `${loggedInUserId}`));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.length === 0) {
    return;
  }
  querySnapshot.forEach((doc) => {
    try {
      // doc.data() is never undefined for query doc snapshots
      document.getElementById("profile-name").style.display = "block";
      document.getElementById("profile-name").textContent = doc.data().SellerName;
      document.getElementById("preloader").style.display = "none";
      document.getElementById("loader-container").style.display = "none";
    } catch (error) {
      console.log("Error:", error);
    }
  });
}


//signing out functionality
logout.addEventListener("click", (event) => {
  event.preventDefault();
  auth.signOut().then(() => {
    
    document.getElementById("pro-pic").style.display = "none";
    window.location.href = "../index.html";
  });
});

//user status (logged in or logged out)
auth.onAuthStateChanged((user) => {
  if (user === null) {
    list.style.display = "none";
    add.style.display = "none";
    products.style.display = "none";
    document.getElementById("profile-name").style.display = "none";
    const p = document.createElement("p");
    p.textContent = "Please login to add or see products :)";
    document.getElementsByClassName("products-list")[0].append(p);

    logout.style.display = "none";
    document.getElementById("login").style.display = "block";
    document.getElementById("signUp").style.display = "block";
    document.getElementById("preloader").style.display = "none";
      document.getElementById("loader-container").style.display = "none";
  } else {
    
    logout.style.display = "block";

    document.getElementById("login").style.display = "none";
    document.getElementById("signUp").style.display = "none";
    
    loggedInUser("", true, user.uid);
  }
});
