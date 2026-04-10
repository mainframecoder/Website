const products = [
  { id: 1, name: "T-Shirt", price: 20, image: "https://picsum.photos/200?1" },
  { id: 2, name: "Jeans", price: 40, image: "https://picsum.photos/200?2" },
  { id: 3, name: "Jacket", price: 60, image: "https://picsum.photos/200?3" },
  { id: 4, name: "Hoodie", price: 35, image: "https://picsum.photos/200?4" },
  { id: 5, name: "Shirt", price: 25, image: "https://picsum.photos/200?5" },
  { id: 6, name: "Shorts", price: 18, image: "https://picsum.photos/200?6" },
  { id: 7, name: "Sweater", price: 45, image: "https://picsum.photos/200?7" },
  { id: 8, name: "Blazer", price: 80, image: "https://picsum.photos/200?8" },
  { id: 9, name: "Track Pants", price: 30, image: "https://picsum.photos/200?9" },
  { id: 10, name: "Kurta", price: 22, image: "https://picsum.photos/200?10" },
  { id: 11, name: "Saree", price: 70, image: "https://picsum.photos/200?11" },
  { id: 12, name: "Lehenga", price: 120, image: "https://picsum.photos/200?12" },
  { id: 13, name: "Coat", price: 90, image: "https://picsum.photos/200?13" },
  { id: 14, name: "Tank Top", price: 15, image: "https://picsum.photos/200?14" },
  { id: 15, name: "Cargo Pants", price: 50, image: "https://picsum.photos/200?15" }
];

let cart = [];

const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");

/* LOAD PRODUCTS */
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

/* ADD */
function addToCart(id) {
  const item = cart.find(p => p.id === id);
  if (item) item.qty++;
  else {
    const product = products.find(p => p.id === id);
    cart.push({ ...product, qty: 1 });
  }
  updateCart();
}

/* INCREASE */
function increase(id) {
  cart.find(p => p.id === id).qty++;
  updateCart();
}

/* DECREASE */
function decrease(id) {
  const item = cart.find(p => p.id === id);
  if (item.qty > 1) item.qty--;
  else cart = cart.filter(p => p.id !== id);
  updateCart();
}

/* UPDATE */
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

/* TOGGLE */
document.getElementById("cartBtn").onclick = () => {
  cartPanel.classList.toggle("show");
  overlay.classList.toggle("show");
};

/* CLOSE BUTTON */
document.getElementById("closeCart").onclick = () => {
  cartPanel.classList.remove("show");
  overlay.classList.remove("show");
};

/* OVERLAY CLICK */
overlay.onclick = () => {
  cartPanel.classList.remove("show");
  overlay.classList.remove("show");
};

/* CHECKOUT */
document.getElementById("checkoutBtn").onclick = () => {
  if (cart.length === 0) return alert("Cart empty!");
  alert("✅ Order placed!");
  cart = [];
  updateCart();
  cartPanel.classList.remove("show");
  overlay.classList.remove("show");
};

/* INIT */
loadProducts();
