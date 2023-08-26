import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";

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

const app = initializeApp(appSettings);
const auth = getAuth();
const fireDB = getFirestore();
const storage = getStorage();
const colref = collection(fireDB, "customer");
let docref;
let loggedInUserId;
let file;

const updateUserInformationBtn = document.getElementById("update-btn");
const userName = document.getElementById("name");
const contactNumber = document.getElementById("contact-number");
const homeAddress = document.getElementById("home-address");
const getFile = document.getElementById("pic");

//getting the updated user profile-pic:
getFile.addEventListener("change", (event) => {
  file = event.target.files[0];
});

auth.onAuthStateChanged((user) => {
  if (user === null) return;
  loggedInUserId = user.uid;

  profileInfo(loggedInUserId);
});

async function profileInfo(loggedInUserId) {
  const q = query(colref, where("id", "==", `${loggedInUserId}`));
  //   console.log(q);
  const querySnapshot = await getDocs(q);
  if (querySnapshot.length === 0) {
    return;
  }
  //getting the ID of the document where I am making the changes for updation.
  const docId = querySnapshot.docs[0].id;
  querySnapshot.forEach((doc) => {
    try {
      // doc.data() is never undefined for query doc snapshots
      userName.value = doc.data().Name;
      contactNumber.value = doc.data().Contact;
      homeAddress.value = doc.data().Address;
    } catch (error) {
      console.log("Error:", error);
    }
  });
  //creating document reference for updating a document.
  docref = doc(fireDB, "customer", `${docId}`);
  
}

updateUserInformationBtn.addEventListener("click", (event) => {
  event.preventDefault();
  let updatedUserName = userName.value;
  let updatedContactNumber = contactNumber.value;
  let updatedHomeAddress = homeAddress.value;
  if (
    updatedUserName === "" ||
    updatedHomeAddress === "" ||
    updatedContactNumber === ""
  ) {
    document.getElementById("empty-field").style.display = "block";
    setTimeout(() => {
      document.getElementById("empty-field").style.display = "none";
    }, 3000);
    return;
  }
  updateCustomer(updatedUserName, updatedContactNumber, updatedHomeAddress);
  store(loggedInUserId);
});

async function updateCustomer(username, contact, address) {
  await updateDoc(docref, {
    Name: username,
    Contact: contact,
    Address: address,
  }).then(() => {
    document.getElementById("user-updated").style.display = "block";
    setTimeout(() => {
      document.getElementById("user-updated").style.display = "none";
    }, 3000);
  });
}

//for updating profile pic:
let profileDownloadURL;
async function store(user) {
  try {
    const storageRef = ref(storage, `images/${user}`);
    if(file === undefined) {
      return;
    }
    await uploadBytes(storageRef, file);
    getDownloadURL(storageRef).then((url) => {
      profileDownloadURL = url;
    });
    console.log("File uploaded successfully.");
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}