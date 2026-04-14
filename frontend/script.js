const API = "https://website-9gq9.onrender.com";

let products = [];
let cart = JSON.parse(localStorage.getItem("cart") || "{}");

/* ================= INIT ================= */
window.onload = () => {
  loadProducts();
  updateCart();

  // sync cart across tabs/pages
  window.addEventListener("storage", updateCart);
};

/* ================= LOAD PRODUCTS ================= */
async function loadProducts() {
  try {
    const res = await fetch(API + "/products");
    const data = await res.json();

    products = Array.isArray(data) ? data : Object.values(data);

    renderProducts(products);
  } catch (err) {
    console.error("Error loading products:", err);
  }
}

/* ================= RENDER PRODUCTS ================= */
function renderProducts(list) {
  const el = document.getElementById("products");
  if (!el) return;

  el.innerHTML = list.map(p => {
    const v = p.variants[0]; // first variant

    return `
      <div class="card" onclick="openProduct(${p.id})">
        <img src="${v.image}" onerror="this.style.display='none'">
        <h3>${p.name}</h3>
        <p>$${v.price}</p>

        <button onclick="event.stopPropagation(); addToCart(${v.id})">
          Add to Cart
        </button>
      </div>
    `;
  }).join("");
}

/* ================= NAVIGATION ================= */
function openProduct(id) {
  window.location.href = "product.html?id=" + id;
}

function goHome() {
  window.location.href = "/";
}

function goOrders() {
  window.location.href = "orders.html";
}

/* ================= CART ================= */
function addToCart(variantId) {
  if (!cart[variantId]) {
    cart[variantId] = { qty: 0 };
  }

  cart[variantId].qty++;

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCart();
  toast("Added to cart 🛒");
}

function updateCart() {
  const el = document.getElementById("cartCount");
  if (!el) return;

  let count = 0;
  Object.values(cart).forEach(i => count += i.qty);

  el.innerText = count;
}

/* ================= CART MODAL ================= */
function openCart() {
  document.getElementById("cartModal").style.display = "block";
  renderCart();
}

function closeCart() {
  document.getElementById("cartModal").style.display = "none";
}

function renderCart() {
  const el = document.getElementById("cartItems");
  const totalEl = document.getElementById("total");

  if (!el) return;

  let html = "";
  let total = 0;

  products.forEach(p => {
    p.variants.forEach(v => {
      if (cart[v.id]) {
        let qty = cart[v.id].qty;
        total += v.price * qty;

        html += `
          <div style="margin-bottom:10px;">
            <b>${p.name}</b><br>
            ${v.color} / ${v.size}<br>
            $${v.price} × ${qty}

            <button onclick="changeQty(${v.id},1)">+</button>
            <button onclick="changeQty(${v.id},-1)">-</button>
          </div>
        `;
      }
    });
  });

  el.innerHTML = html || "Cart is empty";
  if (totalEl) totalEl.innerText = "Total: $" + total;
}

function changeQty(id, delta) {
  if (!cart[id]) return;

  cart[id].qty += delta;

  if (cart[id].qty <= 0) {
    delete cart[id];
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  renderCart();
  updateCart();
}

/* ================= CHECKOUT ================= */
async function checkout() {
  const email = document.getElementById("email").value;
  const address = document.getElementById("address").value;

  if (!email || !address) {
    alert("Enter email & address");
    return;
  }

  let items = [];

  Object.keys(cart).forEach(id => {
    items.push({
      variant_id: parseInt(id),
      qty: cart[id].qty
    });
  });

  try {
    const res = await fetch(API + "/payment/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        address,
        items
      })
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Checkout failed");
    }

  } catch (err) {
    console.error(err);
    alert("Error in checkout");
  }
}

/* ================= SEARCH ================= */
function searchProducts() {
  const q = document.getElementById("search").value.toLowerCase();

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(q)
  );

  renderProducts(filtered);
}

/* ================= FILTER ================= */
function filterCategory(cat) {
  if (!cat) return renderProducts(products);

  const filtered = products.filter(p =>
    p.category && p.category === cat
  );

  renderProducts(filtered);
}

/* ================= AUTH ================= */
async function signup() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPass").value;

  try {
    const res = await fetch(API + "/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    alert(data.msg || "Signup done");

  } catch (err) {
    console.error(err);
    alert("Signup error");
  }
}

async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPass").value;

  try {
    const res = await fetch(API + "/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", email);
      alert("Login successful");
    } else {
      alert("Login failed");
    }

  } catch (err) {
    console.error(err);
    alert("Login error");
  }
}

/* ================= TOAST ================= */
function toast(msg) {
  let t = document.createElement("div");
  t.className = "toast";
  t.innerText = msg;

  document.body.appendChild(t);

  setTimeout(() => t.remove(), 2000);
}
