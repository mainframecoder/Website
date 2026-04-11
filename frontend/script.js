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
let currentCategory = "all";
let currentPrice = "all";

/* SAVE PRODUCTS FOR PRODUCT PAGE */
localStorage.setItem("products", JSON.stringify(products));

function renderProducts(list = products) {
  const container = document.getElementById("products");
  container.innerHTML = "";

  list.forEach(p => {
    container.innerHTML += `
      <div class="card" onclick="openProduct(${p.id})">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
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

function filterCategory(val){
  currentCategory = val;
  applyFilters();
}

function filterPrice(val){
  currentPrice = val;
  applyFilters();
}

function applyFilters(){
  let filtered = products.filter(p => {
    let cat = currentCategory === "all" || p.category === currentCategory;

    let price = true;
    if(currentPrice==="low") price = p.price < 50;
    if(currentPrice==="mid") price = p.price <=100 && p.price>=50;
    if(currentPrice==="high") price = p.price >100;

    return cat && price;
  });

  renderProducts(filtered);
}

function searchProducts(){
  const val = document.getElementById("search").value.toLowerCase();

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(val)
  );

  renderProducts(filtered);
}

/* CART */
function openCart(){document.getElementById("cartModal").style.display="block";}
function closeCart(){document.getElementById("cartModal").style.display="none";}

function addToCart(id){
  cart[id] = (cart[id]||0)+1;
  renderCart();
}

function renderCart(){
  let html="";
  let total=0;

  Object.keys(cart).forEach(id=>{
    let p=products.find(x=>x.id==id);
    let qty=cart[id];
    total += p.price*qty;

    html += `<p>${p.name} x ${qty}</p>`;
  });

  document.getElementById("cartItems").innerHTML=html;
  document.getElementById("total").innerText="Total: $"+total;
}

/* INIT */
renderProducts();
