const API = "https://website-9gq9.onrender.com"; // ⚠️ your Render backend

const products = [
  {id:1,name:"T-Shirt",price:25,img:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"},
  {id:2,name:"Jeans",price:60,img:"https://images.unsplash.com/photo-1541099649105-f69ad21f3246"},
  {id:3,name:"Hoodie",price:45,img:"https://images.unsplash.com/photo-1556821840-3a63f95609a7"},
  {id:4,name:"Jacket",price:80,img:"https://images.unsplash.com/photo-1520975916090-3105956dac38"},
  {id:5,name:"Sneakers",price:90,img:"https://images.unsplash.com/photo-1528701800489-20be3c2ea6a0"},
  {id:6,name:"Cap",price:15,img:"https://images.unsplash.com/photo-1521369909029-2afed882baee"},
  {id:7,name:"Watch",price:120,img:"https://images.unsplash.com/photo-1519744346363-d0a6b6c7c3d8"},
  {id:8,name:"Backpack",price:70,img:"https://images.unsplash.com/photo-1503342217505-b0a15ec3261c"},
  {id:9,name:"Sunglasses",price:40,img:"https://images.unsplash.com/photo-1511499767150-a48a237f0083"},
  {id:10,name:"Shirt",price:35,img:"https://images.unsplash.com/photo-1602810316991-76db3f8a1c58"},
  {id:11,name:"Shorts",price:30,img:"https://images.unsplash.com/photo-1593030761757-71fae45fa0e7"},
  {id:12,name:"Blazer",price:110,img:"https://images.unsplash.com/photo-1594938298603-c8148c4dae35"},
  {id:13,name:"Sweater",price:50,img:"https://images.unsplash.com/photo-1585386959984-a4155224a1c9"},
  {id:14,name:"Kurta",price:45,img:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf"},
  {id:15,name:"Coat",price:130,img:"https://images.unsplash.com/photo-1591047139829-d91aecb6caea"}
];

let cart = [];

// DOM
const productsDiv = document.getElementById("products");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const totalEl = document.getElementById("total");
const countEl = document.getElementById("cartCount");

// LOAD PRODUCTS
function loadProducts() {
  products.forEach(p => {
    productsDiv.innerHTML += `
      <div class="card">
        <img src="${p.img}" onclick="openProduct(${p.id})">
        <h3>${p.name}</h3>
        <p>$${p.price} CAD</p>
        <button onclick="add(${p.id})">Add</button>
      </div>
    `;
  });
}

// OPEN PRODUCT PAGE
function openProduct(id){
  window.open(`product.html?id=${id}`, "_blank");
}

// ADD TO CART
function add(id){
  const item = cart.find(i => i.id === id);

  if(item){
    item.qty++;
  } else {
    const p = products.find(x => x.id === id);
    cart.push({...p, qty:1});
  }

  updateCart();
}

// INCREASE
function increase(id){
  cart.find(i => i.id === id).qty++;
  updateCart();
}

// DECREASE
function decrease(id){
  const item = cart.find(i => i.id === id);

  if(item.qty > 1){
    item.qty--;
  } else {
    cart = cart.filter(i => i.id !== id);
  }

  updateCart();
}

// UPDATE CART UI
function updateCart(){
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(i=>{
    total += i.price * i.qty;

    cartItems.innerHTML += `
      <div>
        <p>${i.name}</p>
        <div class="qty">
          <button onclick="decrease(${i.id})">-</button>
          <span>${i.qty}</span>
          <button onclick="increase(${i.id})">+</button>
        </div>
        <p>$${i.price * i.qty} CAD</p>
      </div>
      <hr>
    `;
  });

  totalEl.innerText = total;
  countEl.innerText = cart.length;
}

// CART OPEN/CLOSE
document.getElementById("cartBtn").onclick = ()=>{
  cartPanel.classList.toggle("show");
  overlay.classList.toggle("show");
};

overlay.onclick = ()=>{
  cartPanel.classList.remove("show");
  overlay.classList.remove("show");
};

// ✅ REAL STRIPE CHECKOUT (FIXED)
document.getElementById("checkoutBtn").onclick = async () => {

  if(cart.length === 0){
    alert("Cart empty");
    return;
  }

  const name = prompt("Enter Name");
  if(!name) return;

  const address = prompt("Enter Address");
  if(!address) return;

  try {
    const res = await fetch(`${API}/payment/create-checkout-session`,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({
        items: cart.map(i => ({
          name: i.name,
          price: i.price,
          qty: i.qty
        })),
        name,
        address
      })
    });

    const data = await res.json();

    console.log("Stripe response:", data);

    if(!data.url){
      alert("Stripe error. Check backend.");
      return;
    }

    window.location.href = data.url;

  } catch(err){
    console.error(err);
    alert("Checkout failed. Check console.");
  }
};

loadProducts();
