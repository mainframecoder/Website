const products = [
  { id:1, name:"T-Shirt", price:25, image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" },
  { id:2, name:"Jeans", price:60, image:"https://images.unsplash.com/photo-1541099649105-f69ad21f3246" },
  { id:3, name:"Hoodie", price:45, image:"https://images.unsplash.com/photo-1556821840-3a63f95609a7" },
  { id:4, name:"Jacket", price:80, image:"https://images.unsplash.com/photo-1520975916090-3105956dac38" },
];

let cart = [];

// SAFE DOM LOAD
window.onload = () => {

  const cartPanel = document.getElementById("cartPanel");
  const overlay = document.getElementById("overlay");

  const productsDiv = document.getElementById("products");
  const cartItems = document.getElementById("cartItems");
  const totalEl = document.getElementById("total");
  const countEl = document.getElementById("cartCount");

  function loadProducts() {
    products.forEach(p => {
      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <p>$${p.price} CAD</p>
        <button>Add</button>
      `;

      div.querySelector("img").onclick = () => {
        window.open(`product.html?id=${p.id}`, "_blank");
      };

      div.querySelector("button").onclick = () => {
        cart.push(p);
        updateCart();
      };

      productsDiv.appendChild(div);
    });
  }

  function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(i => {
      total += i.price;
      cartItems.innerHTML += `<p>${i.name} - $${i.price}</p>`;
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

  // CHECKOUT (TEMP)
  document.getElementById("checkoutBtn").onclick = () => {
    alert("Checkout working!");
  };

  loadProducts();
};
