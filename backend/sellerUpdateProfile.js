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
const colref = collection(fireDB, "seller");
let docref;
let loggedInUserId;
let file;

const updateUserInformationBtn = document.getElementById("update-btn");
const sellerName = document.getElementById("seller-name");
const shopName = document.getElementById("shop-name");
const contactNumber = document.getElementById("contact-number");
const shopAddress = document.getElementById("shop-address");
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
     console.log(q);
  const querySnapshot = await getDocs(q);
  if (querySnapshot.length === 0) {
    return;
  }
  //getting the ID of the document where I am making the changes for updation.
  const docId = querySnapshot.docs[0].id;
  querySnapshot.forEach((doc) => {
    try {
      // doc.data() is never undefined for query doc snapshots
      sellerName.value = doc.data().SellerName;
      shopName.value = doc.data().ShopName;
      contactNumber.value = doc.data().SellerContactNumber;
      shopAddress.value = doc.data().ShopAddress;
    } catch (error) {
      console.log("Error:", error);
    }
  });
  //creating document reference for updating a document.
  docref = doc(fireDB, "seller", `${docId}`);
}

updateUserInformationBtn.addEventListener("click", (event) => {
  event.preventDefault();
  let updatedSellerName = sellerName.value;
  let updatedShopName = shopName.value;
  let updatedContactNumber = contactNumber.value;
  let updatedShopAddress = shopAddress.value;
  if (
    updatedSellerName === "" ||
    updatedShopAddress === "" ||
    updatedContactNumber === "" ||
    updatedShopName === ""
  ) {
    document.getElementById("empty-field").style.display = "block";
    setTimeout(() => {
      document.getElementById("empty-field").style.display = "none";
    }, 3000);
    return;
  }
  updateSeller(
    updatedSellerName,
    updatedContactNumber,
    updatedShopAddress,
    updatedShopName
  );
  store(loggedInUserId);
});

async function updateSeller(sellername, contact, shopaddress, shopname) {
  await updateDoc(docref, {
    SellerName: sellername,
    SellerContactNumber: contact,
    ShopAddress: shopaddress,
    ShopName: shopname,
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
    if (file === undefined) {
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
