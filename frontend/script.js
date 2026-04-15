const API = "https://website-9gq9.onrender.com";

let products = [];
let cart = JSON.parse(localStorage.getItem("cart") || "{}");

/* INIT */
window.onload = () => {
  loadProducts();
  updateCart();

  // 🔥 sync cart across pages
  window.addEventListener("storage", updateCart);
};

/* LOAD */
async function loadProducts() {
  try {
    const res = await fetch(API + "/products");
    const data = await res.json();

    products = Array.isArray(data) ? data : Object.values(data);
    renderProducts(products);

  } catch (err) {
    console.error("Products load failed", err);
  }
}

/* RENDER */
function renderProducts(list) {
  const el = document.getElementById("products");
  if (!el) return;

  el.innerHTML = list.map(p => {

    // ✅ FIXED IMAGE SOURCE
    let img = p.color_images
      ? Object.values(p.color_images)[0][0]
      : p.image;

    return `
      <div class="card" onclick="openProduct(${p.id})">
        <img src="${img}" 
             onerror="this.src='https://via.placeholder.com/300'">

        <h3>${p.name}</h3>
        <p>$${p.price}</p>

        <button onclick="event.stopPropagation(); addToCart(${p.id})">
          Add
        </button>
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

  // ✅ FIX SAFE STRUCTURE
  if (!cart[id]) {
    cart[id] = { qty: 0, size, color };
  }

  cart[id].qty += 1;
  cart[id].size = size;
  cart[id].color = color;

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCart();
  toast("Added to cart 🛒");
}

function updateCart(){
  const el = document.getElementById("cartCount");
  if(!el) return;

  let freshCart = JSON.parse(localStorage.getItem("cart") || "{}");

  let count = 0;
  Object.values(freshCart).forEach(i => {
    count += i.qty || 0;
  });

  el.innerText = count;
}

/* TOAST */
function toast(msg){
  let t = document.createElement("div");
  t.className = "toast";
  t.innerText = msg;

  document.body.appendChild(t);

  setTimeout(()=>t.remove(), 2000);
}
