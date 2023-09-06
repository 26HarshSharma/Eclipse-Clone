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

let userId;
auth.onAuthStateChanged((user) => {
  if (user === null) return;
  let sellerId = user.uid;
  const customerColRef = ref(database, `orders/${sellerId}/customer`);
  onValue(customerColRef, function (snapshot) {
    let customerDetails = Object.values(snapshot.val());
    console.log(customerDetails);
    document.getElementById("customer-list-container").innerHTML = "";
    for (let i = 0; i < customerDetails.length; i ++) {
      let values = Object.values(customerDetails[i]);
      console.log(values[i][3]);
      const customer = document.createElement("div");
      customer.className = "customer";
      customer.innerHTML = `<div><p>${values[i][0]}</p>
    <p>${values[i][1]}</p>
    <p>${values[i][2]}</p></div>
    <div>
    <a href="#" class="btn-small">View Products</a>
    `;
      document.getElementById("customer-list-container").append(customer);
    }
  });
});
