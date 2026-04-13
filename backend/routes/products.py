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
const id = params.get("id");

if (!id) {
  document.getElementById("productDetail").innerHTML = "Invalid product";
}

/* FETCH PRODUCT */
fetch(`${API}/products/${id}`)
  .then(res => res.json())
  .then(p => {

    if (!p || p.error) {
      document.getElementById("productDetail").innerHTML = "Product not found";
      return;
    }

    document.getElementById("productDetail").innerHTML = `
      <div style="display:flex;gap:40px;margin-top:50px;flex-wrap:wrap;">

        <div>
          <img src="${p.image}" style="width:350px;border-radius:10px"
               onerror="this.src='https://via.placeholder.com/400'">
        </div>

        <div>
          <h1>${p.name}</h1>
          <h2>$${p.price}</h2>

          <p>Premium quality product.</p>

          <label>Select Size:</label>
          <select>
            <option>S</option>
            <option>M</option>
            <option>L</option>
          </select>

          <br><br>

          <button onclick="addToCart(${p.id})">
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
