const API = "https://website-9gq9.onrender.com";

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || {};

/* ================= INIT ================= */
window.onload = () => {
  loadProducts();

  const user = localStorage.getItem("user");
  if (user && document.getElementById("loginEmail")) {
    document.getElementById("loginEmail").value = user;
  }
};

/* ================= LOAD PRODUCTS ================= */
async function loadProducts() {
  try {
    const res = await fetch(API + "/products");
    const data = await res.json();

    console.log("Products:", data);

    // 🔥 FIX: handle object response
    products = Array.isArray(data) ? data : Object.values(data);

    renderProducts(products);

  } catch (err) {
    console.error("Error loading products:", err);
  }
}

/* ================= RENDER PRODUCTS ================= */
function renderProducts(list) {
  const container = document.getElementById("products");
  if (!container) return;

  container.innerHTML = list.map(p => `
    <div class="card" onclick="openProduct(${p.id})">
      <img src="${p.image}">
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

function goHome() {
  window.location.href = "/";
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

  const count = Object.values(cart).reduce((a, b) => a + b, 0);
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

  try {
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

  } catch (err) {
    console.error(err);
    alert("Login error");
  }
}

async function signup() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPass").value;

  try {
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

  } catch (err) {
    console.error(err);
    alert("Signup error");
  }
}
