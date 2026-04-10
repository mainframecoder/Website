document.getElementById("checkoutBtn").onclick = async () => {
  if (cart.length === 0) return alert("Cart empty!");

  const name = prompt("Enter your name:");
  const address = prompt("Enter address:");

  const res = await fetch("https://website-9gq9.onrender.com/payment/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      items: cart.map(i => ({
        name: i.name,
        price: i.price,
        qty: 1
      })),
      name,
      address
    })
  });

  const data = await res.json();
  window.location.href = data.url;
};
