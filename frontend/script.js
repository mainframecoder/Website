const API = "https://website-9gq9.onrender.com";

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || {};

/* INIT */
window.onload = () => {
  loadProducts();
  updateCart();
};

/* LOAD */
async function loadProducts() {
  const res = await fetch(API + "/products");
  const data = await res.json();
  products = Object.values(data);
  renderProducts(products);
}

/* RENDER */
function renderProducts(list) {
  const el = document.getElementById("products");

  el.innerHTML = list.map(p => {
    const firstImg = Object.values(p.colors)[0][0];

    return `
      <div class="card" onclick="openProduct(${p.id})">
        <img src="${firstImg}">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <button onclick="event.stopPropagation(); addToCart(${p.id})">Add</button>
      </div>
    `;
  }).join("");
}

/* NAV */
function openProduct(id){
  window.location.href = `/product.html?id=${id}`;
}

/* CART */
function addToCart(id, size="M", color="Red"){
  cart[id] = {qty: (cart[id]?.qty || 0) + 1, size, color};
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
  toast("Added to cart");
}

function updateCart(){
  const el = document.getElementById("cartCount");
  if(!el) return;

  let count = 0;
  Object.values(cart).forEach(i => count += i.qty);
  el.innerText = count;
}

/* TOAST */
function toast(msg){
  let t = document.createElement("div");
  t.className = "toast";
  t.innerText = msg;
  document.body.appendChild(t);

  setTimeout(()=>t.remove(),2000);
}
