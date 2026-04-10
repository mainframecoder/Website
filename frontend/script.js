const API = "https://website-9gq9.onrender.com";

/* 🔥 50 PRODUCTS (REAL IMAGES) */
const products = [
  ...Array.from({length:50}, (_,i)=>({
    id:i+1,
    name:[
      "T-Shirt","Jeans","Hoodie","Jacket","Sneakers","Cap","Watch","Backpack",
      "Sunglasses","Shirt","Shoes","Coat","Shorts","Earbuds","Bag","Vest"
    ][i%16] + " " + (i+1),

    price: Math.floor(Math.random()*150)+20,

    img:`https://picsum.photos/400/300?random=${i+1}`,

    rating: Math.floor(Math.random()*2)+4
  }))
];

localStorage.setItem("products", JSON.stringify(products));

let cart = [];
let wishlist = [];

/* 🔥 RENDER */
function render(list = products) {
  const el = document.getElementById("products");
  el.innerHTML = "";

  list.forEach(p => {
    el.innerHTML += `
      <div class="card">
        <span class="heart" onclick="wish(${p.id})">❤️</span>

        <img src="${p.img}" onclick="openProduct(${p.id})">

        <h3>${p.name}</h3>
        <p style="color:#f59e0b">${"⭐".repeat(p.rating)}</p>
        <p>$${p.price}</p>

        <button onclick="add(${p.id})">🛒 Add to Cart</button>
      </div>
    `;
  });
}

/* 🔥 ADD TO CART */
function add(id) {
  const item = cart.find(i => i.id === id);

  if (item) item.qty++;
  else {
    const p = products.find(x => x.id === id);
    cart.push({...p, qty:1});
  }

  update();
}

/* 🔥 CART UPDATE (PREMIUM UI) */
function update() {
  const el = document.getElementById("cartItems");
  const total = document.getElementById("total");
  const count = document.getElementById("cartCount");

  el.innerHTML = "";
  let t = 0;

  cart.forEach((i, index) => {
    t += i.price * i.qty;

    el.innerHTML += `
      <div class="cart-item">
        <div>
          <strong>${i.name}</strong><br>
          $${i.price}
        </div>

        <div class="qty-box">
          <button onclick="dec(${index})">−</button>
          <span>${i.qty}</span>
          <button onclick="inc(${index})">+</button>
        </div>
      </div>
    `;
  });

  total.innerText = t;
  count.innerText = cart.length;
}

/* 🔥 QTY */
function inc(i){ cart[i].qty++; update(); }
function dec(i){
  cart[i].qty--;
  if(cart[i].qty<=0) cart.splice(i,1);
  update();
}

/* 🔥 SEARCH */
document.getElementById("search").oninput = e => {
  const v = e.target.value.toLowerCase();
  render(products.filter(p => p.name.toLowerCase().includes(v)));
};

/* 🔥 FILTER */
document.getElementById("filter").onchange = e => {
  const v = e.target.value;

  if(v==="low") render(products.filter(p=>p.price<50));
  else if(v==="high") render(products.filter(p=>p.price>=50));
  else render(products);
};

/* 🔥 CART OPEN */
document.getElementById("cartBtn").onclick = () => {
  document.getElementById("cartPanel").classList.toggle("show");
  document.getElementById("overlay").classList.toggle("show");
};

/* 🔥 CHECKOUT (FIXED) */
document.getElementById("checkoutBtn").onclick = async () => {

  if(cart.length === 0){
    alert("Cart is empty");
    return;
  }

  const address = prompt("Enter delivery address");

  const res = await fetch(`${API}/payment/create-checkout-session`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      items: cart.map(i => ({
        name: i.name,
        price: i.price,
        qty: i.qty
      })),
      address
    })
  });

  const data = await res.json();

  console.log("Stripe response:", data);

  if(data.url){
    window.location.href = data.url;
  } else {
    alert("Checkout failed");
  }
};

/* 🔥 PRODUCT PAGE */
function openProduct(id){
  window.open(`product.html?id=${id}`, "_blank");
}

/* 🔥 WISHLIST */
function wish(){
  alert("Added to wishlist ❤️");
}

/* INIT */
render();
