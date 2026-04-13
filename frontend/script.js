const API = "https://website-9gq9.onrender.com";

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

  const list = Object.values(data);

  const el = document.getElementById("products");
  if(!el) return;

  el.innerHTML = list.map(p=>{
    let img = Object.values(p.color_images)[0][0];

    return `
      <div class="card" onclick="openProduct(${p.id})">
        <img src="${img}">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <button onclick="event.stopPropagation(); addToCart(${p.id})">Add</button>
      </div>
    `;
  }).join("");
}

/* NAV */
function openProduct(id){
  window.location.href = "product.html?id=" + id;
}

function goHome(){
  window.location.href = "/";
}

function goOrders(){
  window.location.href = "orders.html";
}

/* CART */
function addToCart(id){
  if(!cart[id]) cart[id] = {qty:0};

  cart[id].qty++;
  localStorage.setItem("cart", JSON.stringify(cart));

  updateCart();
  toast("Added to cart");
}

function updateCart(){
  let count = 0;
  Object.values(cart).forEach(i=>count+=i.qty);

  const el = document.getElementById("cartCount");
  if(el) el.innerText = count;
}

/* TOAST */
function toast(msg){
  let t = document.createElement("div");
  t.className="toast";
  t.innerText=msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),2000);
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

  const data = await res.json();
  alert(data.msg || "Error");
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

  if(data.msg){
    localStorage.setItem("user",email);
    alert("Logged in");
  }else{
    alert("Failed");
  }
}
