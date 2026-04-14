const API = "https://website-9gq9.onrender.com";

let products = [];
let cart = JSON.parse(localStorage.getItem("cart") || "{}");

/* INIT */
window.onload = () => {
  loadProducts();
  updateCart();
};

/* PRODUCTS */
async function loadProducts(){
  const res = await fetch(API + "/products");
  const data = await res.json();
  products = data;
  renderProducts(products);
}

function renderProducts(list){
  const el = document.getElementById("products");
  if(!el) return;

  el.innerHTML = list.map(p=>{
    const v = p.variants[0];

    return `
      <div class="card" onclick="openProduct(${p.id})">
        <img src="${v.image}">
        <h3>${p.name}</h3>
        <p>$${v.price}</p>

        <button onclick="event.stopPropagation(); addToCart(${v.id})">
          Add to Cart
        </button>
      </div>
    `;
  }).join("");
}

function openProduct(id){
  window.location.href = "product.html?id=" + id;
}

/* CART */
function addToCart(id){
  if(!cart[id]) cart[id] = {qty:0};
  cart[id].qty++;
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

function updateCart(){
  const el = document.getElementById("cartCount");
  if(!el) return;

  let count = 0;
  Object.values(cart).forEach(i=>count+=i.qty);
  el.innerText = count;
}

function openCart(){
  document.getElementById("cartModal").style.display="block";
  renderCart();
}

function closeCart(){
  document.getElementById("cartModal").style.display="none";
}

function renderCart(){
  const el = document.getElementById("cartItems");
  let total = 0;

  let html = "";

  products.forEach(p=>{
    p.variants.forEach(v=>{
      if(cart[v.id]){
        const q = cart[v.id].qty;
        total += v.price*q;

        html += `
          <div>
            ${p.name} (${v.color}/${v.size}) - ${q}
          </div>
        `;
      }
    });
  });

  el.innerHTML = html || "Empty";
  document.getElementById("total").innerText = "Total: $" + total;
}

/* CHECKOUT */
async function checkout(){
  const email = document.getElementById("email").value;
  const address = document.getElementById("address").value;

  const items = Object.keys(cart).map(id=>({
    variant_id: parseInt(id),
    qty: cart[id].qty
  }));

  const res = await fetch(API + "/payment/create-checkout-session",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({email,address,items})
  });

  const data = await res.json();

  window.location.href = data.url;
}

/* AUTH */
async function signup(){
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPass").value;

  const res = await fetch(API+"/auth/register",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({email,password})
  });

  alert("Registered");
}

async function login(){
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPass").value;

  const res = await fetch(API+"/auth/login",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({email,password})
  });

  const data = await res.json();

  if(data.access_token){
    localStorage.setItem("user",email);
    alert("Logged in");
  }
}

function goOrders(){
  window.location.href = "orders.html";
}

function goHome(){
  window.location.href = "/";
}

function searchProducts(){
  const q = document.getElementById("search").value.toLowerCase();
  renderProducts(products.filter(p=>p.name.toLowerCase().includes(q)));
}
