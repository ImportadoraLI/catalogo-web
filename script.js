const carrito = [];

document.addEventListener("DOMContentLoaded", function () {
  const botones = document.querySelectorAll(".categoria");
  const productos = document.querySelectorAll(".producto");

  botones.forEach(boton => {
    boton.addEventListener("click", () => {
      const filtro = boton.getAttribute("data-filtro");

      // Elimina clase activa de todos los botones y la agrega al actual
      botones.forEach(b => b.classList.remove("activa"));
      boton.classList.add("activa");

      productos.forEach(prod => {
        const categoria = prod.getAttribute("data-categoria");
        prod.style.display = (filtro === "Todos" || filtro === categoria) ? "block" : "none";
      });
    });
  });
});

function agregarAlCarrito(boton) {
  const producto = boton.closest(".producto");
  const nombre = producto.querySelector("h3").textContent;
  const precio1 = parseFloat(producto.dataset.precio1);
  const precio3 = parseFloat(producto.dataset.precio3);
  const precio10 = parseFloat(producto.dataset.precio10);

  const index = carrito.findIndex(item => item.nombre === nombre);

  if (index !== -1) {
    carrito[index].cantidad += 1;
  } else {
    carrito.push({ nombre, cantidad: 1, precio1, precio3, precio10 });
  }

  actualizarCarrito();
}

function obtenerPrecioUnitario(item) {
  if (item.cantidad >= 10) return item.precio10;
  if (item.cantidad >= 3) return item.precio3;
  return item.precio1;
}

function actualizarCarrito() {
  const tbody = document.querySelector("#carrito tbody");
  tbody.innerHTML = "";
  let total = 0;

  carrito.forEach((item, i) => {
    const precioUnitario = obtenerPrecioUnitario(item);
    const subtotal = precioUnitario * item.cantidad;
    total += subtotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.nombre}</td>
      <td><input type="number" value="${item.cantidad}" min="1" onchange="cambiarCantidad(${i}, this.value)"></td>
      <td>$${precioUnitario.toFixed(2)}</td>
      <td>$${subtotal.toFixed(2)}</td>
      <td><button onclick="eliminarProducto(${i})">X</button></td>
    `;
    tbody.appendChild(row);
  });

  document.getElementById("total").textContent = `Total: $${total.toFixed(2)} MXN`;
}

function cambiarCantidad(index, cantidad) {
  carrito[index].cantidad = parseInt(cantidad);
  actualizarCarrito();
}

function eliminarProducto(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

function enviarCarrito() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  let mensaje = "Hola, quiero comprar lo siguiente:\n";
  let total = 0;

  carrito.forEach(item => {
    const precioUnitario = obtenerPrecioUnitario(item);
    const subtotal = precioUnitario * item.cantidad;
    mensaje += `- ${item.nombre} x${item.cantidad} = $${subtotal.toFixed(2)} MXN\n`;
    total += subtotal;
  });

  mensaje += `\nTotal: $${total.toFixed(2)} MXN`;

  const numero = "5215587606732";
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}
