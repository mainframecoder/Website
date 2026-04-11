const API = "https://website-9gq9.onrender.com"; // your backend

let cart = [];
let wishlist = [];

/* 🔥 PRODUCTS (20 items) */
let products = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: "Product " + (i + 1),
  price: Math.floor(Math.random() * 150) + 20,
  img: `https://picsum.photos/400?random=${i}`,
  rating: Math.floor(Math.random() * 5) + 1
}));

/* =========================
   RENDER PRODUCTS
========================= */
function renderProducts(list = products) {
  const container = document.getElementById("products");
  if (!container) return;

  container.innerHTML = "";

  list.forEach(p => {
    container.innerHTML += `
      <div class="card">
        <div class="heart" onclick="toggleWishlist(${p.id})">❤️</div>

        <img src="${p.img}" onclick="openProduct(${p.id})"/>

        <h3>${p.name}</h3>

        <p>${"⭐".repeat(p.rating)}</p>

        <p>$${p.price}</p>

        <button onclick="addToCart(${p.id})">
          🛒 Add to Cart
        </button>
      </div>
    `;
  });
}

/* =========================
   CART LOGIC
========================= */
function addToCart(id) {
  let item = cart.find(i => i.id === id);

  if (item) {
    item.qty++;
  } else {
    let p = products.find(x => x.id === id);
    if (!p) return;
    cart.push({ ...p, qty: 1 });
  }

  renderCart();
}

function changeQty(id, delta) {
  let item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  renderCart();
}

/* =========================
   RENDER CART
========================= */
function renderCart() {
  const el = document.getElementById("cartItems");
  const count = document.getElementById("cartCount");
  const totalEl = document.getElementById("cartTotal");

  // 🔥 Prevent crash
  if (!el || !count || !totalEl) {
    console.warn("Cart elements missing");
    return;
  }

  el.innerHTML = "";
  let total = 0;

  cart.forEach(i => {
    total += i.price * i.qty;

    el.innerHTML += `
      <div class="cart-item">
        <div>
          <b>${i.name}</b><br/>
          $${i.price}
        </div>

        <div class="qty-box">
          <button onclick="changeQty(${i.id}, -1)">-</button>
          <span>${i.qty}</span>
          <button onclick="changeQty(${i.id}, 1)">+</button>
        </div>
      </div>
    `;
  });

  count.innerText = cart.length;
  totalEl.innerText = "$" + total;
}

/* =========================
   CART UI (OPEN / CLOSE)
========================= */
function toggleCart() {
  const cartEl = document.getElementById("cart");
  const overlay = document.getElementById("overlay");

  if (!cartEl || !overlay) return;

  cartEl.classList.toggle("show");
  overlay.classList.toggle("show");
}

/* =========================
   SEARCH
========================= */
function searchProducts(val) {
  let filtered = products.filter(p =>
    p.name.toLowerCase().includes(val.toLowerCase())
  );

  renderProducts(filtered);
}

/* =========================
   FILTER
========================= */
function filterPrice(val) {
  if (val === "all") {
    renderProducts();
    return;
  }

  let filtered = products.filter(p =>
    val === "above" ? p.price > 50 : p.price <= 50
  );

  renderProducts(filtered);
}

/* =========================
   WISHLIST
========================= */
function toggleWishlist(id) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(x => x !== id);
  } else {
    wishlist.push(id);
  }
}

/* =========================
   PRODUCT PAGE
========================= */
function openProduct(id) {
  window.open(`product.html?id=${id}`, "_blank");
}

/* =========================
   CHECKOUT (STRIPE)
========================= */
async function checkout() {
  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  let address = prompt("Enter delivery address:");
  if (!address) return;

  try {
    const res = await fetch(`${API}/payment/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ cart, address })
    });

    if (!res.ok) {
      throw new Error("Server error");
    }

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Payment failed");
    }

  } catch (err) {
    console.error(err);
    alert("Checkout failed (backend issue)");
  }
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();
});
