const API = "https://website-9gq9.onrender.com";

const products = [
  { id: 1, name: "T-Shirt", price: 20, image: "https://picsum.photos/200?1" },
  { id: 2, name: "Jeans", price: 40, image: "https://picsum.photos/200?2" },
  { id: 3, name: "Jacket", price: 60, image: "https://picsum.photos/200?3" },
  { id: 4, name: "Hoodie", price: 35, image: "https://picsum.photos/200?4" }
];

let cart = [];

const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");

function loadProducts() {
  const container = document.getElementById("products");

  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <img src="${p.image}">
      <h3>${p.name}</h3>
      <p>$${p.price}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    `;

    container.appendChild(div);
  });
}

function addToCart(id) {
  const item = cart.find(p => p.id === id);
  if (item) item.qty++;
  else {
    const product = products.find(p => p.id === id);
    cart.push({ ...product, qty: 1 });
  }
  updateCart();
}

function increase(id) {
  cart.find(p => p.id === id).qty++;
  updateCart();
}

function decrease(id) {
  const item = cart.find(p => p.id === id);
  if (item.qty > 1) item.qty--;
  else cart = cart.filter(p => p.id !== id);
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const totalEl = document.getElementById("total");
  const countEl = document.getElementById("cartCount");

  cartItems.innerHTML = "";
  let total = 0, count = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    count += item.qty;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <span>${item.name}</span>
      <div class="qty">
        <button onclick="decrease(${item.id})">-</button>
        <span>${item.qty}</span>
        <button onclick="increase(${item.id})">+</button>
      </div>
      <span>$${item.price * item.qty}</span>
    `;

    cartItems.appendChild(div);
  });

  totalEl.innerText = total;
  countEl.innerText = count;
}

document.getElementById("cartBtn").onclick = () => {
  cartPanel.classList.toggle("show");
  overlay.classList.toggle("show");
};

document.getElementById("closeCart").onclick = () => {
  cartPanel.classList.remove("show");
  overlay.classList.remove("show");
};

overlay.onclick = () => {
  cartPanel.classList.remove("show");
  overlay.classList.remove("show");
};

document.getElementById("checkoutBtn").onclick = async () => {
  if (cart.length === 0) return alert("Cart empty!");

  const res = await fetch(`${API}/payment/create-checkout-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ items: cart })
  });

  const data = await res.json();
  window.location.href = data.url;
};

loadProducts();
