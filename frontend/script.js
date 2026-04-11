const API = "https://website-9gq9.onrender.com";

let cart = [];

const products = [
  { id: 1, name: "T-Shirt", price: 25, image: "https://picsum.photos/300?1" },
  { id: 2, name: "Jeans", price: 60, image: "https://picsum.photos/300?2" },
  { id: 3, name: "Hoodie", price: 45, image: "https://picsum.photos/300?3" },
  { id: 4, name: "Sneakers", price: 120, image: "https://picsum.photos/300?4" },
];

// RENDER PRODUCTS
function renderProducts() {
  const container = document.getElementById("products");
  container.innerHTML = "";

  products.forEach(p => {
    container.innerHTML += `
      <div class="card">
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    `;
  });
}

// ADD
function addToCart(id) {
  const item = cart.find(x => x.id === id);
  if (item) item.qty++;
  else cart.push({ id, qty: 1 });

  renderCart();
}

// CART UI
function renderCart() {
  const el = document.getElementById("cart-items");
  const totalEl = document.getElementById("total");
  const countEl = document.getElementById("cart-count");

  if (!el) return; // prevents crash

  el.innerHTML = "";

  let total = 0;
  let count = 0;

  cart.forEach(item => {
    const p = products.find(x => x.id === item.id);
    total += p.price * item.qty;
    count += item.qty;

    el.innerHTML += `
      <div>
        ${p.name} x ${item.qty}
        <button onclick="changeQty(${item.id}, -1)">-</button>
        <button onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    `;
  });

  totalEl.innerText = "Total: $" + total;
  countEl.innerText = count;
}

// +/- buttons
function changeQty(id, change) {
  const item = cart.find(x => x.id === id);
  if (!item) return;

  item.qty += change;

  if (item.qty <= 0) {
    cart = cart.filter(x => x.id !== id);
  }

  renderCart();
}

// CART TOGGLE
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

  try {
    const res = await fetch(API + "/payment/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart, address, email })
    });

    const data = await res.json();

    window.location.href = data.url;

  } catch (err) {
    alert("Checkout failed");
    console.error(err);
  }
}

// INIT
renderProducts();
renderCart();
