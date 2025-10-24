# CineUPS — Plataforma Web de Consulta y Renta de Películas

**Autor:** Marcelo Darwin Peña Ochoa  
**Carrera:** Ingeniería de Software — Cuarto Semestre  
**Asignatura:** Aplicaciones Web  
**Docente:** Ing. José Alberto Jaime Carriel  
**Institución:** Universidad Politécnica Salesiana

---

## Descripción General

**CineUPS** es una aplicación web desarrollada para la gestión y consulta de películas.  
Permite visualizar la cartelera, acceder a detalles, ver tráileres, realizar rentas y enviar mensajes de contacto.

El desarrollo se realizó utilizando **HTML5**, **CSS3**, **Bootstrap 5**, **JavaScript (jQuery)** y **JSON**, con un diseño adaptable y estructura modular.

---

## Funcionalidades Principales

- **Cartelera dinámica:** Carga las películas desde `peliculas.json` mediante AJAX, mostrando botones para “Ver más”, “Ver tráiler” y “Reservar”.
- **Detalle de película:** Presenta póster, sinopsis, géneros y tráiler de YouTube. Incluye un enlace para la renta directa.
- **Formulario de renta:** Solicita datos del usuario, permite seleccionar películas y genera un resumen en un modal.
- **Formulario de contacto:** Valida todos los campos e incluye una regla especial para el mensaje (entre 20 y 50 caracteres).
- **Tema visual personalizado:** Basado en colores institucionales (azul y amarillo) con tipografías de Google Fonts.
- **Alerta de bienvenida:** Se muestra una sola vez mediante `localStorage`.
- **Navegación coherente:** Barra de navegación unificada con indicación de la página activa.

## Estructura del Proyecto

index.html  
/css/style.css  
/js/app.js  
/js/detalle.js  
/js/renta.js  
/data/peliculas.json  
/pages/contacto.html  
/pages/detalle.html  
/pages/renta.html

---

## Requerimientos Cumplidos

| Requerimiento                        | Estado   |
| ------------------------------------ | -------- |
| Carga dinámica de películas          | Cumplido |
| Modal para tráiler                   | Cumplido |
| Validación de formularios            | Cumplido |
| Alerta persistente con localStorage  | Cumplido |
| Tema visual y fuentes personalizadas | Cumplido |
| Footer fijo y navbar activa          | Cumplido |

---

## Tecnologías Utilizadas

**HTML5** • **CSS3** • **Bootstrap 5** • **JavaScript (jQuery)** • **JSON** • **Google Fonts**

---

## Conclusión

El proyecto **CineUPS** aplica de manera práctica los conceptos desarrollados en la asignatura de **Aplicaciones Web**.  
Integra tecnologías modernas del entorno front-end, validaciones dinámicas y un diseño visual coherente, garantizando una experiencia de usuario clara, funcional y estética.
