import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

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
const database = getDatabase(app);
const colref = collection(fireDB, "seller");
const customerColRef = collection(fireDB, "customer");

let customerName;
let customerAddress;
let customerContactNumber;
let customerId;

async function sellerInfo() {
  const q = query(colref, where("City", "==", `Budaun`));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.length === 0) {
    const element = document.createElement("p");
    element.textContent = "no seller found in your city";
    return element;
  }

  const sellerListContainer = document.getElementById("seller-list-container");

  return new Promise((resolve) => {
    querySnapshot.forEach((doc) => {
      try {
        const newSeller = document.createElement("section");
        newSeller.id = "seller-list";
        newSeller.innerHTML = `<div>
          <h1 id="shop-name">
            ${doc.data().ShopName} <span id="seller-name">${
          doc.data().SellerName
        }</span>
          </h1>
          <p id="seller-address">${doc.data().ShopAddress}</p>
        </div>
        <div class="buttons">
          <a href="#" id=${doc.data().id} class="btn-alt">Send Order</a>
        </div>`;
        sellerListContainer.appendChild(newSeller);
      } catch (error) {
        console.log("Error:", error);
      }
    });

    resolve(); // Resolve the promise when all seller info is appended to the DOM
  });
}

async function sendReq() {
  const sendReqBtns = document.querySelectorAll(".btn-alt");
  for (const element of sendReqBtns) {
    element.addEventListener("click", () => {
      document.getElementById("preloader").style.display = "block";
      document.getElementById("loader-container").style.display = "block";
      // console.log(element.id);
      loggedInUser(element.id);
    });
  }
}

function loggedInUser(sellerId) {
  let loggedInUserId;
  auth.onAuthStateChanged((user) => {
    if (user === null) return;
    loggedInUserId = user.uid;
  });
  setTimeout(async function () {
    const productsInDB = ref(database, `products/${loggedInUserId}`);
    const pushProductsToSellerProductsList = ref(
      database,
      `orders/${sellerId}/products/${loggedInUserId}`
    );
    const pushProductsToSellerCustomer = ref(
      database,
      `orders/${sellerId}/customer/${loggedInUserId}`
    );
    const qCustomer = query(
      customerColRef,
      where("id", "==", `${loggedInUserId}`)
    );
    const querySnapshot = await getDocs(qCustomer);
    querySnapshot.forEach(
      (doc) => {
        try {
          // doc.data() is never undefined for query doc snapshots
          customerName = doc.data().Name;
          customerAddress = doc.data().Address;
          customerContactNumber = doc.data().Contact;
          customerId = doc.data().id;
        } catch (error) {
          console.log("Error:", error);
        }
      },
      onValue(productsInDB, function (snapshot) {
        let productsArray = Object.values(snapshot.val());
        for (const element of productsArray) {
          push(pushProductsToSellerProductsList, element);
        }
        push(pushProductsToSellerCustomer, [customerName, customerAddress, customerContactNumber, customerId]);

        document.getElementById("preloader").style.display = "none";
        document.getElementById("loader-container").style.display = "none";
        document.getElementById(`${sellerId}`).textContent = "Request Send";
      })
    );
  }, 0);
}

(async () => {
  await sellerInfo(); // Wait for sellerInfo to complete
  document.getElementById("preloader").style.display = "none";
  document.getElementById("loader-container").style.display = "none";
  sendReq();
})();
