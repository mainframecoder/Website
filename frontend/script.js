const API = "https://website-9gq9.onrender.com";

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || {};

/* ================= FETCH PRODUCTS ================= */
async function loadProducts() {
  const res = await fetch(API + "/products");
  products = await res.json();
  renderProducts(products);
}

function renderProducts(list) {
  const container = document.getElementById("products");

  container.innerHTML = list.map(p => `
    <div class="card" onclick="openProduct(${p.id})">
      <img src="${p.image}" onerror="this.src='https://via.placeholder.com/300'">
      <h3>${p.name}</h3>
      <p>$${p.price}</p>

      <button onclick="event.stopPropagation(); addToCart(${p.id})">
        Add to Cart
      </button>
    </div>
  `).join("");

  updateCartCount();
}

/* ================= PRODUCT NAV ================= */
function openProduct(id) {
  window.open(`product.html?id=${id}`, "_blank");
}

/* ================= CART ================= */
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const el = document.getElementById("cartCount");
  if (!el) return;

  let count = Object.values(cart).reduce((a, b) => a + b, 0);
  el.innerText = count;
}

/* ================= SEARCH ================= */
function searchProducts() {
  const q = document.getElementById("search").value.toLowerCase();

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(q)
  );

  renderProducts(filtered);
}

/* ================= FILTER ================= */
function filterCategory(cat) {
  if (!cat) return renderProducts(products);

  const filtered = products.filter(p => p.category === cat);
  renderProducts(filtered);
}

/* ================= AUTH ================= */
async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPass").value;

  const res = await fetch(API + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.access_token) {
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", email);
    alert("Login successful");
  } else {
    alert("Login failed");
  }
}

async function signup() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPass").value;

  const res = await fetch(API + "/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.message) {
    alert("Account created");
  } else {
    alert("Signup failed");
  }
}

/* ================= INIT ================= */
window.onload = () => {
  loadProducts();

  let user = localStorage.getItem("user");
  if (user && document.getElementById("loginEmail")) {
    document.getElementById("loginEmail").value = user;
  }
};
