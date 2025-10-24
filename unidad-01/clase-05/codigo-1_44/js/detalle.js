// /js/detalle.js
$(function () {
  console.log("[detalle] cargado");

  const idStr = new URLSearchParams(location.search).get("id");
  const id = Number(idStr);
  if (!idStr || Number.isNaN(id)) {
    return renderError("Falta el id de la película en la URL.");
  }

  // 1) Cargar catálogo
  $.getJSON("../data/peliculas.json")
    .done((peliculas) => {
      console.log("[detalle] peliculas.json OK. total =", peliculas.length);

      const p = peliculas.find((x) => Number(x.id) === id);
      if (!p)
        return renderError("La película solicitada no existe en el catálogo.");
      // Botón "Reservar" apunta a la página de renta con el ID de la película
      $("#btn-reservar").attr("href", `renta.html?peliculaId=${p.id}`);

      // 2) Pintar datos base
      $("#titulo").text(p.titulo || "—");
      $("#sinopsis").text(p.sinopsis || "—");

      // géneros: prioriza array; si no hay nada, oculta el badge
      const generos =
        Array.isArray(p.generos) && p.generos.length
          ? p.generos.join(" • ")
          : (p.genero || "").trim();

      if (generos) {
        $("#generos").text(generos).removeClass("d-none");
      } else {
        $("#generos").addClass("d-none").text("");
      }

      // Tráiler
      $("#trailer").attr("src", normalizeYouTube(p.trailer || ""));

      // 3) Imagen
      const imgFromJson = String(p.imagen || "");
      const imgPath = imgFromJson.startsWith("../")
        ? imgFromJson
        : "../" + imgFromJson;

      $("#poster")
        .attr("src", imgPath)
        .attr("alt", p.titulo || "Póster")
        .attr("loading", "lazy")
        .on("error", function () {
          console.warn("[detalle] imagen no encontrada:", imgPath);
          $(this).attr("src", "../img/default-poster.jpg");
        });

      // 4) Badge + precio dinámico (ventana de estreno: 3 días antes hasta el día de estreno inclusive)
      const estrenoDate = parseISODate(p.estreno); // YYYY-MM-DD → Date local a medianoche
      const hoy = toMidnight(new Date());
      const MS = 24 * 60 * 60 * 1000;
      const inicioEstreno = new Date(estrenoDate.getTime() - 3 * MS);
      const esEstreno = hoy >= inicioEstreno && hoy <= estrenoDate;

      const precio = Number(esEstreno ? p.precios?.estreno : p.precios?.normal);
      const badge = esEstreno
        ? '<span class="badge bg-primary me-2">Estreno</span>'
        : '<span class="badge bg-secondary me-2">Cartelera regular</span>';

      if (Number.isFinite(precio)) {
        $("#estado-precio").html(
          `${badge}<span class="fw-bold">Precio actual: $${precio.toFixed(
            2
          )} USD</span>`
        );
      } else {
        console.warn("[detalle] precios ausentes o inválidos:", p.precios);
        $("#estado-precio").html(
          '<span class="badge bg-warning text-dark">Sin precio disponible</span>'
        );
      }

      // 5) Reseñas
      cargarResenas(id);
    })
    .fail((err) => {
      console.error("[detalle] error leyendo peliculas.json", err);
      renderError(
        "No se pudo cargar la información de la película (peliculas.json)."
      );
    });

  function cargarResenas(movieId) {
    $.getJSON("../data/resenas.json")
      .done((data) => {
        const arr = data[String(movieId)] || [];
        console.log("[detalle] reseñas para id", movieId, "=", arr.length);

        const $resumen = $("#resumen-resenas");
        const $lista = $("#lista-resenas");

        if (!arr.length) {
          $resumen.text("Sin reseñas aún");
          $lista.html(
            '<div class="list-group-item text-muted">Sé el primero en opinar.</div>'
          );
          return;
        }

        let sum = 0;
        let html = "";
        arr.forEach((r) => {
          const cal = Number(r.calificacion || 0);
          sum += cal;

          html += `
            <div class="list-group-item">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <strong>${esc(r.autor || "Anónimo")}</strong>
                <span>${renderStars(cal)}</span>
              </div>
              <p class="mb-0">${esc(r.texto || "")}</p>
            </div>`;
        });

        const avg = sum / arr.length;
        $resumen.html(
          `Promedio: <strong>${avg.toFixed(1)}</strong>/5 ` +
            `<span class="ms-2 align-middle">${renderStars(avg, true)}</span>` +
            `<span class="ms-2 text-muted">(${arr.length} reseña${
              arr.length > 1 ? "s" : ""
            })</span>`
        );
        $lista.html(html);
      })
      .fail(() => $("#resumen-resenas").text("Error al cargar reseñas"));
  }

  function renderError(msg) {
    $("#detalle-pelicula").html(`
      <div class="alert alert-danger text-center" role="alert">${msg}</div>
      <div class="text-center"><a href="../index.html" class="btn btn-secondary mt-3">Volver al inicio</a></div>
    `);
  }

  // --- Utilidades ---
  function toMidnight(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  function parseISODate(s) {
    const [y, m, d] = String(s || "")
      .split("-")
      .map(Number);
    return new Date(y || 1970, (m || 1) - 1, d || 1);
  }
  function esc(s) {
    return String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[c])
    );
  }

  // Convierte URLs comunes de YouTube a /embed/ (watch?v=, youtu.be/, shorts/)
  function normalizeYouTube(url) {
    if (!url) return "";
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtu.be")) {
        return `https://www.youtube.com/embed/${u.pathname.replace("/", "")}`;
      }
      if (u.searchParams.get("v")) {
        return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
      }
      if (u.pathname.startsWith("/shorts/")) {
        return `https://www.youtube.com/embed/${u.pathname.split("/")[2]}`;
      }
      // si ya es /embed/, devuélvelo
      if (u.pathname.startsWith("/embed/")) return url;
    } catch (_e) {
      // si no es URL válida, deja como está
    }
    return url;
  }

  // Estrellitas: soporta entero y promedio (media estrella si corresponde)
  function renderStars(value, allowHalf = false) {
    const v = Math.max(0, Math.min(5, Number(value) || 0));
    const full = Math.floor(v);
    const half = allowHalf && v - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;

    const fullIcons = '<i class="bi bi-star-fill text-warning"></i>'.repeat(
      full
    );
    const halfIcon = half ? '<i class="bi bi-star-half text-warning"></i>' : "";
    const emptyIcons = '<i class="bi bi-star text-warning"></i>'.repeat(empty);

    return fullIcons + halfIcon + emptyIcons;
  }
});
