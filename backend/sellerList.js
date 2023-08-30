import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";

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

const app = initializeApp(appSettings);

const fireDB = getFirestore();
const colref = collection(fireDB, "seller");

async function sellerInfo() {
  const q = query(colref, where("City", "==", `Budaun`));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.length === 0) {
    const element = document.createElement("p");
    element.textContent = "no seller found in your city";
    return element;
  }
  querySnapshot.forEach((doc) => {
    try {
      // doc.data() is never undefined for query doc snapshots
      const newSeller = document.createElement("section");
      newSeller.id = "seller-list";
      newSeller.innerHTML = `<div>
      <h1 id="shop-name">
        ${doc.data().ShopName} <span id="seller-name">${doc.data().SellerName}</span>
      </h1>
      <p id="seller-address">${doc.data().ShopAddress}</p>
      
    </div>
    <div class="buttons">
      <a href="#" class="btn-alt">Send Order</a>
    </div>`;
    const sellerListContainer = document.getElementById("seller-list-container");
    sellerListContainer.appendChild(newSeller);
    //   document.getElementById("preloader").style.display = "none";
    //   document.getElementById("loader-container").style.display = "none";
    } catch (error) {
      console.log("Error:", error);
    }
  });
}

sellerInfo();