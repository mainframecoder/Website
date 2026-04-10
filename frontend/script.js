const API = "https://website-9gq9.onrender.com";

const products = [
  {
    id: 1,
    name: "Classic T-Shirt",
    price: 25,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
      "https://images.unsplash.com/photo-1583743814966-8936f37f4678",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27"
    ],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 2,
    name: "Blue Jeans",
    price: 60,
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
      "https://images.unsplash.com/photo-1582552938357-32b906df40cb",
      "https://images.unsplash.com/photo-1604176354204-9268737828e4",
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7"
    ],
    sizes: ["30", "32", "34", "36"]
  },
  {
    id: 3,
    name: "Hoodie",
    price: 45,
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
      "https://images.unsplash.com/photo-1602810316991-76db3f8a1c58",
      "https://images.unsplash.com/photo-1585386959984-a4155224a1c9",
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531"
    ],
    sizes: ["S", "M", "L", "XL"]
  },

  // 👉 Add more (total 15)
  ...Array.from({ length: 12 }).map((_, i) => ({
    id: i + 4,
    name: `Fashion Item ${i + 4}`,
    price: 20 + i * 5,
    images: [
      `https://picsum.photos/300?random=${i+10}`,
      `https://picsum.photos/300?random=${i+20}`,
      `https://picsum.photos/300?random=${i+30}`,
      `https://picsum.photos/300?random=${i+40}`
    ],
    sizes: ["S", "M", "L"]
  }))
];

let cart = [];

function loadProducts() {
  const container = document.getElementById("products");
  container.innerHTML = "";

  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <img src="${p.images[0]}" onclick="openProduct(${p.id})">
      <h3>${p.name}</h3>
      <p>$${p.price} CAD</p>
      <button onclick="quickAdd(${p.id})">Add</button>
    `;

    container.appendChild(div);
  });
}

function openProduct(id) {
  window.open(`product.html?id=${id}`, "_blank");
}

function quickAdd(id) {
  const product = products.find(p => p.id === id);
  cart.push({ ...product, qty: 1, size: "M" });
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

    cartItems.innerHTML += `
      <div class="cart-item">
        <span>${item.name} (${item.size})</span>
        <span>$${item.price * item.qty}</span>
      </div>
    `;
  });

  totalEl.innerText = total;
  countEl.innerText = count;
}

// 🔥 STRIPE CHECKOUT
document.getElementById("checkoutBtn").onclick = async () => {
  if (cart.length === 0) return alert("Cart empty!");

  const res = await fetch(`${API}/payment/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: cart })
  });

  const data = await res.json();
  window.location.href = data.url;
};

loadProducts();
