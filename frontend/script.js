const API = "https://website-9gq9.onrender.com";

/* 20 PRODUCTS */
const products = [
  {id:1,name:"Classic T-Shirt",price:25,img:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",rating:4},
  {id:2,name:"Blue Jeans",price:60,img:"https://images.unsplash.com/photo-1541099649105-f69ad21f3246",rating:5},
  {id:3,name:"Hoodie",price:45,img:"https://images.unsplash.com/photo-1556821840-3a63f95609a7",rating:4},
  {id:4,name:"Leather Jacket",price:120,img:"https://images.unsplash.com/photo-1520975916090-3105956dac38",rating:5},
  {id:5,name:"Sneakers",price:90,img:"https://images.unsplash.com/photo-1528701800489-20be3c3ea7a0",rating:4},
  {id:6,name:"Cap",price:15,img:"https://images.unsplash.com/photo-1519741497674-611481863552",rating:3},
  {id:7,name:"Smart Watch",price:150,img:"https://images.unsplash.com/photo-1517433456452-f9633a875f6f",rating:5},
  {id:8,name:"Backpack",price:70,img:"https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",rating:4},
  {id:9,name:"Sunglasses",price:35,img:"https://images.unsplash.com/photo-1511499767150-a48a237f0083",rating:4},
  {id:10,name:"Formal Shirt",price:55,img:"https://images.unsplash.com/photo-1521334884684-d80222895322",rating:4},
  {id:11,name:"Sports Shoes",price:95,img:"https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77",rating:5},
  {id:12,name:"Denim Jacket",price:110,img:"https://images.unsplash.com/photo-1520974735194-3f6b5d9c2c6e",rating:4},
  {id:13,name:"Track Pants",price:40,img:"https://images.unsplash.com/photo-1552902865-b72c031ac5ea",rating:4},
  {id:14,name:"Wireless Earbuds",price:130,img:"https://images.unsplash.com/photo-1585386959984-a41552231658",rating:5},
  {id:15,name:"Laptop Bag",price:80,img:"https://images.unsplash.com/photo-1515879218367-8466d910aaa4",rating:4},
  {id:16,name:"Casual Shorts",price:30,img:"https://images.unsplash.com/photo-1503342452485-86ff0aef9e41",rating:3},
  {id:17,name:"Formal Shoes",price:140,img:"https://images.unsplash.com/photo-1528701800489-20be3c3ea7a0",rating:5},
  {id:18,name:"Gym Vest",price:20,img:"https://images.unsplash.com/photo-1520975916090-3105956dac38",rating:4},
  {id:19,name:"Winter Coat",price:180,img:"https://images.unsplash.com/photo-1539533113208-f6df8cc8b543",rating:5},
  {id:20,name:"Analog Watch",price:160,img:"https://images.unsplash.com/photo-1518546305927-5a555bb7020d",rating:4}
];

localStorage.setItem("products", JSON.stringify(products));

let cart = [];
let wishlist = [];

/* RENDER */
function render(list){
  const el=document.getElementById("products");
  el.innerHTML="";

  list.forEach(p=>{
    el.innerHTML+=`
      <div class="card">
        <span class="heart" onclick="wish(${p.id})">❤️</span>
        <img src="${p.img}" onclick="openProduct(${p.id})">
        <h3>${p.name}</h3>
        <p>${"⭐".repeat(p.rating)}</p>
        <p>$${p.price}</p>
        <button onclick="add(${p.id})">🛒 Add to Cart</button>
      </div>
    `;
  });
}

/* CART */
function add(id){
  const item=cart.find(i=>i.id===id);
  if(item) item.qty++;
  else{
    const p=products.find(x=>x.id===id);
    cart.push({...p,qty:1});
  }
  update();
}

function update(){
  const el=document.getElementById("cartItems");
  const total=document.getElementById("total");
  const count=document.getElementById("cartCount");

  el.innerHTML="";
  let t=0;

  cart.forEach((i,index)=>{
    t+=i.price*i.qty;

    el.innerHTML+=`
      <div class="cart-item">
        <span>${i.name}</span>
        <div class="qty-box">
          <button onclick="dec(${index})">-</button>
          ${i.qty}
          <button onclick="inc(${index})">+</button>
        </div>
      </div>
    `;
  });

  total.innerText=t;
  count.innerText=cart.length;
}

function inc(i){ cart[i].qty++; update(); }
function dec(i){ cart[i].qty--; if(cart[i].qty<=0) cart.splice(i,1); update(); }

/* SEARCH */
document.getElementById("search").oninput=e=>{
  const v=e.target.value.toLowerCase();
  render(products.filter(p=>p.name.toLowerCase().includes(v)));
};

/* FILTER */
document.getElementById("filter").onchange=e=>{
  const v=e.target.value;
  if(v==="low") render(products.filter(p=>p.price<50));
  else if(v==="high") render(products.filter(p=>p.price>=50));
  else render(products);
};

/* CART TOGGLE */
document.getElementById("cartBtn").onclick=()=>{
  document.getElementById("cartPanel").classList.toggle("show");
  document.getElementById("overlay").classList.toggle("show");
};

/* CHECKOUT */
document.getElementById("checkoutBtn").onclick=async()=>{
  const address=prompt("Enter Address");

  const res=await fetch(`${API}/payment/create-checkout-session`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      items:cart.map(i=>({name:i.name,price:i.price,qty:i.qty})),
      address
    })
  });

  const data=await res.json();
  window.location.href=data.url;
};

/* OTHER */
function wish(){ alert("Added to wishlist ❤️"); }
function openProduct(id){ window.open(`product.html?id=${id}`,"_blank"); }

render(products);
