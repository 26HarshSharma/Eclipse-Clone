import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  child,
  get,
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
const param = getQueryParameter("param");

// Use the values as needed
console.log(`Value 1: ${param}`);

auth.onAuthStateChanged((user) => {
  if (user === null) return;
  let customerId = user.uid;

  const askingConfirmationRef = ref(database, `askingConfirmation`);

  get(child(askingConfirmationRef, `${customerId}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const availableProducts = snapshot.val();
        const availableProductsList = Object.entries(availableProducts);
        console.log(availableProductsList[0][1][3]);
        console.log(availableProductsList[0][1][2]);
        const para1 = document.createElement("p");
        const para2 = document.createElement("p");
        para1.textContent = availableProductsList[param][1][3];
        para2.textContent = availableProductsList[param][1][2]
        document.getElementById("available-products").append(para1);
        document.getElementById("price-details").append(para2);
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
});
