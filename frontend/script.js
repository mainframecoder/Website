const API = "https://website-9gq9.onrender.com";

const products = [
  {id:1,name:"T-Shirt",price:25,img:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",rating:4},
  {id:2,name:"Jeans",price:60,img:"https://images.unsplash.com/photo-1541099649105-f69ad21f3246",rating:5},
  {id:3,name:"Hoodie",price:45,img:"https://images.unsplash.com/photo-1556821840-3a63f95609a7",rating:4},
  {id:4,name:"Sneakers",price:90,img:"https://images.unsplash.com/photo-1528701800489-20be3c3ea7a0",rating:4}
];

let cart = [];

/* RENDER */
function render() {
  const el = document.getElementById("products");
  el.innerHTML = "";

  products.forEach(p => {
    el.innerHTML += `
      <div class="card">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <button onclick="add(${p.id})">Add</button>
      </div>
    `;
  });
}

/* CART */
function add(id) {
  const item = cart.find(i => i.id === id);
  if (item) item.qty++;
  else cart.push({...products.find(p=>p.id===id), qty:1});
  update();
}

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
        ${i.name}
        <div>
          <button onclick="dec(${index})">-</button>
          ${i.qty}
          <button onclick="inc(${index})">+</button>
        </div>
      </div>
    `;
  });

  total.innerText = t;
  count.innerText = cart.length;
}

function inc(i){ cart[i].qty++; update(); }
function dec(i){ cart[i].qty--; if(cart[i].qty<=0) cart.splice(i,1); update(); }

/* CART TOGGLE */
document.getElementById("cartBtn").onclick = () => {
  document.getElementById("cartPanel").classList.toggle("show");
  document.getElementById("overlay").classList.toggle("show");
};

/* CHECKOUT FIXED */
document.getElementById("checkoutBtn").onclick = async () => {
  if(cart.length === 0) return alert("Cart empty");

  const res = await fetch(`${API}/payment/create-checkout-session`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      items: cart.map(i => ({
        name: i.name,
        price: i.price,
        qty: i.qty
      }))
    })
  });

  const data = await res.json();

  if(data.url){
    window.location.href = data.url;
  } else {
    alert("Stripe error");
    console.log(data);
  }
};

render();
