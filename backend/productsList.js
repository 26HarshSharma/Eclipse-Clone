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
console.log(`Value 1: ${param1}`);

const receipt = document.getElementById("receipt");
const finalCostBtn = document.getElementById("final-cost-btn");
receipt.style.display = "none";
finalCostBtn.style.display = "none"


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
        receipt.style.display = "flex";
        document.getElementById("available-products").append(duplicateElement);
        const inputElement = document.createElement("input");
        inputElement.className = "price-input";
        const close = document.createElement("div");
        close.className = "closeBtn";
        close.innerHTML = `<span class="material-symbols-outlined close"> close </span>`;
        inputElement.placeholder = "Price";
        duplicateElement.append(inputElement);
        duplicateElement.append(close);
        close.addEventListener("click", function closeHandler() {
          duplicateElement.remove();
          const duplicateElementCount = document.querySelectorAll(".close");
          if (duplicateElementCount.length === 0) {
            receipt.style.display = "none";
          }
          element.style.textDecoration = "none";
          element.addEventListener("click", clickHandler);
        });
        element.removeEventListener("click", clickHandler);
      });
    }
  });
});
let flag = true;
const totalPrice = document.getElementById("total-btn");
totalPrice.addEventListener("click", () => {
  if (flag) {
    finalCostBtn.style.display = "flex";
    let price = 0;
    const prices = document.querySelectorAll(".price-input");
    for (const element of prices) {
      price = price + +element.value;
    }
    const totalPricePara = document.createElement("p");
    totalPricePara.textContent = price;
    totalPricePara.className = "total-price-para";
    document.getElementById("total-price-container").append(totalPricePara);
    const discountRateLable = document.createElement("label");
    const discountRateInput = document.createElement("input");
    discountRateInput.className = "input-element";
    discountRateLable.className = "lable-element";
    discountRateLable.textContent = "Discount Rate (*not mandatory)";
    document
      .getElementById("discount-rate-container")
      .append(discountRateLable);
    document
      .getElementById("discount-rate-container")
      .append(discountRateInput);
    const deliveryChargesLable = document.createElement("label");
    const deliveryChargesInput = document.createElement("input");
    deliveryChargesLable.className = "lable-element";
    deliveryChargesInput.className = "input-element";
    deliveryChargesLable.textContent = "Delivery Charges (*not mandatory)";
    document
      .getElementById("delivery-charges-container")
      .append(deliveryChargesLable);
    document
      .getElementById("delivery-charges-container")
      .append(deliveryChargesInput);
    
    finalCostBtn.addEventListener("click", () => {
      const finalCosth3 = document.createElement("h3");
      const finalCostPara = document.createElement("p");
      finalCostPara.style.fontSize = "21px";
      finalCosth3.textContent = "Final Cost Price";
      console.log(discountRateInput.value / 100);
      finalCostPara.textContent =
        (price -
        (price * (discountRateInput.value / 100))) +
        (+deliveryChargesInput.value);
      document.getElementById("final-cost-container").append(finalCostPara);
    });
    flag = false;
  }
});
