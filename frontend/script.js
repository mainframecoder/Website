const products = [
  { id:1, name:"T-Shirt", price:25, image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" },
  { id:2, name:"Jeans", price:60, image:"https://images.unsplash.com/photo-1541099649105-f69ad21f3246" },
  { id:3, name:"Hoodie", price:45, image:"https://images.unsplash.com/photo-1556821840-3a63f95609a7" },
  { id:4, name:"Jacket", price:80, image:"https://images.unsplash.com/photo-1520975916090-3105956dac38" },
  { id:5, name:"Sneakers", price:90, image:"https://images.unsplash.com/photo-1528701800489-20be3c2ea6a0" },
  { id:6, name:"Cap", price:15, image:"https://images.unsplash.com/photo-1521369909029-2afed882baee" },
  { id:7, name:"Watch", price:120, image:"https://images.unsplash.com/photo-1519744346363-d0a6b6c7c3d8" },
  { id:8, name:"Backpack", price:70, image:"https://images.unsplash.com/photo-1503342217505-b0a15ec3261c" },
  { id:9, name:"Sunglasses", price:40, image:"https://images.unsplash.com/photo-1511499767150-a48a237f0083" },
  { id:10, name:"Shirt", price:35, image:"https://images.unsplash.com/photo-1602810316991-76db3f8a1c58" },
  { id:11, name:"Shorts", price:30, image:"https://images.unsplash.com/photo-1593030761757-71fae45fa0e7" },
  { id:12, name:"Blazer", price:110, image:"https://images.unsplash.com/photo-1594938298603-c8148c4dae35" }
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
      <p>$${p.price} CAD</p>
      <button>Add to Cart</button>
    `;

    div.querySelector("img").onclick = () => {
      window.open(`product.html?id=${p.id}`, "_blank");
    };

    div.querySelector("button").onclick = () => addToCart(p.id);

    container.appendChild(div);
  });
}

function addToCart(id) {
  const p = products.find(x => x.id === id);
  cart.push(p);
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const totalEl = document.getElementById("total");
  const countEl = document.getElementById("cartCount");

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price;
    cartItems.innerHTML += `<p>${item.name} - $${item.price}</p>`;
  });

  totalEl.innerText = total;
  countEl.innerText = cart.length;
}

// CART TOGGLE
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

// CHECKOUT
document.getElementById("checkoutBtn").onclick = () => {
  if (cart.length === 0) return alert("Cart empty!");

  const name = prompt("Enter your name:");
  const address = prompt("Enter delivery address:");

  localStorage.setItem("order", JSON.stringify({
    cart,
    name,
    address
  }));

  window.location.href = "/success.html";
};

loadProducts();
