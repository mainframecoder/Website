<!DOCTYPE html>
<html>
<head>
  <title>Product</title>
  <link rel="stylesheet" href="style.css">
</head>

<body>

<div class="container" id="productDetail"></div>

<script>
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));

const products = JSON.parse(localStorage.getItem("products"));
const p = products.find(x => x.id === id);

if(p){
  let images = Array.from({length:5}, (_,i)=>
    `https://source.unsplash.com/400x400/?${p.name},fashion,${i}`
  );

  document.getElementById("productDetail").innerHTML = `
    <div style="display:flex;gap:40px;margin-top:50px;">
      
      <div>
        <img id="mainImg" src="${images[0]}" style="width:350px;border-radius:10px">
        <div style="display:flex;gap:10px;margin-top:10px;">
          ${images.map(img=>`
            <img src="${img}" width="60" onclick="document.getElementById('mainImg').src='${img}'">
          `).join("")}
        </div>
      </div>

      <div>
        <h1>${p.name}</h1>
        <h2>$${p.price}</h2>

        <p>Premium quality product with modern design.</p>

        <h3>Sizes:</h3>
        <select>
          <option>S</option>
          <option>M</option>
          <option>L</option>
          <option>XL</option>
        </select>

        <br><br>
        <button class="checkout-btn" onclick="addToCart(${p.id})">Add to Cart</button>
      </div>

    </div>
  `;
}

function addToCart(id){
  let cart = JSON.parse(localStorage.getItem("cart")) || {};
  cart[id] = (cart[id] || 0) + 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart");
}
</script>

</body>
</html>
