const API = "https://website-9gq9.onrender.com"; // 🔥 your Render backend

let cart = [];
let wishlist = [];
let products = [
  { id:1, name:"T-Shirt 1", price:55, img:"https://picsum.photos/300?1", rating:4 },
  { id:2, name:"Jeans 2", price:56, img:"https://picsum.photos/300?2", rating:5 },
  { id:3, name:"Hoodie 3", price:68, img:"https://picsum.photos/300?3", rating:4 },
  { id:4, name:"Sneakers 4", price:120, img:"https://picsum.photos/300?4", rating:5 },
  { id:5, name:"Cap 5", price:25, img:"https://picsum.photos/300?5", rating:3 },
  { id:6, name:"Watch 6", price:150, img:"https://picsum.photos/300?6", rating:5 },
  { id:7, name:"Shirt 7", price:45, img:"https://picsum.photos/300?7", rating:4 },
  { id:8, name:"Jacket 8", price:180, img:"https://picsum.photos/300?8", rating:5 },
  { id:9, name:"Shoes 9", price:95, img:"https://picsum.photos/300?9", rating:4 },
  { id:10, name:"Bag 10", price:130, img:"https://picsum.photos/300?10", rating:5 },
  { id:11, name:"Glasses 11", price:60, img:"https://picsum.photos/300?11", rating:4 },
  { id:12, name:"Belt 12", price:40, img:"https://picsum.photos/300?12", rating:3 },
  { id:13, name:"Sweater 13", price:70, img:"https://picsum.photos/300?13", rating:5 },
  { id:14, name:"Shorts 14", price:35, img:"https://picsum.photos/300?14", rating:4 },
  { id:15, name:"Perfume 15", price:200, img:"https://picsum.photos/300?15", rating:5 }
];

function renderProducts(list = products) {
  const container = document.getElementById("products");
  container.innerHTML = "";

  list.forEach(p => {
    container.innerHTML += `
      <div class="card">
        <div class="heart" onclick="toggleWishlist(${p.id})">❤️</div>
        <img src="${p.img}" onclick="openProduct(${p.id})"/>
        <h3>${p.name}</h3>
        <p>${"⭐".repeat(p.rating)}</p>
        <p>$${p.price}</p>
        <button onclick="addToCart(${p.id})">🛒 Add to Cart</button>
      </div>
    `;
  });
}

/* CART */
function addToCart(id) {
  let item = cart.find(i => i.id === id);
  if (item) item.qty++;
  else {
    let p = products.find(x => x.id === id);
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

function renderCart() {
  const el = document.getElementById("cartItems");
  const count = document.getElementById("cartCount");
  const totalEl = document.getElementById("cartTotal");

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
          ${i.qty}
          <button onclick="changeQty(${i.id}, 1)">+</button>
        </div>
      </div>
    `;
  });

  count.innerText = cart.length;
  totalEl.innerText = "$" + total;
}

/* CART UI */
function toggleCart() {
  document.getElementById("cart").classList.toggle("show");
  document.getElementById("overlay").classList.toggle("show");
}

/* SEARCH */
function searchProducts(val) {
  let filtered = products.filter(p =>
    p.name.toLowerCase().includes(val.toLowerCase())
  );
  renderProducts(filtered);
}

/* FILTER */
function filterPrice(val) {
  if (val === "all") return renderProducts();

  let filtered = products.filter(p =>
    val === "above" ? p.price > 50 : p.price <= 50
  );

  renderProducts(filtered);
}

/* WISHLIST */
function toggleWishlist(id) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(x => x !== id);
  } else {
    wishlist.push(id);
  }
}

/* PRODUCT PAGE */
function openProduct(id) {
  window.open(`product.html?id=${id}`, "_blank");
}

/* CHECKOUT (REAL STRIPE) */
async function checkout() {
  if (cart.length === 0) {
    alert("Cart empty");
    return;
  }

  let address = prompt("Enter delivery address:");
  if (!address) return;

  try {
    const res = await fetch(`${API}/payment/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart, address }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url; // 🔥 redirect to Stripe
    } else {
      alert("Payment error");
    }
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

/* INIT */
renderProducts();
renderCart();
