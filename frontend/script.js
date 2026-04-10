const API = "https://website-9gq9.onrender.com";

const products = [
  { id:1,name:"T-Shirt",price:25,image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"},
  { id:2,name:"Jeans",price:60,image:"https://images.unsplash.com/photo-1541099649105-f69ad21f3246"},
  { id:3,name:"Hoodie",price:45,image:"https://images.unsplash.com/photo-1556821840-3a63f95609a7"},
];

let cart = [];

function loadProducts(){
  const c=document.getElementById("products");
  products.forEach(p=>{
    c.innerHTML+=`
      <div class="card">
        <img src="${p.image}" onclick="openProduct(${p.id})">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <button onclick="add(${p.id})">Add</button>
      </div>`;
  });
}

function openProduct(id){
  window.open(`product.html?id=${id}`,"_blank");
}

function add(id){
  const p=products.find(x=>x.id===id);
  cart.push(p);
  update();
}

function update(){
  const el=document.getElementById("cartItems");
  const total=document.getElementById("total");
  const count=document.getElementById("cartCount");

  el.innerHTML="";
  let t=0;

  cart.forEach(i=>{
    t+=i.price;
    el.innerHTML+=`<p>${i.name}</p>`;
  });

  total.innerText=t;
  count.innerText=cart.length;
}

document.getElementById("checkoutBtn").onclick=async()=>{
  const name=prompt("Name");
  const address=prompt("Address");

  const res=await fetch(`${API}/payment/create-checkout-session`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      items:cart.map(i=>({name:i.name,price:i.price,qty:1})),
      name,address
    })
  });

  const data=await res.json();
  window.location.href=data.url;
};

loadProducts();
