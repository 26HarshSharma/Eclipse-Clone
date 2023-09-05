const orders = document.querySelector(".orders-container");
const askingConfirmation = document.querySelector(".asking-confirmation-container");
const confirmedOrders = document.querySelector(".confirmed-orders-container");
const cancelledOrders = document.querySelector(".cancelled-orders-container");

const ordersBtn = document.getElementById("orders");
const askingConfirmationBtn = document.getElementById("asking-confirmation");
const confirmedOrderBtn = document.getElementById("confirmed-orders");
const cancelledOrdersBtn = document.getElementById("cancelled-orders");

ordersBtn.addEventListener("click", () => {
    askingConfirmation.classList.remove("show");
    confirmedOrders.classList.remove("show");
    cancelledOrders.classList.remove("show");
    orders.classList.add("show");
})

askingConfirmationBtn.addEventListener("click", () => {
    askingConfirmation.classList.add("show");
    confirmedOrders.classList.remove("show");
    cancelledOrders.classList.remove("show");
    orders.classList.remove("show");
})

confirmedOrderBtn.addEventListener("click", () => {
    askingConfirmation.classList.remove("show");
    confirmedOrders.classList.add("show");
    cancelledOrders.classList.remove("show");
    orders.classList.remove("show");
})

cancelledOrdersBtn.addEventListener("click", ()=> {
    askingConfirmation.classList.remove("show");
    confirmedOrders.classList.remove("show");
    cancelledOrders.classList.add("show");
    orders.classList.remove("show");
})