/* Re-Late Kardia · tarjetas de consejos y objetivo diario
   El objetivo de actividad debe haber sido acordado con el equipo sanitario. */
(function () {
  "use strict";

  var GOAL_KEY = "relate_kardia_objetivo_actividad_v1";
  var ACTIVITY_KEY = "relate_kardia_actividad_extra_v1";

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function today() {
    var d = new Date();
    return d.getFullYear() + "-" +
      String(d.getMonth() + 1).padStart(2, "0") + "-" +
      String(d.getDate()).padStart(2, "0");
  }

  function getGoal() {
    try {
      return Number(localStorage.getItem(GOAL_KEY)) || 0;
    } catch (e) {
      return 0;
    }
  }

  function getTodayMinutes() {
    try {
      var records = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || "[]");
      if (!Array.isArray(records)) return 0;

      return records.reduce(function (sum, record) {
        return sum + (record.fecha === today() ? (Number(record.minutos) || 0) : 0);
      }, 0);
    } catch (e) {
      return 0;
    }
  }

  function addCards() {
    var home = $("#vista-inicio");
    if (!home || $("#kxDailyGoal")) return;

    var goalCard = document.createElement("article");
    goalCard.id = "kxDailyGoal";
    goalCard.className = "tarjeta";
    goalCard.innerHTML =
      "<h2>🎯 Mi objetivo de actividad de hoy</h2>" +
      "<p class='nota'>Usa solo un objetivo que hayas acordado con tu equipo de rehabilitación. No es necesario alcanzar una meta genérica.</p>" +
      "<form id='kxGoalForm'>" +
        "<label for='kxGoalInput'>Objetivo acordado (minutos)</label>" +
        "<input id='kxGoalInput' type='number' min='1' max='600' step='1' inputmode='numeric' placeholder='Minutos acordados'>" +
        "<button class='secundario' type='submit'>Guardar objetivo</button>" +
      "</form>" +
      "<div id='kxGoalProgress' aria-live='polite' style='margin-top:.8rem'></div>";

    var adviceCard = document.createElement("article");
    adviceCard.id = "kxHeartAdvice";
    adviceCard.className = "tarjeta";
    adviceCard.innerHTML =
      "<h2>❤️ Consejos para cuidar tu salud cardiovascular</h2>" +
      "<ul class='lista'>" +
        "<li><span><strong>Sigue tu plan personal.</strong> La actividad y su intensidad deben adaptarse a las instrucciones de rehabilitación que recibiste.</span></li>" +
        "<li><span><strong>Toma la medicación como te la han pautado.</strong> No la suspendas ni cambies la dosis por tu cuenta; consulta tus dudas con un profesional.</span></li>" +
        "<li><span><strong>Cuida tus hábitos poco a poco.</strong> Prioriza alimentos variados y poco procesados, y pide ayuda profesional si quieres dejar el tabaco.</span></li>" +
        "<li><span><strong>Registra tus mediciones</strong> siguiendo la técnica que te enseñaron. Comparte el historial en tus revisiones; la aplicación no diagnostica.</span></li>" +
      "</ul>" +
      "<div class='aviso'><strong>Ante una urgencia:</strong> si tienes dolor u opresión en el pecho, dificultad respiratoria intensa, desmayo o síntomas súbitos graves, llama al 112. No esperes a que la aplicación los confirme.</div>" +
      "<h3>Guías para ampliar información</h3>" +
      "<ul class='lista'>" +
        "<li><a href='https://bellvitgehospital.cat/es/aula-de-salud/ejercicios-de-rehabilitacion-cardiaca-en-casa-guia-para-recuperar-la-salud-del' target='_blank' rel='noopener noreferrer'>Hospital Universitario de Bellvitge: ejercicios de rehabilitación cardíaca en casa</a></li>" +
        "<li><a href='https://www.husc.es/archivos/cms/cardiologia/archivos/publico/material%20educativo/CUADERNO%20DE%20EJERCICIO%20REHABILITACION%20CARDI%CC%81ACA%5B12359%5D.pdf' target='_blank' rel='noopener noreferrer'>Hospital Universitario de Santiago: cuaderno de ejercicio cardíaco (PDF)</a></li>" +
        "<li><a href='https://fundaciondelcorazon.com/nutricion.html' target='_blank' rel='noopener noreferrer'>Fundación Española del Corazón: alimentación</a></li>" +
      "</ul>" +
      "<p class='nota'>Material informativo general; las indicaciones de tu equipo sanitario tienen prioridad.</p>";

    var anchor = $("#kxHome", home) || $("#fechaHoy", home) || $("h1", home);
    if (anchor) {
      anchor.insertAdjacentElement("afterend", goalCard);
      goalCard.insertAdjacentElement("afterend", adviceCard);
    } else {
      home.appendChild(goalCard);
      home.appendChild(adviceCard);
    }

    var input = $("#kxGoalInput");
    input.value = getGoal() || "";

    $("#kxGoalForm").addEventListener("submit", function (event) {
      event.preventDefault();

      var value = Number(input.value);
      if (!Number.isFinite(value) || value < 1 || value > 600) {
        input.focus();
        return;
      }

      try {
        localStorage.setItem(GOAL_KEY, String(Math.round(value)));
      } catch (e) {
        window.alert("No se pudo guardar el objetivo en este dispositivo.");
        return;
      }

      renderProgress();
    });

    renderProgress();

    var records = $("#kxRecords");
    if (records && window.MutationObserver) {
      new MutationObserver(renderProgress).observe(records, {
        childList: true,
        subtree: true
      });
    }

    document.querySelectorAll(".tab[data-vista]").forEach(function (tab) {
      tab.addEventListener("click", function () {
        window.setTimeout(renderProgress, 80);
      });
    });

    window.addEventListener("storage", renderProgress);
  }

  function renderProgress() {
    var output = $("#kxGoalProgress");
    if (!output) return;

    var goal = getGoal();
    var minutes = getTodayMinutes();

    if (!goal) {
      output.innerHTML =
        "<p class='nota'>Aún no has indicado un objetivo. Si tu equipo te ha recomendado uno, introdúcelo arriba. Si no tienes una meta acordada, puedes dejarlo vacío.</p>";
      return;
    }

    var percent = Math.min(100, Math.round(minutes / goal * 100));
    var remaining = Math.max(0, goal - minutes);

    output.innerHTML =
      "<p><strong>" + percent + "% del objetivo registrado</strong><br>" +
      minutes + " de " + goal + " minutos" +
      (remaining ? " · faltan " + remaining + " min para alcanzar el objetivo introducido." :
        " · objetivo alcanzado.") +
      "</p>" +
      "<div class='barra' role='progressbar' aria-label='Progreso del objetivo diario de actividad' aria-valuemin='0' aria-valuemax='100' aria-valuenow='" + percent + "'>" +
        "<i style='width:" + percent + "%'></i>" +
      "</div>" +
      "<p class='nota'>El progreso refleja solo las actividades registradas en esta aplicación; no es una evaluación médica ni una indicación para hacer más ejercicio.</p>";
  }

  function init() {
    addCards();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();