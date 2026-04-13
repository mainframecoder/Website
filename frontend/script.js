const API = "https://website-9gq9.onrender.com";

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || {};

/* INIT */
window.onload = () => {
  loadProducts();
  updateCartCount();

  // 🔥 LIVE SYNC (important)
  window.addEventListener("storage", updateCartCount);
};

/* LOAD */
async function loadProducts() {
  const res = await fetch(API + "/products");
  const data = await res.json();

  products = Array.isArray(data) ? data : Object.values(data);
  renderProducts(products);
}

/* RENDER */
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
}

/* NAV */
function openProduct(id) {
  window.location.href = `product.html?id=${id}`;
}

/* CART */
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const el = document.getElementById("cartCount");
  if (!el) return;

  const count = Object.values(JSON.parse(localStorage.getItem("cart") || "{}"))
    .reduce((a, b) => a + b, 0);

  el.innerText = count;
}
