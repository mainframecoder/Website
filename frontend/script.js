const API = "https://website-9gq9.onrender.com";

let products = [
  {id:1, name:"Jeans", price:60, category:"clothing", img:"https://images.unsplash.com/photo-1541099649105-f69ad21f3246"},
  {id:2, name:"T-Shirt", price:25, category:"clothing", img:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"},
  {id:3, name:"Hoodie", price:45, category:"clothing", img:"https://images.unsplash.com/photo-1556821840-3a63f95609a7"},
  {id:4, name:"Sneakers", price:120, category:"footwear", img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff"},
  {id:5, name:"Socks", price:10, category:"footwear", img:"https://images.unsplash.com/photo-1586350977771-b3b0abd50c82"},
  {id:6, name:"Cap", price:15, category:"accessories", img:"https://images.unsplash.com/photo-1521369909029-2afed882baee"},
  {id:7, name:"Jacket", price:90, category:"clothing", img:"https://images.unsplash.com/photo-1520975916090-3105956dac38"},
  {id:8, name:"Watch", price:200, category:"accessories", img:"https://images.unsplash.com/photo-1518546305927-5a555bb7020d"}
];

let cart = {};

localStorage.setItem("products", JSON.stringify(products));

function renderProducts(list = products){
  const container = document.getElementById("products");
  container.innerHTML = "";

  list.forEach(p=>{
    container.innerHTML += `
      <div class="card">
        <img src="${p.img}" onclick="openProduct(${p.id})">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    `;
  });
}

function openProduct(id){
  window.location.href = "product.html?id=" + id;
}

function goHome(){
  window.location.href = "/";
}

function searchProducts(){
  let val = document.getElementById("search").value.toLowerCase();
  let filtered = products.filter(p=>p.name.toLowerCase().includes(val));
  renderProducts(filtered);
}

/* CART */
function addToCart(id){
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
}

function renderCart(){
  let html="";
  let total=0;
  let count=0;

  Object.keys(cart).forEach(id=>{
    let p=products.find(x=>x.id==id);
    let qty=cart[id];

    total += p.price * qty;
    count += qty;

    html += `<div class="cart-item">${p.name} x ${qty}</div>`;
  });

  document.getElementById("cartItems").innerHTML = html;
  document.getElementById("total").innerText = "Total: $" + total;
  document.getElementById("cartCount").innerText = count;
}

function openCart(){
  document.getElementById("cartModal").style.display="block";
}

function closeCart(){
  document.getElementById("cartModal").style.display="none";
}

/* CHECKOUT */
function checkout(){
  let email=document.getElementById("email").value;
  let address=document.getElementById("address").value;

  if(!email || !address){
    alert("Enter details");
    return;
  }

  let cartArray = Object.keys(cart).map(id=>({
    id:parseInt(id),
    qty:cart[id]
  }));

  fetch(API+"/payment/create-checkout-session",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({cart:cartArray,email,address})
  })
  .then(res=>res.json())
  .then(data=>window.location.href=data.url);
}

/* INIT */
renderProducts();
