/* Re-Late Kardia · ampliaciones v1.2 · AGPL-3.0-or-later
   Añadir con <script src="mejoras.js"></script> al final de index.html */
(function () {
  "use strict";

  var KEY = "relate_kardia_v1";
  var EXTRA_KEY = "relate_kardia_extra_v1";

  function $(id) { return document.getElementById(id); }
  function readBase() {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}"); }
    catch (e) { return {}; }
  }
  function readExtra() {
    try { return JSON.parse(localStorage.getItem(EXTRA_KEY) || "{}"); }
    catch (e) { return {}; }
  }
  function saveExtra() {
    try { localStorage.setItem(EXTRA_KEY, JSON.stringify(extra)); }
    catch (e) { /* La app principal ya gestiona el almacenamiento */ }
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function localDate() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" +
      String(d.getDate()).padStart(2, "0");
  }
  function dayName(iso) {
    if (!iso) return "—";
    var p = iso.split("-");
    return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0] : iso;
  }

  var extra = readExtra();
  extra.perfil = extra.perfil || {};
  extra.metas = extra.metas || { animo: true, constantes: true };
  extra.metaActividad = Number(extra.metaActividad) || 0;

  function addStyles() {
    var css = [
      ".extra-sub{margin:.2rem 0 1rem;color:var(--texto2);font-size:.9rem}",
      ".extra-medidor{height:14px;background:var(--fondo2);border-radius:99px;overflow:hidden;margin:.65rem 0}",
      ".extra-medidor i{display:block;height:100%;background:linear-gradient(90deg,var(--acento),var(--acento2));transition:width .35s}",
      ".extra-meta{display:flex;align-items:center;gap:.75rem;justify-content:space-between}",
      ".extra-meta button{flex:0 0 auto}",
      ".extra-semaforo{border-left:6px solid var(--acento);padding:.8rem 1rem;background:var(--fondo2);border-radius:12px;margin:.5rem 0}",
      ".extra-semaforo.verde{border-color:#2e9e5b}.extra-semaforo.ambar{border-color:#e0a52e}.extra-semaforo.rojo{border-color:#cb3a2b}",
      ".extra-aviso{font-size:.82rem;color:var(--texto2);margin:.65rem 0 0}",
      ".extra-consejo{padding:.8rem 0;border-bottom:1px solid var(--borde)}",
      ".extra-consejo:last-child{border-bottom:0}",
      ".extra-acciones{display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.75rem}",
      ".extra-acciones button{width:auto!important;margin-top:0!important}",
      ".extra-pill{display:inline-block;background:var(--fondo2);padding:.3rem .65rem;border-radius:99px;font-size:.8rem;margin:.15rem}",
      ".extra-ok{color:#16805e;font-weight:700}.extra-warn{color:#a66d00;font-weight:700}",
      "button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid var(--acento);outline-offset:2px}",
      "@media(prefers-reduced-motion:reduce){*,*::before,*::after{scroll-behavior:auto!important;animation-duration:.01ms!important;transition-duration:.01ms!important}}"
    ].join("");
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }

  function addProfileFields() {
    var form = $("formPerfil");
    if (!form || $("pAltura")) return;
    var before = form.querySelector("button[type='submit']");
    var html =
      "<h3>Datos para personalizar el seguimiento</h3>" +
      "<label for='pAltura'>Altura (cm)</label><input id='pAltura' type='number' min='80' max='230' step='1' placeholder='Ej.: 170'>" +
      "<label for='pTabaco'>¿Fumas actualmente?</label><select id='pTabaco'><option value=''>Prefiero no indicarlo</option><option value='no'>No</option><option value='si'>Sí</option></select>" +
      "<label for='pCigarros'>Cigarrillos al día</label><input id='pCigarros' type='number' min='0' max='100' placeholder='0'>" +
      "<label for='pAlcohol'>Bebidas alcohólicas por semana (opcional)</label><input id='pAlcohol' type='number' min='0' max='200' step='0.5' placeholder='0'>" +
      "<label for='pMetaActividad'>Objetivo diario de actividad acordado (minutos)</label><input id='pMetaActividad' type='number' min='0' max='600' step='5' placeholder='Déjalo en 0 si no tienes un objetivo acordado'>" +
      "<p class='nota'>Estos datos son opcionales y se guardan en este dispositivo. No cambies medicación ni objetivos médicos basándote en la aplicación.</p>";
    before.insertAdjacentHTML("beforebegin", html);

    $("pAltura").value = extra.perfil.altura || "";
    $("pTabaco").value = extra.perfil.tabaco || "";
    $("pCigarros").value = extra.perfil.cigarros || "";
    $("pAlcohol").value = extra.perfil.alcohol || "";
    $("pMetaActividad").value = extra.metaActividad || "";

    form.addEventListener("submit", function () {
      extra.perfil.altura = $("pAltura").value;
      extra.perfil.tabaco = $("pTabaco").value;
      extra.perfil.cigarros = $("pCigarros").value;
      extra.perfil.alcohol = $("pAlcohol").value;
      extra.metaActividad = Number($("pMetaActividad").value) || 0;
      saveExtra();
      setTimeout(renderAll, 0);
    });
  }

  function addWaistField() {
    var form = $("formConst");
    if (!form || $("cCintura")) return;
    var before = $("cNotas");
    before.insertAdjacentHTML("beforebegin",
      "<label for='cCintura'>Perímetro abdominal (cm, opcional)</label>" +
      "<input id='cCintura' type='number' min='30' max='250' step='0.1' placeholder='Ej.: 92'>" +
      "<p class='nota'>Mídelo siguiendo las indicaciones de tu equipo sanitario. La interpretación depende, entre otros factores, del sexo y la población de referencia.</p>"
    );

    form.addEventListener("submit", function () {
      var waist = Number($("cCintura").value) || 0;
      setTimeout(function () {
        if (!waist) return;
        var d = readBase();
        d.constantes = d.constantes || [];
        var last = d.constantes[d.constantes.length - 1];
        if (last && last.fecha === localDate()) {
          last.cintura = waist;
          try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {}
        }
        renderAll();
      }, 0);
    });
  }

  function addHomePanel() {
    var home = $("vista-inicio");
    if (!home || $("extraInicio")) return;
    var anchor = $("fechaHoy");
    anchor.insertAdjacentHTML("afterend",
      "<article class='tarjeta' id='extraInicio'>" +
        "<h2>✨ Tu día, a tu manera</h2>" +
        "<p class='extra-sub' id='extraSaludo'>Cada pequeño paso cuenta. Elige lo que quieres registrar hoy.</p>" +
        "<div class='extra-medidor' role='progressbar' aria-label='Cumplimiento de objetivos diarios' aria-valuemin='0' aria-valuemax='100'>" +
          "<i id='extraBarra' style='width:0%'></i></div>" +
        "<p id='extraCumplimiento' aria-live='polite'></p>" +
        "<div id='extraObjetivos'></div>" +
        "<div class='extra-acciones'>" +
          "<button class='secundario' type='button' data-ir='constantes'>Registrar constantes</button>" +
          "<button class='secundario' type='button' data-ir='actividad'>Añadir paseo</button>" +
          "<button class='secundario' type='button' data-ir='emociones'>¿Cómo me siento?</button>" +
        "</div>" +
        "<p class='nota'>Los objetivos de actividad deben acordarse con tu equipo de rehabilitación. El progreso no es una evaluación médica ni una competición.</p>" +
      "</article>"
    );

    $("extraInicio").addEventListener("change", function (ev) {
      var input = ev.target;
      if (!input.matches("[data-meta]")) return;
      extra.metas[input.dataset.meta] = input.checked;
      saveExtra();
      renderGoals();
    });
    $("extraInicio").addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-ir]");
      if (b) goTo(b.dataset.ir);
    });
  }

  function addAdviceTab() {
    var nav = document.querySelector(".tabs");
    var main = document.querySelector("main");
    if (!nav || !main || $("vista-salud")) return;
    var tab = document.createElement("button");
    tab.className = "tab";
    tab.dataset.vista = "salud";
    tab.textContent = "Consejos de salud";
    nav.appendChild(tab);

    var section = document.createElement("section");
    section.id = "vista-salud";
    section.className = "vista";
    section.innerHTML =
      "<div class='tarjeta'><h1>Cuida tu corazón, paso a paso</h1>" +
        "<p class='nota'>Orientación general para acompañar tu rehabilitación. Las indicaciones de tu equipo sanitario tienen prioridad.</p>" +
        "<div class='extra-consejo'><h2>💊 Medicación</h2><p>Tómala tal como te la han pautado. No la suspendas ni cambies la dosis por tu cuenta. Si olvidas una toma o tienes efectos adversos, consulta las instrucciones recibidas o pregunta a un profesional.</p></div>" +
        "<div class='extra-consejo'><h2>🚶 Actividad física</h2><p>Retoma la actividad de forma progresiva y según tu plan de rehabilitación. Calienta y enfría con calma, y para si aparece un síntoma preocupante. No persigas una meta genérica de pasos o minutos si no es la indicada para ti.</p></div>" +
        "<div class='extra-consejo'><h2>🥗 Alimentación</h2><p>Prioriza verduras, frutas, legumbres, cereales integrales, frutos secos sin sal y aceite de oliva. Modera los alimentos muy salados, ultraprocesados, bebidas azucaradas y carnes procesadas. Adapta las recomendaciones si tienes otras condiciones médicas.</p></div>" +
        "<div class='extra-consejo'><h2>🚭 Tabaco y vapeo</h2><p>Dejar de fumar aporta beneficios cardiovasculares. Si fumas, pedir apoyo profesional puede facilitarlo; no tienes que hacerlo en solitario. Comenta también el vapeo y la exposición al humo.</p></div>" +
        "<div class='extra-consejo'><h2>🍷 Alcohol</h2><p>El alcohol no es necesario para proteger el corazón. Si consumes, coméntalo con tu equipo sanitario: puede interactuar con medicamentos o no ser recomendable en tu situación.</p></div>" +
        "<div class='extra-consejo'><h2>😴 Sueño y bienestar emocional</h2><p>Intenta mantener horarios de descanso y habla con alguien de confianza sobre cómo te sientes. La preocupación o el ánimo bajo merecen atención; coméntalos con tu equipo de salud si persisten o te dificultan el día a día.</p></div>" +
        "<div class='extra-consejo'><h2>🩺 Registros útiles</h2><p>Mide la tensión siguiendo la técnica que te enseñaron y anota fecha, hora y contexto. Un valor aislado no suele bastar para sacar conclusiones. Lleva tus registros a las revisiones.</p></div>" +
        "<div class='extra-consejo'><h2>🆘 Señales de alarma</h2><p>Ante dolor u opresión en el pecho, dificultad respiratoria intensa, desmayo o síntomas súbitos graves, llama al 112. No esperes a que un semáforo de la aplicación confirme que es urgente.</p></div>" +
        "<p class='nota'>La aplicación es una herramienta de registro y acompañamiento; no diagnostica, no predice eventos y no sustituye la atención sanitaria.</p>" +
      "</div>";
    main.appendChild(section);

    tab.addEventListener("click", function () {
      document.querySelectorAll(".tab").forEach(function (x) { x.classList.remove("activo"); });
      document.querySelectorAll(".vista").forEach(function (x) { x.classList.remove("activo"); });
      tab.classList.add("activo");
      section.classList.add("activo");
      window.scrollTo(0, 0);
    });
  }

  function goTo(name) {
    var b = document.querySelector(".tab[data-vista='" + name + "']");
    if (b) b.click();
  }

  function getLatest(d) {
    var arr = d.constantes || [];
    return arr.length ? arr[arr.length - 1] : null;
  }

  function bmi(weight, heightCm) {
    var h = Number(heightCm) / 100;
    return weight > 0 && h > 0 ? weight / (h * h) : 0;
  }

  function addRiskPanel() {
    var box = $("tablaOrientativa");
    if (!box || $("extraRiesgo")) return;
    box.insertAdjacentHTML("beforebegin",
      "<div class='tarjeta' id='extraRiesgo' style='margin-top:1rem'>" +
        "<h2>🚦 Lectura orientativa de tus últimos datos</h2>" +
        "<div id='extraSemaforo' aria-live='polite'></div>" +
        "<div id='extraIndices'></div>" +
        "<p class='nota'>Este semáforo no diagnostica ni calcula el riesgo cardiovascular global. Considera la señal más destacada disponible; no combines ni cambies tratamientos basándote en él. Tus objetivos personales y el criterio clínico tienen prioridad.</p>" +
      "</div>"
    );
  }

  function renderRisk() {
    var d = readBase();
    var c = getLatest(d);
    var out = $("extraSemaforo");
    var idx = $("extraIndices");
    if (!out || !idx) return;
    if (!c) {
      out.innerHTML = "<div class='extra-semaforo ambar'><strong>🟠 Aún no hay registros.</strong><br>Añade una medición para ver una orientación.</div>";
      idx.innerHTML = "";
      return;
    }

    var findings = [];
    var s = Number(c.sistolica) || 0;
    var dia = Number(c.diastolica) || 0;
    var glu = Number(c.glucemia) || 0;
    var total = Number(c.colTotal) || 0;
    var ldl = Number(c.colLDL) || 0;
    var o = d.objetivos || {};

    if (s >= 180 || dia >= 120) {
      findings.push({ level: 2, text: "Tensión muy elevada en este registro (" + s + "/" + dia + " mmHg). Repite la medición siguiendo las indicaciones sanitarias y contacta con un profesional. Si hay síntomas graves, llama al 112." });
    } else if ((o.sisMax && s > Number(o.sisMax)) || (o.diaMax && dia > Number(o.diaMax))) {
      findings.push({ level: 1, text: "La tensión supera el objetivo personal guardado. Sigue el plan que acordaste con tu equipo." });
    } else if (s >= 140 || dia >= 90) {
      findings.push({ level: 1, text: "La tensión está elevada en esta medición. Una lectura aislada no establece un diagnóstico; consulta tus registros con tu equipo." });
    }

    if (glu >= 126) {
      findings.push({ level: 1, text: "La glucemia en ayunas es alta respecto a referencias generales; debe interpretarla y, si procede, confirmarla un profesional." });
    } else if (glu >= 100) {
      findings.push({ level: 1, text: "La glucemia en ayunas está por encima del intervalo de referencia habitual; coméntala en consulta." });
    }
    if (o.ldlMax && ldl && ldl > Number(o.ldlMax)) {
      findings.push({ level: 1, text: "El LDL supera el objetivo personal que has guardado." });
    } else if (ldl >= 160) {
      findings.push({ level: 1, text: "El LDL requiere interpretación con el contexto clínico y el riesgo individual." });
    }
    if (total >= 240) {
      findings.push({ level: 1, text: "El colesterol total está elevado según referencias generales; consulta el perfil completo con tu equipo." });
    }

    var level = findings.reduce(function (m, x) { return Math.max(m, x.level); }, 0);
    var tone = level === 2 ? "rojo" : (level === 1 ? "ambar" : "verde");
    var heading = level === 2 ? "🟠 Atención: revisa este resultado" :
      (level === 1 ? "🟡 Conviene revisar estos datos" : "🟢 Sin alertas orientativas en los datos disponibles");
    var body = findings.length ? findings.map(function (x) { return "<p>• " + esc(x.text) + "</p>"; }).join("") :
      "<p>No se han detectado valores que activen estas referencias generales. Esto no significa que todo esté necesariamente dentro de tu objetivo personal.</p>";
    out.innerHTML = "<div class='extra-semaforo " + tone + "'><strong>" + heading + "</strong>" + body +
      "<p class='nota'>Último registro: " + esc(dayName(c.fecha)) + ".</p></div>";

    var profile = extra.perfil || {};
    var imc = bmi(Number(c.peso) || 0, Number(profile.altura) || 0);
    var html = "<div class='datos'>";
    if (imc) {
      var imcText = Number(profile.edad || (d.perfil && d.perfil.edad) || 0) < 18 ?
        "En menores de 18 años se interpreta por edad y desarrollo." :
        (imc < 18.5 ? "Por debajo del intervalo adulto habitual" :
        (imc < 25 ? "Intervalo adulto habitual" :
        (imc < 30 ? "Sobrepeso: orientación general" : "Obesidad: orientación general")));
      html += "<div class='dato'><b>" + imc.toFixed(1) + "</b><span>IMC · kg/m²</span><p class='nota'>" + esc(imcText) + "</p></div>";
    } else {
      html += "<div class='dato'><b>—</b><span>IMC</span><p class='nota'>Añade altura en Ajustes y registra el peso.</p></div>";
    }
    html += "<div class='dato'><b>" + (c.cintura ? esc(c.cintura) + " cm" : "—") +
      "</b><span>Perímetro abdominal</span><p class='nota'>Registra la medida para seguir su evolución. Su interpretación depende de referencias personales.</p></div>";
    html += "<div class='dato'><b>" + (profile.tabaco === "si" ? "Sí" : (profile.tabaco === "no" ? "No" : "—")) +
      "</b><span>Fuma actualmente</span></div>";
    if (profile.tabaco === "si" && profile.cigarros) {
      html += "<div class='dato'><b>" + esc(profile.cigarros) + "</b><span>Cigarrillos al día</span></div>";
    }
    html += "<div class='dato'><b>" + (profile.alcohol !== undefined && profile.alcohol !== "" ? esc(profile.alcohol) : "—") +
      "</b><span>Bebidas/semana*</span></div></div>";
    html += "<p class='nota'>*Dato opcional autodeclarado. El IMC es una relación entre peso y altura, no una medida de masa muscular; para estimar composición corporal hacen falta otras técnicas.</p>";
    idx.innerHTML = html;
  }

  function renderReferences() {
    var box = $("tablaOrientativa");
    if (!box) return;
    var groups = [
      ["Tensión arterial en adultos (mmHg)", [
        ["Menos de 120 y menos de 80", "Referencia óptima general; no sustituye tu objetivo individual."],
        ["120–139 o 80–89", "Interpretar con el contexto, la técnica de medida y las indicaciones clínicas."],
        ["140 o más o 90 o más", "Lectura elevada: consulta el conjunto de registros con un profesional."],
        ["180 o más o 120 o más", "Muy elevada: repite según las indicaciones sanitarias; si hay síntomas graves, llama al 112."]
      ]],
      ["Glucemia en ayunas (mg/dL)", [
        ["70–99", "Intervalo de referencia general."],
        ["100–125", "Por encima del intervalo habitual; requiere valoración clínica."],
        ["126 o más", "Puede requerir confirmación diagnóstica por un profesional."]
      ]],
      ["Colesterol (mg/dL)", [
        ["Colesterol total menor de 200", "Referencia general; el total no basta para decidir tratamiento."],
        ["Colesterol total 200–239", "Interpretar junto al resto del perfil lipídico."],
        ["Colesterol total 240 o más", "Elevado en referencias generales; consulta a tu equipo."],
        ["LDL", "El objetivo depende del riesgo cardiovascular y de tus antecedentes. Tras un infarto puede ser más estricto; usa el objetivo indicado por tu equipo."]
      ]],
      ["IMC en personas adultas (kg/m²)", [
        ["Menos de 18,5", "Por debajo del intervalo adulto habitual."],
        ["18,5–24,9", "Intervalo adulto habitual."],
        ["25–29,9", "Sobrepeso según clasificación general."],
        ["30 o más", "Obesidad según clasificación general."]
      ]],
      ["Perímetro abdominal y composición corporal", [
        ["Perímetro abdominal", "No hay un único umbral válido para todas las personas: depende, entre otros factores, del sexo y de la población de referencia. Registra la evolución y consulta el valor con tu equipo."],
        ["Masa muscular", "No puede calcularse con peso y altura. El IMC no diferencia músculo de grasa."]
      ]]
    ];
    var html = "<p class='nota'>Son referencias poblacionales orientativas, no metas individuales. La técnica de medición, la edad, el embarazo, las enfermedades y los tratamientos pueden cambiar su interpretación.</p>";
    html += groups.map(function (g) {
      return "<h3>" + esc(g[0]) + "</h3><div class='tabla-scroll'><table><thead><tr><th>Referencia</th><th>Interpretación general</th></tr></thead><tbody>" +
        g[1].map(function (r) {
          return "<tr><td>" + esc(r[0]) + "</td><td style='white-space:normal'>" + esc(r[1]) + "</td></tr>";
        }).join("") + "</tbody></table></div>";
    }).join("");
    box.innerHTML = html;
  }

  function renderGoals() {
    var d = readBase();
    var out = $("extraObjetivos");
    if (!out) return;
    var today = localDate();
    var meds = d.medicacion || [];
    var tomas = (d.tomas || {})[today] || {};
    var taken = meds.filter(function (m) { return !!tomas[m.id]; }).length;
    var acts = (d.actividad || []).filter(function (a) { return a.fecha === today; });
    var mins = acts.reduce(function (sum, a) { return sum + (Number(a.minutos) || 0); }, 0);
    var hasMood = (d.animo || []).some(function (a) { return a.fecha === today; });
    var hasConst = (d.constantes || []).some(function (c) { return c.fecha === today; });
    var goals = [];

    if (meds.length) goals.push({
      key: "med", label: "Registrar la medicación de hoy", done: taken >= meds.length,
      action: "medicacion", detail: taken + " de " + meds.length + " marcadas"
    });
    if (extra.metaActividad > 0) goals.push({
      key: "act", label: "Actividad acordada: " + extra.metaActividad + " min", done: mins >= extra.metaActividad,
      action: "actividad", detail: mins + " min registrados"
    });
    if (extra.metas.animo) goals.push({
      key: "animo", label: "Registrar cómo me encuentro", done: hasMood,
      action: "emociones", detail: hasMood ? "Anotado hoy" : "A tu ritmo"
    });
    if (extra.metas.constantes) goals.push({
      key: "constantes", label: "Anotar una constante", done: hasConst,
      action: "constantes", detail: hasConst ? "Anotada hoy" : "Solo si forma parte de tu plan"
    });

    if (!goals.length) {
      out.innerHTML = "<p class='nota'>No hay objetivos diarios activados. Puedes activar el registro de ánimo o constantes aquí:</p>" +
        "<label><input type='checkbox' data-meta='animo' " + (extra.metas.animo ? "checked" : "") + " style='width:auto'> Incluir ánimo</label>" +
        "<label><input type='checkbox' data-meta='constantes' " + (extra.metas.constantes ? "checked" : "") + " style='width:auto'> Incluir constantes</label>";
      return;
    }
    var done = goals.filter(function (g) { return g.done; }).length;
    var pct = Math.round(100 * done / goals.length);
    var bar = $("extraBarra");
    var p = $("extraCumplimiento");
    if (bar) bar.style.width = pct + "%";
    var progress = document.querySelector("#extraInicio [role='progressbar']");
    if (progress) progress.setAttribute("aria-valuenow", pct);
    if (p) p.innerHTML = "<strong>" + pct + "%</strong> · " + done + " de " + goals.length + " objetivos completados";
    var greeting = $("extraSaludo");
    if (greeting) greeting.textContent = pct === 100 ?
      "¡Buen trabajo! Has completado los objetivos que elegiste para hoy." :
      "Cada pequeño paso cuenta. Elige lo que quieres registrar hoy.";

    out.innerHTML = goals.map(function (g) {
      return "<div class='extra-meta'><div><strong>" + (g.done ? "✅ " : "○ ") + esc(g.label) +
        "</strong><br><span class='nota'>" + esc(g.detail) + "</span></div>" +
        "<button class='secundario' type='button' data-ir='" + esc(g.action) + "'>" +
        (g.done ? "Ver" : "Registrar") + "</button></div>";
    }).join("") +
    "<div style='margin-top:.7rem'>" +
      "<label><input type='checkbox' data-meta='animo' " + (extra.metas.animo ? "checked" : "") + " style='width:auto'> Incluir ánimo en mis objetivos</label>" +
      "<label><input type='checkbox' data-meta='constantes' " + (extra.metas.constantes ? "checked" : "") + " style='width:auto'> Incluir constantes en mis objetivos</label>" +
    "</div>";
  }

  function renderAll() {
    renderGoals();
    renderRisk();
    renderReferences();
  }

  function watchNavigation() {
    document.querySelectorAll(".tabs .tab:not([data-vista='salud'])").forEach(function (b) {
      b.addEventListener("click", function () {
        setTimeout(renderAll, 30);
      });
    });
    document.addEventListener("click", function (ev) {
      if (ev.target.closest(".tab") || ev.target.closest("#listaMed") ||
          ev.target.closest("#btnGuardarAnimo") || ev.target.closest("#formAct button")) {
        setTimeout(renderAll, 50);
      }
    });
    ["formConst", "formAct", "formMed"].forEach(function (id) {
      var form = $(id);
      if (form) form.addEventListener("submit", function () { setTimeout(renderAll, 50); });
    });
    var mood = $("btnGuardarAnimo");
    if (mood) mood.addEventListener("click", function () { setTimeout(renderAll, 50); });
  }

  addStyles();
  addProfileFields();
  addWaistField();
  addHomePanel();
  addAdviceTab();
  addRiskPanel();
  watchNavigation();
  renderAll();
})();