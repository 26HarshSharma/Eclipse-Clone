import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
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

const app = initializeApp(appSettings);
const database = getDatabase(app);
const auth = getAuth();

function getQueryParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Retrieve the values from the URL
const param1 = getQueryParameter("param1");

// Use the values as needed
//console.log(`Value 1: ${param1}`);

const productsList = document.getElementById("products");

auth.onAuthStateChanged((user) => {
  if (user === null) return;
  let sellerId = user.uid;

  const productsColRef = ref(database, `orders/${sellerId}/products/${param1}`);
  onValue(productsColRef, function (snapshot) {
    let products = Object.values(snapshot.val());
    for (const element of products) {
      const product = document.createElement("div");
      product.className = "product";
      product.innerHTML = `<p>${element}</p>`;
      document.getElementById("products-recieved").append(product);
    }
    const allProducts = document.querySelectorAll(".product");
    for (const element of allProducts) {
      element.addEventListener("click", function clickHandler() {
        const duplicateElement = element.cloneNode(true);
        element.style.textDecoration = "line-through";
        document.getElementById("available-products").append(duplicateElement);
        const inputElement = document.createElement("input");
        const close = document.createElement("div");
        close.className = "closeBtn";
        close.innerHTML = `<span class="material-symbols-outlined"> close </span>`;
        inputElement.placeholder = "Price";
        duplicateElement.append(inputElement);
        duplicateElement.append(close);
        close.addEventListener("click", function closeHandler() {
          duplicateElement.style.display = "none";
          element.style.textDecoration = "none";
          element.addEventListener("click",clickHandler);
        });
        element.removeEventListener("click", clickHandler);
      });
    }
  });
});
