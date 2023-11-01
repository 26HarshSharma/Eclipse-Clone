import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
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

document.getElementById("preloader").style.display = "inline-block";
document.getElementById("loader-container").style.display = "block";
//some firebase stuff, needed for all projects based on firebase.
const app = initializeApp(appSettings);
const database = getDatabase(app);
const auth = getAuth();
const fireDB = getFirestore();
const colref = collection(fireDB, "customer");

const products = document.getElementById("products");
const add = document.getElementById("add");
let list = document.getElementById("list");
const logout = document.getElementById("logout");

//Logic to insert products into the UI
function insertProducts(products, loggedInUserId) {
  let productId = products[0];
  let productVal = products[1];
  let listItem = document.createElement("li");
  listItem.textContent = `${productVal}`;
  listItem.classList.add("list-items");
  listItem.addEventListener("click", () =>
    removeProducts(productId, loggedInUserId)
  );
  list.append(listItem);
}

//deleting elemets from DB
let removeProducts = (productId, loggedInUserId) => {
  let exactLocationOfProductsInDB = ref(
    database,
    `products/${loggedInUserId}/${productId}`
  );
  remove(exactLocationOfProductsInDB);
};

function clearInputField() {
  products.value = "";
}

function clearList() {
  list.innerHTML = "";
}

//Main code to fetch items from DB and Push into the DB (*NOTE - Very Important!)
function loggedInUser(productsVal, flag) {
  let loggedInUserId;
  auth.onAuthStateChanged((user) => {
    if (user === null) return;
    loggedInUserId = user.uid;
    if (flag) {
      profile(loggedInUserId);
    }
  });
  setTimeout(function () {
    //getting the DB referrence (exact location where we need to store data)
    const productsInDB = ref(database, `products/${loggedInUserId}`);

    //pushing items to DB (firebase)
    if (productsVal !== "") push(productsInDB, productsVal);

    //fetching data from firebase DB
    onValue(productsInDB, function (snapshot) {
      //If our db got empty, we deleted all elements, then our snapshot will not exist.
      if (!snapshot.exists()) {
        list.innerHTML = "No items here...yet";
        list.style.color = "gray";
        return;
      }
      list.style.color = "black";
      let productsArrayEnteries = Object.entries(snapshot.val()); //convert an object into 2d array having object keys and values.

      clearList();
      for (let product of productsArrayEnteries) {
        insertProducts(product, loggedInUserId);
      }
    });
  }, 0);
}

//profile
loggedInUser("", true);
async function profile(loggedInUserId) {
  const q = query(colref, where("id", "==", `${loggedInUserId}`));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.length === 0) {
    return;
  }
  querySnapshot.forEach((doc) => {
    try {
      // doc.data() is never undefined for query doc snapshots
      document.getElementById("profile-name").style.display = "block";
      document.getElementById("profile-name").textContent = doc.data().Name;
      document.getElementById("preloader").style.display = "none";
      document.getElementById("loader-container").style.display = "none";
    } catch (error) {
      console.log("Error:", error);
    }
  });
}

//Add button event listener, adding products to realtime DB
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
  loggedInUser(productsVal, false);
});

//signing out functionality
logout.addEventListener("click", (event) => {
  event.preventDefault();
  auth.signOut().then(() => {
    document.getElementById("pro-pic").style.display = "none";
    window.location.href = "../index.html";
  });
});

//user status (logged in or logged out)
auth.onAuthStateChanged((user) => {
  if (user === null) {
    list.style.display = "none";
    add.style.display = "none";
    products.style.display = "none";
    document.getElementById("profile-name").style.display = "none";
    const p = document.createElement("p");
    p.textContent = "Please login to add or see products :)";
    document.getElementsByClassName("products-list")[0].append(p);

    logout.style.display = "none";
    document.getElementById("login").style.display = "block";
    document.getElementById("signUp").style.display = "block";
    document.getElementById("preloader").style.display = "none";
    document.getElementById("loader-container").style.display = "none";
  } else {
    list.style.display = "block";
    add.style.display = "inline";
    products.style.display = "block";
    logout.style.display = "block";

    document.getElementById("login").style.display = "none";
    document.getElementById("signUp").style.display = "none";

    loggedInUser("", true, user.uid);
  }
});

auth.onAuthStateChanged((user) => {
  if (user === null) return;
  let loggedInUserId = user.uid;
  const askingConfirmationRef = ref(
    database,
    `askingConfirmation/${loggedInUserId}`
  );
  onValue(askingConfirmationRef, (snapshot) => {
    const shopDetails = Object.values(snapshot.val());
    for(let i = 0; i < shopDetails.length; i ++) {
      const shopReq = document.createElement("section");
      shopReq.className = "shops";
      shopReq.innerHTML = `<p class="shop-name">Seller Name: ${shopDetails[i][4]}</p>
      <p class="seller-name">Shop Name: ${shopDetails[i][5]}</p>
      <p class="shop-address">Contact: ${shopDetails[i][6]}</p>
      <p class="seller-contact">Shop Address: ${shopDetails[i][7]}</p>
      <a id="${shopDetails[i][8]}" class="btn btn-success view-details-btn" >View Details</a>
      `
      document.getElementById("confirmation-req").append(shopReq);
      viewDetailsBtns();
    }
  });
});


async function viewDetailsBtns() {
  const allBtns = document.querySelectorAll(".view-details-btn");
  for (const element of allBtns) {
    element.addEventListener("click", () => {
      const value = element.id;
      const encodedValue = encodeURIComponent(value);
      const availableProducts = `availableProducts.html?param=${encodedValue}`;
      window.location.href = availableProducts;
    });
  }
}
