const API = "https://website-9gq9.onrender.com";

let cart = [];
let products = {};

// LOAD PRODUCTS
async function loadProducts() {
  const res = await fetch(API + "/products");
  products = await res.json();

  const container = document.getElementById("products");
  container.innerHTML = "";

  Object.keys(products).forEach(id => {
    const p = products[id];

    container.innerHTML += `
      <div class="card">
        <img src="https://picsum.photos/300?${id}">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <button onclick="addToCart(${id})">Add to Cart</button>
      </div>
    `;
  });
}

// ADD TO CART
function addToCart(id) {
  const item = cart.find(x => x.id === id);

  if (item) item.qty++;
  else cart.push({ id, qty: 1 });

  renderCart();
}

// RENDER CART
function renderCart() {
  const el = document.getElementById("cart-items");
  const totalEl = document.getElementById("total");
  const countEl = document.getElementById("cart-count");

  if (!el) return;

  el.innerHTML = "";

  let total = 0;
  let count = 0;

  cart.forEach(item => {
    const p = products[item.id];

    total += p.price * item.qty;
    count += item.qty;

    el.innerHTML += `
      <div class="cart-row">
        ${p.name} x ${item.qty}
        <button onclick="changeQty(${item.id}, -1)">-</button>
        <button onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    `;
  });

  totalEl.innerText = "Total: $" + total;
  countEl.innerText = count;
}

// CHANGE QTY
function changeQty(id, change) {
  const item = cart.find(x => x.id === id);
  if (!item) return;

  item.qty += change;

  if (item.qty <= 0) {
    cart = cart.filter(x => x.id !== id);
  }

  renderCart();
}

// TOGGLE CART
function toggleCart() {
  document.getElementById("cart-panel").classList.toggle("hidden");
}

// CHECKOUT
async function checkout() {
  const address = document.getElementById("address").value;
  const email = document.getElementById("email").value;

  if (!address) {
    alert("Enter address");
    return;
  }

  const res = await fetch(API + "/payment/create-checkout-session", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ cart, address, email })
  });

  const data = await res.json();

  if (data.url) {
    window.location.href = data.url;
  } else {
    alert("Payment failed");
    console.error(data);
  }
}

// INIT
loadProducts();
renderCart();
