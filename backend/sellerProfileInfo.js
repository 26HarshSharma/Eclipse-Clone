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
const app = initializeApp(appSettings);
const auth = getAuth();
const fireDB = getFirestore();
const colref = collection(fireDB, "seller");
let loggedInUserId;

auth.onAuthStateChanged((user) => {
  if (user === null) return;
  loggedInUserId = user.uid;

  profileInfo(loggedInUserId, user.email);
});

async function profileInfo(loggedInUserId, loggedInUserEmail) {
  const q = query(colref, where("id", "==", `${loggedInUserId}`));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.length === 0) {
    return;
  }
  querySnapshot.forEach((doc) => {
    try {
      // doc.data() is never undefined for query doc snapshots
      document.getElementById("name").textContent = doc.data().SellerName;
      document.getElementById("shop-name").textContent = doc.data().ShopName;
      document.getElementById("contact-number").textContent =
        doc.data().SellerContactNumber;
      document.getElementById("shop-address").textContent = doc.data().ShopAddress;
      document.getElementById("email-address").textContent = loggedInUserEmail;
      document.getElementById("preloader").style.display = "none";
      document.getElementById("loader-container").style.display = "none";
    } catch (error) {
      console.log("Error:", error);
    }
  });
}
