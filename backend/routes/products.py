<!DOCTYPE html>
<html>
<head>
  <title>Product</title>
  <link rel="stylesheet" href="style.css">
</head>

<body>

<header>
  <div class="container header-inner">
    <h1 onclick="goHome()">🛒 My Store</h1>
  </div>
</header>

<div class="container" id="productDetail"></div>

<script>
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));

const products = JSON.parse(localStorage.getItem("products"));
const p = products.find(x => x.id === id);

/* 🔥 IMAGE GALLERY MAP */
const galleryMap = {
  "T-Shirt": [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    "https://images.unsplash.com/photo-1583743814966-8936f37f4c84",
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
    "https://images.unsplash.com/photo-1593032465171-8c1b5b5c1c90",
    "https://images.unsplash.com/photo-1618354691321-e851c56960d1"
  ],
  "Jeans": [
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
    "https://images.unsplash.com/photo-1475178626620-a4d074967452",
    "https://images.unsplash.com/photo-1514996937319-344454492b37",
    "https://images.unsplash.com/photo-1506629905607-d405b7a1b4d0",
    "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891"
  ],
  "Hoodie": [
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
    "https://images.unsplash.com/photo-1602810319428-019690571b5b",
    "https://images.unsplash.com/photo-1520975916090-3105956dac38",
    "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7",
    "https://images.unsplash.com/photo-1583743814966-8936f37f4c84"
  ],
  "Sneakers": [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    "https://images.unsplash.com/photo-1519741497674-611481863552",
    "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6",
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
    "https://images.unsplash.com/photo-1597045566677-8cf032ed6634"
  ]
};

if(p){
  let base = p.name.split(" ")[0];
  let images = galleryMap[base] || [p.img];

  document.getElementById("productDetail").innerHTML = `
    <div style="display:flex;gap:40px;margin-top:50px;">

      <div>
        <img id="mainImg" src="${images[0]}" style="width:350px;border-radius:10px">

        <div style="display:flex;gap:10px;margin-top:10px;">
          ${images.map(img=>`
            <img src="${img}" width="60"
            onclick="document.getElementById('mainImg').src='${img}'"
            onerror="this.src='https://via.placeholder.com/60'">
          `).join("")}
        </div>
      </div>

      <div>
        <h1>${p.name}</h1>
        <h2>$${p.price}</h2>

        <p>Premium quality product. Comfortable, stylish and durable.</p>

        <h3>Select Size:</h3>
        <select>
          <option>S</option>
          <option>M</option>
          <option>L</option>
          <option>XL</option>
        </select>

        <br><br>

        <button class="checkout-btn" onclick="addToCart(${p.id})">
          Add to Cart
        </button>
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

function goHome(){
  window.location.href = "/";
}
</script>

</body>
</html>
