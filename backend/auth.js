// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

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

// Initialize Firebase Services
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const storage = getStorage();
const fireDB = getFirestore();
let storageRef;

//collection referrence:
const colref = collection(fireDB, "customer");
const sellerColRef = collection(fireDB, "seller");

//my initializations
const signup = document.getElementById("sign-up");
const login = document.getElementById("log-in");

let getFile = document.getElementById("pic");
let file;

//getting the profile pic
getFile.addEventListener("change", (event) => {
  file = event.target.files[0];
});

//signup logic
signup.addEventListener("click", (event) => {
  event.preventDefault();
  let email = document.getElementById("exampleInputEmail1").value;
  let password = document.getElementById("exampleInputPassword1").value;
  let username = document.getElementById("name").value;
  let address = document.getElementById("address").value;
  let contactNumber = document.getElementById("contact-number").value;
  let state = document.getElementById("state").value;
  let city = document.getElementById("city").value;
  let user;
  document.getElementById("exampleInputEmail1").value = "";
  document.getElementById("exampleInputPassword1").value = "";
  document.getElementById("name").value = "";
  document.getElementById("address").value = "";
  document.getElementById("contact-number").value = "";
  document.getElementById("state").value = "";
  document.getElementById("city").value = "";
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      user = userCredential.user.uid;
      //calling a function to upload profile-pic to firebase storage with name = userid
      store(user);
      // calling a function to upload customer data to firestore DB
      addCustomer(user, username, contactNumber, address, state, city);
      setTimeout(()=> {
        window.location.href = "customer.html";
      },2500);
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode == "auth/email-already-in-use") {
        document.getElementById("user-exists").style.display = "block";
        setTimeout(function () {
          document.getElementById("user-exists").style.display = "none";
        }, 3000);
      }
    });
  getFile.value = "";
});

//adding a customer details to firestore DB
async function addCustomer(user, username, contact, address, state, city) {
  addDoc(colref, {
    id: user,
    Name: username,
    Contact: contact,
    Address: address,
    State: state,
    City: city,
    seller: false,
  });
}

//For uploading profile-pic to firebase cloud storage.
let profileDownloadURL;
async function store(user) {
  try {
    storageRef = ref(storage, `images/${user}`);
    await uploadBytes(storageRef, file);
    getDownloadURL(storageRef).then((url) => {
      
      profileDownloadURL = url;
    });
    console.log("File uploaded successfully.");
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

login.addEventListener("click", (event) => {
  event.preventDefault();
  let email = document.getElementById("exampleInputEmail2").value;
  let password = document.getElementById("exampleInputPassword2").value;
  document.getElementById("exampleInputEmail2").value = "";
  document.getElementById("exampleInputPassword2").value = "";
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      let isSeller = profileInfo(user.uid);
      isSeller.then((isSellerValue) => {
        
        if(!isSellerValue) {
          setTimeout(()=> {
            window.location.href = "customer.html";
          },2000)
        }
        else {
          setTimeout(()=> {
            window.location.href = "seller.html";
          },2000)
        }
      })
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode == "auth/user-not-found") {
        document.getElementById("user-invalid").style.display = "block";
        setTimeout(function () {
          document.getElementById("user-invalid").style.display = "none";
        }, 10000);
      }
      if (errorCode == "auth/wrong-password") {
        document.getElementById("user-invalid-password").style.display =
          "block";
        setTimeout(function () {
          document.getElementById("user-invalid-password").style.display =
            "none";
        }, 10000);
      }
    });
});

//fetching data from firestore
async function profileInfo(loggedInUserId) {
  const q1 = query(colref, where("id", "==", `${loggedInUserId}`));
  const querySnapshotCustomer = await getDocs(q1);
  if (!querySnapshotCustomer.empty) {
    return false; // This indicates the user is a customer
  }
  const q2 = query(sellerColRef, where("id", "==", `${loggedInUserId}`));
  const querySnapshotSeller = await getDocs(q2);
  if (!querySnapshotSeller.empty) {
    return true; // This indicates the user is a seller
  }
}
