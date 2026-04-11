function renderCart() {
  const el = document.getElementById("cartItems");
  const count = document.getElementById("cartCount");
  const totalEl = document.getElementById("cartTotal");

  if (!el || !count || !totalEl) {
    console.error("Cart elements missing in HTML");
    return;
  }

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
