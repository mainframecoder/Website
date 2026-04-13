const API = "https://website-9gq9.onrender.com";

/* ---------------- PRODUCTS (50 ITEMS) ---------------- */
let products = Array.from({ length: 50 }, (_, i) => {
  const categories = ["clothing", "footwear", "accessories"];
  const names = ["T-Shirt", "Jeans", "Hoodie", "Sneakers", "Jacket", "Cap", "Watch"];
  const name = names[i % names.length];

  return {
    id: i + 1,
    name: name + " " + (i + 1),
    price: 20 + (i % 10) * 10,
    category: categories[i % 3],
    img: `https://source.unsplash.com/400x400/?${name.toLowerCase()},fashion`
  };
});

/* SAVE PRODUCTS */
localStorage.setItem("products", JSON.stringify(products));

/* ---------------- CART (PERSIST) ---------------- */
let cart = JSON.parse(localStorage.getItem("cart")) || {};

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* ---------------- RENDER PRODUCTS ---------------- */
function renderProducts(list = products) {
  let html = "";

  list.forEach(p => {
    html += `
      <div class="card" onclick="openProduct(${p.id})">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <button class="add-btn" onclick="event.stopPropagation(); addToCart(${p.id})">Add to Cart</button>
      </div>
    `;
  });

  document.getElementById("products").innerHTML = html;
}

/* ---------------- SEARCH ---------------- */
function searchProducts() {
  let val = document.getElementById("search").value.toLowerCase();
  let filtered = products.filter(p => p.name.toLowerCase().includes(val));
  renderProducts(filtered);
}

/* ---------------- FILTER ---------------- */
function filterCategory(cat) {
  if (!cat) return renderProducts();
  let filtered = products.filter(p => p.category === cat);
  renderProducts(filtered);
}

/* ---------------- PRODUCT PAGE ---------------- */
function openProduct(id) {
  window.open(`product.html?id=${id}`, "_blank");
}

/* ---------------- CART ---------------- */
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  updateCart();
}

function changeQty(id, delta) {
  cart[id] += delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
  updateCart();
}

function updateCart() {
  let items = "";
  let total = 0;
  let count = 0;

  Object.keys(cart).forEach(id => {
    let p = products.find(x => x.id == id);
    let qty = cart[id];

    total += p.price * qty;
    count += qty;

    items += `
      <div class="cart-item">
        <span>${p.name}</span>
        <div>
          <button onclick="changeQty(${id}, -1)">-</button>
          ${qty}
          <button onclick="changeQty(${id}, 1)">+</button>
        </div>
      </div>
    `;
  });

  document.getElementById("cartItems").innerHTML = items || "Empty";
  document.getElementById("total").innerText = "Total: $" + total;
  document.getElementById("cartCount").innerText = count;
}

/* ---------------- MODAL ---------------- */
function openCart() {
  document.getElementById("cartModal").style.display = "flex";
}

function closeCart() {
  document.getElementById("cartModal").style.display = "none";
}

/* CLOSE ON OUTSIDE CLICK */
window.onclick = function (e) {
  let modal = document.getElementById("cartModal");
  if (e.target === modal) closeCart();
};

/* ---------------- CHECKOUT ---------------- */
function checkout() {
  let email = document.getElementById("email").value;
  let address = document.getElementById("address").value;

  if (!email || !address) {
    alert("Enter details");
    return;
  }

  let cartArray = Object.keys(cart).map(id => ({
    id: parseInt(id),
    qty: cart[id]
  }));

  fetch(API + "/payment/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cart: cartArray, email, address })
  })
    .then(res => res.json())
    .then(data => {
      localStorage.removeItem("cart"); // clear after checkout
      window.location.href = data.url;
    });
}

/* ---------------- INIT ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("cartBtn").addEventListener("click", openCart);
  updateCart();
  renderProducts();
});
