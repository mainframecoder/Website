const API = "https://website-9gq9.onrender.com";

let products = [
  {id:1, name:"Jeans", price:60, img:"https://images.unsplash.com/photo-1541099649105-f69ad21f3246"},
  {id:2, name:"T-Shirt", price:25, img:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"},
  {id:3, name:"Hoodie", price:45, img:"https://images.unsplash.com/photo-1556821840-3a63f95609a7"},
  {id:4, name:"Sneakers", price:120, img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff"},
  {id:5, name:"Socks", price:10, img:"https://images.unsplash.com/photo-1586350977771-b3b0abd50c82"},
  {id:6, name:"Cap", price:15, img:"https://images.unsplash.com/photo-1521369909029-2afed882baee"},
  {id:7, name:"Jacket", price:90, img:"https://images.unsplash.com/photo-1520975916090-3105956dac38"},
  {id:8, name:"Shirt", price:40, img:"https://images.unsplash.com/photo-1523381210434-271e8be1f52b"},
  {id:9, name:"Shorts", price:30, img:"https://images.unsplash.com/photo-1593030761757-71fae45fa0e7"},
  {id:10, name:"Sweater", price:50, img:"https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1"},
  {id:11, name:"Track Pants", price:55, img:"https://images.unsplash.com/photo-1595341595379-cf1cd0fb7fb3"},
  {id:12, name:"Formal Shirt", price:70, img:"https://images.unsplash.com/photo-1596755094514-f87e34085b2c"},
  {id:13, name:"Blazer", price:150, img:"https://images.unsplash.com/photo-1593032465175-481ac7f401a0"},
  {id:14, name:"Flip Flops", price:20, img:"https://images.unsplash.com/photo-1582582494700-7e7c9b9f6e67"},
  {id:15, name:"Boots", price:130, img:"https://images.unsplash.com/photo-1600185365483-26d7a4cc7519"},
  {id:16, name:"Scarf", price:18, img:"https://images.unsplash.com/photo-1600180758890-6b94519a8ba6"},
  {id:17, name:"Gloves", price:22, img:"https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb"},
  {id:18, name:"Watch", price:200, img:"https://images.unsplash.com/photo-1518546305927-5a555bb7020d"},
  {id:19, name:"Belt", price:25, img:"https://images.unsplash.com/photo-1600185365528-2b9c3c59d9e4"},
  {id:20, name:"Backpack", price:80, img:"https://images.unsplash.com/photo-1514474959185-1472d4c4e0f0"}
];

let cart = {};

function renderProducts(list = products) {
  const container = document.getElementById("products");
  container.innerHTML = "";

  list.forEach(p => {
    container.innerHTML += `
      <div class="card">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <button onclick="addToCart(${p.id})">Add</button>
      </div>
    `;
  });
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
}

function renderCart() {
  let html = "";
  let total = 0;

  Object.keys(cart).forEach(id => {
    let p = products.find(x => x.id == id);
    let qty = cart[id];
    let subtotal = p.price * qty;

    total += subtotal;

    html += `
      <div>
        ${p.name} (${qty}) - $${p.price} each → $${subtotal}
      </div>
    `;
  });

  document.getElementById("cartItems").innerHTML = html;
  document.getElementById("total").innerText = "Total: $" + total;
}

function searchProducts() {
  const val = document.getElementById("search").value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(val));
  renderProducts(filtered);
}

function checkout() {
  const email = document.getElementById("email").value;

  let cartArray = Object.keys(cart).map(id => ({
    id: parseInt(id),
    qty: cart[id]
  }));

  fetch(API + "/payment/create-checkout-session", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({cart: cartArray, email})
  })
  .then(res => res.json())
  .then(data => {
    window.location.href = data.url;
  });
}

renderProducts();
