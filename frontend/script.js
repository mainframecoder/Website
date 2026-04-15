const API = "https://website-9gq9.onrender.com";

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || {};

/* ================= INIT ================= */
window.onload = () => {
  loadProducts();
  updateCart();

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

    // 🔥 handle both array + object
    products = Array.isArray(data) ? data : Object.values(data);

    renderProducts(products);

  } catch (err) {
    console.error("Error loading products:", err);
  }
}

/* ================= RENDER PRODUCTS ================= */
function renderProducts(list) {
  const el = document.getElementById("products");
  if (!el) return;

  if (!list.length) {
    el.innerHTML = "<p>No products found</p>";
    return;
  }

  el.innerHTML = list.map(p => `
    <div class="card" onclick="openProduct(${p.id})">
      <img src="${p.image}" 
           onerror="this.src='https://via.placeholder.com/300'">

      <h3>${p.name}</h3>
      <p>$${p.price}</p>

      <button onclick="event.stopPropagation(); addToCart(${p.id})">
        Add to Cart
      </button>
    </div>
  `).join("");
}

/* ================= NAVIGATION ================= */
function openProduct(id) {
  window.location.href = `/product.html?id=${id}`;
}

function goHome() {
  window.location.href = "/";
}

function goOrders() {
  window.location.href = "/orders.html";
}

/* ================= CART ================= */
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  localStorage.setItem("cart", JSON.stringify(cart));

  updateCart();
  showToast("Added to cart");
}

function updateCart() {
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
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    console.log("Login:", data);

    if (res.ok) {
      localStorage.setItem("user", email);
      showToast("Login successful");
    } else {
      showToast(data.error || "Login failed");
    }

  } catch (err) {
    console.error(err);
    showToast("Login error");
  }
}

async function signup() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPass").value;

  try {
    const res = await fetch(API + "/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    console.log("Signup:", data);

    if (res.ok) {
      showToast("Account created");
    } else {
      showToast(data.error || "Signup failed");
    }

  } catch (err) {
    console.error(err);
    showToast("Signup error");
  }
}

/* ================= TOAST ================= */
function showToast(msg) {
  let t = document.createElement("div");
  t.className = "toast";
  t.innerText = msg;

  document.body.appendChild(t);

  setTimeout(() => {
    t.remove();
  }, 2000);
}
