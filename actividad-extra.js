/* Re-Late Kardia · Inicio y actividad ampliados
   SPDX-License-Identifier: AGPL-3.0-or-later
   Guardado local en este dispositivo. No sustituye un programa de rehabilitación. */
(function () {
  "use strict";

  var STORE = "relate_kardia_actividad_extra_v1";

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function readRecords() {
    try {
      var value = JSON.parse(localStorage.getItem(STORE) || "[]");
      return Array.isArray(value) ? value : [];
    } catch (e) {
      return [];
    }
  }

  function saveRecords(records) {
    try {
      localStorage.setItem(STORE, JSON.stringify(records));
      return true;
    } catch (e) {
      return false;
    }
  }

  function localDate() {
    var d = new Date();
    return d.getFullYear() + "-" +
      String(d.getMonth() + 1).padStart(2, "0") + "-" +
      String(d.getDate()).padStart(2, "0");
  }

  function escapeHTML(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[c];
    });
  }

  function addStyles() {
    if ($("#kardiaExtraStyles")) return;

    var style = document.createElement("style");
    style.id = "kardiaExtraStyles";
    style.textContent = [
      ".kx-panel{border:1px solid var(--borde);border-radius:18px;padding:1rem;margin:0 0 1rem;background:linear-gradient(135deg,var(--tarjeta),var(--fondo2));box-shadow:var(--s1)}",
      ".kx-panel h2{margin-bottom:.35rem}",
      ".kx-muted{color:var(--texto2);font-size:.88rem}",
      ".kx-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(7rem,1fr));gap:.6rem;margin:.8rem 0}",
      ".kx-stat{background:var(--tarjeta);border:1px solid var(--borde);border-radius:12px;padding:.65rem;text-align:center}",
      ".kx-stat strong{display:block;font-size:1.25rem}",
      ".kx-actions{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.75rem}",
      ".kx-actions button{width:auto!important;margin-top:0!important}",
      ".kx-links{display:grid;gap:.55rem;padding-left:1.2rem}",
      ".kx-note{border-left:4px solid var(--aviso);padding:.65rem .8rem;background:var(--fondo2);border-radius:8px;font-size:.88rem}",
      ".kx-record{padding:.7rem 0;border-bottom:1px solid var(--borde)}",
      ".kx-record:last-child{border-bottom:0}",
      ".kx-delete{width:auto!important;margin:.4rem 0!important;padding:.4rem .65rem!important}",
      ".kx-borg{display:grid;grid-template-columns:repeat(auto-fit,minmax(9rem,1fr));gap:.45rem;margin:.6rem 0}",
      ".kx-borg div{background:var(--fondo2);padding:.5rem;border-radius:9px;font-size:.82rem}",
      ".kx-panel a{overflow-wrap:anywhere}",
      "@media(prefers-reduced-motion:reduce){.kx-panel *{scroll-behavior:auto!important;animation-duration:.01ms!important;transition-duration:.01ms!important}}"
    ].join("");
    document.head.appendChild(style);
  }

  function goTo(viewName) {
    var tab = $(".tab[data-vista='" + viewName + "']");
    if (tab) tab.click();
  }

  function addHomePanel() {
    var home = $("#vista-inicio");
    if (!home || $("#kxHome")) return;

    var panel = document.createElement("article");
    panel.id = "kxHome";
    panel.className = "kx-panel";
    panel.innerHTML =
      "<h2>💚 Tu día, paso a paso</h2>" +
      "<p class='kx-muted'>Un espacio sencillo para ver tus registros y acceder a las secciones. No es una puntuación médica.</p>" +
      "<div class='kx-stats' aria-live='polite'>" +
        "<div class='kx-stat'><strong id='kxHomeCount'>0</strong><span>actividades hoy</span></div>" +
        "<div class='kx-stat'><strong id='kxHomeMinutes'>0</strong><span>minutos anotados</span></div>" +
      "</div>" +
      "<div class='kx-actions'>" +
        "<button class='secundario' type='button' data-kx-go='actividad'>Registrar actividad</button>" +
        "<button class='secundario' type='button' data-kx-go='constantes'>Ver constantes</button>" +
        "<button class='secundario' type='button' data-kx-go='emociones'>Registrar cómo me siento</button>" +
      "</div>" +
      "<p class='kx-muted'>El ejercicio y sus objetivos deben ajustarse a las indicaciones de tu equipo de rehabilitación.</p>";

    var anchor = $("#fechaHoy", home) || $("h1", home);
    if (anchor && anchor.parentNode) {
      anchor.insertAdjacentElement("afterend", panel);
    } else {
      home.insertAdjacentElement("afterbegin", panel);
    }

    panel.addEventListener("click", function (event) {
      var button = event.target.closest("[data-kx-go]");
      if (button) goTo(button.getAttribute("data-kx-go"));
    });
    renderHome();
  }

  function addActivityModule() {
    var view = $("#vista-actividad");
    if (!view || $("#kxActivity")) return;

    var card = document.createElement("article");
    card.id = "kxActivity";
    card.className = "tarjeta";
    card.innerHTML =
      "<h2>🏃 Registro de ejercicio y rehabilitación</h2>" +
      "<p class='kx-muted'>Registra lo que hayas realizado. La aplicación no prescribe ejercicio ni determina si una intensidad es segura para ti.</p>" +
      "<div class='kx-note'><strong>Antes de empezar:</strong> sigue el plan individual que te haya indicado tu equipo. Si no tienes autorización o instrucciones claras sobre actividad, consúltalo con ellos antes de iniciar o aumentar el ejercicio.</div>" +
      "<form id='kxForm'>" +
        "<label for='kxLugar'>Dónde</label>" +
        "<select id='kxLugar' required>" +
          "<option value='aire'>Al aire libre</option>" +
          "<option value='gimnasio'>Gimnasio o rehabilitación supervisada</option>" +
          "<option value='casa'>En casa</option>" +
        "</select>" +
        "<label for='kxEjercicio'>Actividad</label>" +
        "<select id='kxEjercicio' required></select>" +
        "<label for='kxMinutos'>Duración (minutos)</label>" +
        "<input id='kxMinutos' type='number' min='1' max='600' required inputmode='numeric' placeholder='Ej.: 20'>" +
        "<label for='kxEsfuerzo'>Esfuerzo percibido (escala de Borg 6–20, opcional)</label>" +
        "<select id='kxEsfuerzo'>" +
          "<option value=''>No registrar</option>" +
          "<option value='6'>6 · Ningún esfuerzo</option>" +
          "<option value='7'>7 · Extremadamente ligero</option>" +
          "<option value='9'>9 · Muy ligero</option>" +
          "<option value='11'>11 · Ligero</option>" +
          "<option value='13'>13 · Algo duro</option>" +
          "<option value='15'>15 · Duro</option>" +
          "<option value='17'>17 · Muy duro</option>" +
          "<option value='19'>19 · Extremadamente duro</option>" +
          "<option value='20'>20 · Esfuerzo máximo</option>" +
        "</select>" +
        "<label for='kxNotas'>Notas opcionales</label>" +
        "<input id='kxNotas' maxlength='300' placeholder='Por ejemplo: lugar, pausas o cómo me encontré'>" +
        "<button class='principal' type='submit'>Guardar actividad</button>" +
      "</form>" +
      "<h3>Escala de esfuerzo percibido</h3>" +
      "<p class='kx-muted'>La escala Borg es una forma subjetiva de describir cuánto esfuerzo se percibe; no sustituye la pauta de intensidad ni los límites indicados por profesionales.</p>" +
      "<div class='kx-borg'>" +
        "<div><strong>6–8</strong><br>Muy, muy ligero</div>" +
        "<div><strong>9–10</strong><br>Muy ligero</div>" +
        "<div><strong>11–12</strong><br>Ligero</div>" +
        "<div><strong>13–14</strong><br>Algo duro</div>" +
        "<div><strong>15–16</strong><br>Duro</div>" +
        "<div><strong>17–20</strong><br>Muy duro a máximo</div>" +
      "</div>" +
      "<h3>Recursos de ejercicio y rehabilitación cardíaca</h3>" +
      "<ul class='kx-links'>" +
        "<li><a href='https://bellvitgehospital.cat/es/aula-de-salud/ejercicios-de-rehabilitacion-cardiaca-en-casa-guia-para-recuperar-la-salud-del' target='_blank' rel='noopener noreferrer'>Hospital Universitario de Bellvitge: guía de ejercicios de rehabilitación cardíaca en casa</a></li>" +
        "<li><a href='https://www.husc.es/archivos/cms/cardiologia/archivos/publico/material%20educativo/CUADERNO%20DE%20EJERCICIO%20REHABILITACION%20CARDI%CC%81ACA%5B12359%5D.pdf' target='_blank' rel='noopener noreferrer'>Hospital Universitario de Santiago: cuaderno de ejercicio para rehabilitación cardíaca (PDF)</a></li>" +
        "<li><a href='https://fundaciondelcorazon.com/blog-impulso-vital/3806-cuanto-ejercicio-fisico-debes-hacer-para-mejorar-tu-salud-cardiovascular.html' target='_blank' rel='noopener noreferrer'>Fundación Española del Corazón: ejercicio y salud cardiovascular</a></li>" +
        "<li><a href='https://fundaciondelcorazon.com/ejercicio/calculo-y-monitorizacion/3161-frecuencia-cardiaca-y-entrenamient.html' target='_blank' rel='noopener noreferrer'>Fundación Española del Corazón: frecuencia cardíaca y entrenamiento</a></li>" +
        "<li><a href='https://cardioprotegida.malaga.eu/export/sites/cardio/.galleries/Documentos-General/Guia-ejercicios-pacientes-enfermedad-cardiovascular.pdf' target='_blank' rel='noopener noreferrer'>Guía de ejercicios para pacientes con enfermedad cardiovascular (PDF)</a></li>" +
      "</ul>" +
      "<p class='kx-note'><strong>Seguridad:</strong> detente y sigue tu plan de actuación si aparecen síntomas preocupantes. Ante dolor u opresión en el pecho, dificultad respiratoria intensa, desmayo o síntomas súbitos graves, llama al 112.</p>" +
      "<h3>Mis actividades registradas</h3>" +
      "<div id='kxRecords' aria-live='polite'></div>";

    view.insertAdjacentElement("afterbegin", card);

    var place = $("#kxLugar", card);
    var exercise = $("#kxEjercicio", card);

    function updateExerciseOptions() {
      var choices = {
        aire: [
          ["Caminar", "Caminar"],
          ["Marcha nórdica", "Marcha nórdica"],
          ["Bicicleta", "Bicicleta al aire libre"],
          ["Otro", "Otra actividad al aire libre"]
        ],
        gimnasio: [
          ["Bicicleta estática", "Bicicleta estática"],
          ["Cinta", "Cinta de caminar"],
          ["Fuerza", "Ejercicios de fuerza según tabla pautada"],
          ["Supervisado", "Sesión supervisada de rehabilitación"],
          ["Otro", "Otro ejercicio en gimnasio"]
        ],
        casa: [
          ["Marcha", "Marcha o caminar en casa"],
          ["Fuerza", "Ejercicios de fuerza pautados"],
          ["Movilidad", "Movilidad o ejercicios pautados"],
          ["Otro", "Otro ejercicio en casa"]
        ]
      };
      exercise.innerHTML = choices[place.value].map(function (item) {
        return "<option value='" + escapeHTML(item[0]) + "'>" +
          escapeHTML(item[1]) + "</option>";
      }).join("");
    }

    place.addEventListener("change", updateExerciseOptions);
    updateExerciseOptions();

    $("#kxForm", card).addEventListener("submit", function (event) {
      event.preventDefault();

      var minutes = Number($("#kxMinutos", card).value);
      if (!Number.isFinite(minutes) || minutes < 1 || minutes > 600) {
        $("#kxMinutos", card).focus();
        return;
      }

      var records = readRecords();
      records.unshift({
        id: String(Date.now()) + "-" + Math.random().toString(16).slice(2),
        fecha: localDate(),
        hora: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
        lugar: place.options[place.selectedIndex].text,
        ejercicio: exercise.options[exercise.selectedIndex].text,
        minutos: minutes,
        esfuerzo: $("#kxEsfuerzo", card).value,
        notas: $("#kxNotas", card).value.trim()
      });

      if (!saveRecords(records)) {
        window.alert("No se pudo guardar en este dispositivo. Comprueba el espacio disponible o la configuración del navegador.");
        return;
      }

      this.reset();
      updateExerciseOptions();
      renderRecords();
      renderHome();
    });

    card.addEventListener("click", function (event) {
      var button = event.target.closest("[data-kx-delete]");
      if (!button) return;

      var id = button.getAttribute("data-kx-delete");
      var records = readRecords().filter(function (record) {
        return record.id !== id;
      });
      saveRecords(records);
      renderRecords();
      renderHome();
    });

    renderRecords();
  }

  function renderHome() {
    var count = $("#kxHomeCount");
    var minutesOut = $("#kxHomeMinutes");
    if (!count || !minutesOut) return;

    var todays = readRecords().filter(function (record) {
      return record.fecha === localDate();
    });
    count.textContent = String(todays.length);
    minutesOut.textContent = String(todays.reduce(function (sum, record) {
      return sum + (Number(record.minutos) || 0);
    }, 0));
  }

  function renderRecords() {
    var out = $("#kxRecords");
    if (!out) return;

    var records = readRecords();
    if (!records.length) {
      out.innerHTML = "<p class='kx-muted'>Aún no hay actividades guardadas en este módulo.</p>";
      return;
    }

    out.innerHTML = records.slice(0, 30).map(function (record) {
      var effort = record.esfuerzo ?
        "<br><span class='kx-muted'>Esfuerzo percibido: Borg " +
          escapeHTML(record.esfuerzo) + "</span>" : "";
      var notes = record.notas ?
        "<br><span class='kx-muted'>" + escapeHTML(record.notas) + "</span>" : "";

      return "<div class='kx-record'><strong>" +
        escapeHTML(record.ejercicio) + "</strong> · " +
        escapeHTML(record.minutos) + " min<br>" +
        "<span class='kx-muted'>" + escapeHTML(record.fecha) +
        " · " + escapeHTML(record.hora) +
        " · " + escapeHTML(record.lugar) + "</span>" +
        effort + notes +
        "<br><button class='secundario kx-delete' type='button' data-kx-delete='" +
        escapeHTML(record.id) + "' aria-label='Eliminar registro'>Eliminar</button></div>";
    }).join("");
  }

  function init() {
    addStyles();
    addHomePanel();
    addActivityModule();

    document.querySelectorAll(".tab[data-vista]").forEach(function (tab) {
      tab.addEventListener("click", function () {
        window.setTimeout(renderHome, 50);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();