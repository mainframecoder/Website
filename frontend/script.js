const API = "https://website-9gq9.onrender.com";

/* IMAGE MAP */
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

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || {};

function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* FETCH PRODUCTS */
fetch(API + "/products")
  .then(res => res.json())
  .then(data => {
    products = Object.values(data).map(p => {
      let base = p.name.split(" ")[0];
      return {
        ...p,
        img: imageMap[base] || imageMap["T-Shirt"]
      };
    });

    renderProducts();
    updateCart();
  });

/* RENDER */
function renderProducts(list = products){
  let html = "";
  list.forEach(p=>{
    html += `
      <div class="card" onclick="openProduct(${p.id})">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <button class="add-btn" onclick="event.stopPropagation(); addToCart(${p.id})">Add</button>
      </div>
    `;
  });
  document.getElementById("products").innerHTML = html;
}

/* SEARCH */
function searchProducts(){
  let val = document.getElementById("search").value.toLowerCase();
  renderProducts(products.filter(p=>p.name.toLowerCase().includes(val)));
}

/* FILTER */
function filterCategory(cat){
  if(!cat) return renderProducts();
  renderProducts(products.filter(p=>p.category===cat));
}

/* PRODUCT PAGE */
function openProduct(id){
  window.open(`product.html?id=${id}`,"_blank");
}

/* CART */
function addToCart(id){
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  updateCart();
}

function updateCart(){
  let total=0,count=0,items="";
  Object.keys(cart).forEach(id=>{
    let p = products.find(x=>x.id==id);
    if(!p) return;
    let q = cart[id];
    total+=p.price*q;
    count+=q;

    items+=`<div class="cart-item">${p.name} x ${q}</div>`;
  });

  document.getElementById("cartItems").innerHTML = items || "Empty";
  document.getElementById("total").innerText = "Total: $"+total;
  document.getElementById("cartCount").innerText = count;
}

/* MODAL */
function openCart(){
  document.getElementById("cartModal").style.display="flex";
}
function closeCart(){
  document.getElementById("cartModal").style.display="none";
}

/* CHECKOUT */
function checkout(){
  let email=document.getElementById("email").value;
  let address=document.getElementById("address").value;

  fetch(API+"/payment/create-checkout-session",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      cart:Object.keys(cart).map(id=>({id:+id,qty:cart[id]})),
      email,address
    })
  })
  .then(r=>r.json())
  .then(d=>{
    localStorage.removeItem("cart");
    window.location.href=d.url;
  });
}

/* LOGIN + SIGNUP */
function login(){
  let email=loginEmail.value;
  let password=loginPass.value;

  fetch(API+"/auth/login",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({email,password})
  })
  .then(res=>{
    if(!res.ok) throw "err";
    localStorage.setItem("user",email);
    alert("Logged in");
  })
  .catch(()=>alert("Invalid login"));
}

function signup(){
  fetch(API+"/auth/register",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      email:loginEmail.value,
      password:loginPass.value
    })
  })
  .then(()=>alert("Account created"));
}

function goOrders(){
  window.location.href="orders.html";
}

function goHome(){
  window.location.href="/";
}

/* INIT */
document.addEventListener("DOMContentLoaded",()=>{
  document.getElementById("cartBtn").addEventListener("click",openCart);
});
