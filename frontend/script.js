const API = "https://website-9gq9.onrender.com";

const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");

const products = [
  {
    id: 1,
    name: "Classic T-Shirt",
    price: 25,
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"],
    sizes: ["S","M","L"]
  },
  {
    id: 2,
    name: "Blue Jeans",
    price: 60,
    images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246"],
    sizes: ["30","32","34"]
  },
  {
    id: 3,
    name: "Hoodie",
    price: 45,
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7"],
    sizes: ["S","M","L"]
  }
];

let cart = [];

function loadProducts() {
  const container = document.getElementById("products");
  container.innerHTML = "";

  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <img src="${p.images[0]}" style="cursor:pointer">
      <h3>${p.name}</h3>
      <p>$${p.price} CAD</p>
      <button>Add</button>
    `;

    // ✅ CLICK IMAGE → OPEN PRODUCT
    div.querySelector("img").onclick = () => openProduct(p.id);

    // ✅ ADD BUTTON
    div.querySelector("button").onclick = () => addToCart(p.id);

    container.appendChild(div);
  });
}

function openProduct(id) {
  window.open(`product.html?id=${id}`, "_blank");
}

function addToCart(id) {
  const product = products.find(p => p.id === id);

  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...product, qty: 1, size: "M" });

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
      <span>${item.name} (${item.size})</span>
      <span>$${item.price * item.qty}</span>
    `;

    cartItems.appendChild(div);
  });

  totalEl.innerText = total;
  countEl.innerText = count;
}


// ✅ CART OPEN / CLOSE
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


// ✅ CHECKOUT (SAFE)
const checkoutBtn = document.getElementById("checkoutBtn");

if (checkoutBtn) {
  checkoutBtn.onclick = async () => {
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
}

loadProducts();
