<!DOCTYPE html>
<html>
<head>
  <title>Product</title>
  <link rel="stylesheet" href="style.css">
</head>

<body>

<header>
  <div class="container header-inner">
    <h1 onclick="goHome()">My Store</h1>
  </div>
</header>

<div class="container" id="productDetail"></div>

<script>
const API = "https://website-9gq9.onrender.com";

const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));

fetch(API + "/products/" + id)
  .then(res => res.json())
  .then(p => {

    if (!p || p.error) {
      document.getElementById("productDetail").innerHTML = "Product not found";
      return;
    }

    const imageMap = {
      "T-Shirt": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
      "Jeans": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
      "Hoodie": "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
      "Sneakers": "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
    };

    let base = p.name.split(" ")[0];
    let img = imageMap[base] || imageMap["T-Shirt"];

    document.getElementById("productDetail").innerHTML = `
      <div style="display:flex;gap:40px;margin-top:50px;">

        <div>
          <img src="${img}" style="width:350px;border-radius:10px">
        </div>

        <div>
          <h1>${p.name}</h1>
          <h2>$${p.price}</h2>

          <p>Premium quality product.</p>

          <select>
            <option>S</option>
            <option>M</option>
            <option>L</option>
          </select>

          <br><br>

          <button class="checkout-btn" onclick="addToCart(${p.id})">
            Add to Cart
          </button>
        </div>

      </div>
    `;
  });

function addToCart(id){
  let cart = JSON.parse(localStorage.getItem("cart")) || {};
  cart[id] = (cart[id] || 0) + 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart");
}

function goHome(){
  window.location.href = "/";
}
</script>

</body>
</html>
