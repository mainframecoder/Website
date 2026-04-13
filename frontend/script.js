const API = "https://website-9gq9.onrender.com";

/* ---------------- IMAGE MAP ---------------- */
const imageMap = {
  "T-Shirt": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
  "Jeans": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
  "Hoodie": "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
  "Sneakers": "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  "Jacket": "https://images.unsplash.com/photo-1520975916090-3105956dac38",
  "Cap": "https://images.unsplash.com/photo-1521369909029-2afed882baee",
  "Watch": "https://images.unsplash.com/photo-1518546305927-5a555bb7020d",
  "Shirt": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
  "Shorts": "https://images.unsplash.com/photo-1593032465171-8c1b5b5c1c90",
  "Sweatshirt": "https://images.unsplash.com/photo-1618354691321-e851c56960d1"
};

/* ---------------- STATE ---------------- */
let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || {};

/* ---------------- SAVE CART ---------------- */
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* ---------------- FETCH PRODUCTS ---------------- */
fetch(API + "/products")
  .then(res => res.json())
  .then(data => {

    products = Object.values(data).map(p => {
      let baseName = p.name.split(" ")[0];

      return {
        ...p,
        img: imageMap[baseName] || imageMap["T-Shirt"]
      };
    });

    localStorage.setItem("products", JSON.stringify(products));

    renderProducts();
    updateCart();
  });

/* ---------------- RENDER PRODUCTS ---------------- */
function renderProducts(list = products) {
  let html = "";

  list.forEach(p => {
    html += `
      <div class="card" onclick="openProduct(${p.id})">
        <img src="${p.img}" onerror="this.src='https://via.placeholder.com/300'">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <button class="add-btn" onclick="event.stopPropagation(); addToCart(${p.id})">
          Add to Cart
        </button>
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
    if (!p) return;

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
      localStorage.removeItem("cart");
      window.location.href = data.url;
    });
}

/* ---------------- LOGIN ---------------- */
function login(){
  let email = document.getElementById("loginEmail").value;
  let password = document.getElementById("loginPass").value;

  fetch(API + "/auth/login", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({email,password})
  })
  .then(res=>res.json())
  .then(()=>{
    localStorage.setItem("user", email);
    alert("Logged in");
  });
}

/* ---------------- NAVIGATION ---------------- */
function goOrders(){
  window.location.href = "orders.html";
}

function goHome(){
  window.location.href = "/";
}

/* ---------------- INIT ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("cartBtn").addEventListener("click", openCart);
});
