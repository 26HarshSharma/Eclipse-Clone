import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

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

//some firebase stuff, needed for all projects based on firebase.
const app = initializeApp(appSettings);
const database = getDatabase(app);
const auth = getAuth();

const products = document.getElementById("products");
const add = document.getElementById("add");
let list = document.getElementById("list");
const logout = document.getElementById("logout");

//Logic to insert products into the UI
function insertProducts(products, loggedInUser) {
  //console.log(loggedInUser);
  let productId = products[0];
  let productVal = products[1];
  let listItem = document.createElement("li");
  listItem.textContent = `${productVal}`;
  listItem.classList.add("list-items");
  listItem.addEventListener("click", () =>
    removeProducts(productId, loggedInUser)
  );
  list.append(listItem);
}

//deleting elemets from DB
let removeProducts = (productId, loggedInUser) => {
  let exactLocationOfProductsInDB = ref(
    database,
    `products/${loggedInUser}/${productId}`
  );
  remove(exactLocationOfProductsInDB);
};

function clearInputField() {
  products.value = "";
}

function clearList() {
  list.innerHTML = "";
}

add.addEventListener("click", () => {
  const productsVal = products.value;
  if (productsVal === "") {
    document.getElementsByClassName("disp")[0].style.display = "block";
    setTimeout(function () {
      document.getElementsByClassName("disp")[0].style.display = "none";
    }, 3000);
    return;
  }
  clearInputField();
  //pushing items to DB (firebase)
  let loggedInUser;
  auth.onAuthStateChanged((user) => {
    if (user === null) return;
    loggedInUser = user.uid;
  });
  setTimeout(function () {
    console.log(loggedInUser);
    const productsInDB = ref(database, `products/${loggedInUser}`);
    push(productsInDB, productsVal);

    //fetching data from firebase DB
    onValue(productsInDB, function (snapshot) {
      //If our db got empty, we deleted all elements, then our snapshot will not exist.
      // console.log(Object.entries(snapshot.val()));
      if (!snapshot.exists()) {
        list.innerHTML = "No items here...yet";
        return;
      }
      //console.log(loggedInUser);
      let productsArrayEnteries = Object.entries(snapshot.val()); //convert an object into 2d array having object keys and values.
      //let productsArrayKeys = Object.keys(snapshot.val()); //convert object to array of object keys.
      //let productsArrayValues = Object.Values(snapshot.val()); //convert object to array of object values.
      //console.log(productsArrayKeys);
      clearList();
      for (let product of productsArrayEnteries) {
        insertProducts(product, loggedInUser);
      }
    });
  }, 0);
});
//signing out functionality
logout.addEventListener("click", (event) => {
  event.preventDefault();
  auth.signOut().then(() => {
    document.getElementById("user-sign-out").style.display = "block";
    setTimeout(function () {
      document.getElementById("user-sign-out").style.display = "none";
    }, 3000);
  });
});
//user status (logged in or logged out)
auth.onAuthStateChanged((user) => {
  if (user === null) {
    list.style.display = "none";
    add.style.display = "none";
    products.style.display = "none";
    const p = document.createElement("p");
    p.textContent = "Please login to add or see products :)";
    document.getElementsByClassName("products-list")[0].append(p);

    logout.style.display = "none";
    document.getElementById("login").style.display = "block";
    document.getElementById("signUp").style.display = "block";
  } else {
    list.style.display = "block";
    add.style.display = "inline";
    products.style.display = "block";
    logout.style.display = "block";

    document.getElementById("login").style.display = "none";
    document.getElementById("signUp").style.display = "none";
  }
  // console.log(user.uid);
});
