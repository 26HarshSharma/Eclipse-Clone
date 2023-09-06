import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {
  getDatabase,
  ref,
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
const database = getDatabase(app);
const auth = getAuth();

let customer;
auth.onAuthStateChanged((user) => {
  if (user === null) return;
  let sellerId = user.uid;
  const customerColRef = ref(database, `orders/${sellerId}/customer`);
  onValue(customerColRef, function (snapshot) {
    let customerDetails = Object.values(snapshot.val());
    document.getElementById("customer-list-container").innerHTML = "";
    for (let i = 0; i < customerDetails.length; i++) {
      customer = Object.values(customerDetails[i]); // Get the current customer object
      console.log(customer[0]);
      // Access the properties of the customer object directly
      const customerDiv = document.createElement("div");
      customerDiv.className = "customer";
      customerDiv.innerHTML = `<div><p>${customer[0][0]}</p>
    <p>${customer[0][1]}</p>
    <p>${customer[0][2]}</p></div>
    <div>
    <a href="productsList.html" id="${customer[0][3]}" class="btn-small">View Products</a>
    `;
      document.getElementById("customer-list-container").append(customerDiv);
    }
  });
});



