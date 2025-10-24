$(function () {
  let catalogo = [];

  // Cargar películas desde JSON
  $.getJSON("data/peliculas.json", function (pelis) {
    catalogo = pelis;
    const $sel = $("#peliculas");
    pelis.forEach((p) => {
      $sel.append(`<option value="${p.id}">${p.titulo}</option>`);
    });
  });

  // Calcular total con precio normal × días
  function calcularTotal(ids, dias) {
    let total = 0;
    const seleccion = [];
    ids.forEach((id) => {
      const p = catalogo.find((x) => x.id === Number(id));
      if (p) {
        const precio = Number(p.precios?.normal || 0);
        const subtotal = precio * dias;
        total += subtotal;
        seleccion.push({ titulo: p.titulo, precio, subtotal });
      }
    });
    return { total, seleccion };
  }

  // Submit → mostrar modal con resumen
  $("#form-renta").on("submit", function (e) {
    e.preventDefault();

    const nombre = $("#nombre").val().trim();
    const correo = $("#correo").val().trim();
    const cedula = $("#cedula").val().trim();
    const telefono = $("#telefono").val().trim();
    const direccion = $("#direccion").val().trim();
    const ids = ($("#peliculas").val() || []).map(Number);
    const dias = Number($("#dias").val());
    const pago = $("#pago").val();

    if (!ids.length) return alert("Selecciona al menos una película.");

    const { total, seleccion } = calcularTotal(ids, dias);
    const fmt = new Intl.NumberFormat("es-EC", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });

    // Cliente
    $("#resumen-cliente").html(`
      <div><strong>Cliente:</strong> ${nombre}</div>
      <div><strong>Correo:</strong> ${correo}</div>
      <div><strong>Cédula:</strong> ${cedula}</div>
      <div><strong>Teléfono:</strong> ${telefono}</div>
      <div><strong>Dirección:</strong> ${direccion}</div>
    `);

    // Películas
    const lista = seleccion
      .map(
        (s) =>
          `<li>${s.titulo} — ${fmt.format(
            s.precio
          )} x ${dias} = <strong>${fmt.format(s.subtotal)}</strong></li>`
      )
      .join("");
    $("#resumen-peliculas").html(
      `<strong>Películas:</strong><ul class="mt-2 mb-0">${lista}</ul>`
    );

    // Días y pago
    $("#resumen-dias").html(`<strong>Días de renta:</strong> ${dias}`);
    $("#resumen-pago").html(
      `<strong>Forma de pago:</strong> ${
        pago === "transferencia" ? "Transferencia bancaria" : "Efectivo"
      }`
    );

    // Total
    $("#resumen-total").html(
      `<span>Total a pagar:</span> ${fmt.format(total)}`
    );

    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById("modalResumen"));
    modal.show();

    // Opcional: reset después de cerrar
    $("#modalResumen").one("hidden.bs.modal", function () {
      $("#form-renta")[0].reset();
      $("#peliculas").val([]).change();
    });
  });
});
