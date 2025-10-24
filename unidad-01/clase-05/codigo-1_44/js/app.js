// /js/app.js  (listado)
// ---------- ALERTA DE BIENVENIDA ----------
document.addEventListener("DOMContentLoaded", () => {
  const KEY = "welcome_shown_v1";
  if (!localStorage.getItem(KEY)) {
    alert("🎬 ¡Bienvenido/a al catálogo de películas!");
    localStorage.setItem(KEY, "true");
  }
});
$(document).ready(function () {
  const contenedor = $("#lista-peliculas");

  // Spinner mientras carga
  contenedor.html(`
    <div class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-3">Cargando cartelera...</p>
    </div>
  `);

  $.ajax({
    url: "data/peliculas.json",
    method: "GET",
    dataType: "json",
    success: function (peliculas) {
      setTimeout(function () {
        let html = "";
        peliculas.forEach(function (peli) {
          const generos =
            Array.isArray(peli.generos) && peli.generos.length
              ? peli.generos.join(" • ")
              : peli.genero || "";

          html += `
            <div class="col-md-4">
              <div class="card h-100 shadow">
                <img src="${peli.imagen}" class="card-img-top" alt="${
            peli.titulo
          }">
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title">${peli.titulo}</h5>
                  <p class="card-text text-muted mb-3">${generos}</p>
                  <div class="mt-auto d-flex flex-wrap gap-2">
                    <a href="pages/detalle.html?id=${
                      peli.id
                    }" class="btn btn-primary">Ver más</a>
                    <a href="pages/renta.html?peliculaId=${
                      peli.id
                    }" class="btn btn-success">Reservar</a>

                    <!-- NUEVO: Ver tráiler (abre modal) -->
                    <button
                      type="button"
                      class="btn btn-trailer"
                      data-bs-toggle="modal"
                      data-bs-target="#trailerModal"
                      data-title="${peli.titulo}"
                      data-trailer="${peli.trailer || ""}">
                      <i class="bi bi-play-fill me-1"></i> Ver tráiler
                    </button>
                  </div>
                </div>
              </div>
            </div>`;
        });
        contenedor.html(html);
      }, 5000);
    },
    error: function () {
      contenedor.html(`
        <div class="col-12">
          <div class="alert alert-danger text-center" role="alert">
            No se pudo cargar la lista de películas. Intenta nuevamente más tarde.
          </div>
        </div>
      `);
    },
  });

  // ---------- LÓGICA DEL MODAL: Propuesta A (sencilla) ----------

  // Normaliza URLs de YouTube a /embed/
  function normalizeYouTube(url) {
    if (!url) return "";
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtu.be"))
        return `https://www.youtube.com/embed/${u.pathname.replace("/", "")}`;
      if (u.searchParams.get("v"))
        return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
      if (u.pathname.startsWith("/shorts/"))
        return `https://www.youtube.com/embed/${u.pathname.split("/")[2]}`;
      if (u.pathname.startsWith("/embed/")) return url;
    } catch (_) {}
    return url;
  }

  // Abrir modal con autoplay
  $(document).on("click", ".btn-trailer", function () {
    const title = $(this).data("title") || "Tráiler";
    const trailer = normalizeYouTube($(this).data("trailer") || "");
    $("#trailerTitle").text(title);
    $("#trailerFrame").attr(
      "src",
      trailer ? `${trailer}?autoplay=1&rel=0&modestbranding=1` : ""
    );
  });

  // Detener video al cerrar
  $("#trailerModal").on("hidden.bs.modal", function () {
    $("#trailerFrame").attr("src", "");
  });
});
