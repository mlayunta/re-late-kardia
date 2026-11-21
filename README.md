# 🫀 Re-Late Kardia

**Aprender y avanzar en comunidad**

Aplicación web progresiva (PWA) de acompañamiento para personas que han sufrido un
infarto o conviven con una enfermedad cardiovascular, y para sus cuidadores.

Todo funciona **en local**: tus datos **nunca salen de tu dispositivo**.

---

## ✨ Novedades de la versión 3.2.0

- 🖨️ **Informe para el médico**: resumen imprimible de los últimos 30 días
  (adherencia, medias de tensión, pulso, glucemia, colesterol y peso) y botón
  **Compartir informe**.
- 🔠 **Accesibilidad**: tamaño de letra ajustable (**A− / A+**), **modo oscuro
  automático** según el sistema y **botón SOS flotante** siempre visible.
- 📅 **Cuenta atrás para la revisión**: «Faltan X días» en Inicio.
- 📊 **Media de tensión de los 7 días** en la tarjeta de última constante.
- ⚠️ **Aviso inmediato** al guardar una tensión alta.
- 🖼️ **Franjas de imagen** personalizables en cada sección.

### Versiones anteriores

**3.1.0**
- ✏️ Editar y 🗑️ borrar registros (medicación, constantes, actividad, ánimo y notas).
- 📊 Panel de **adherencia** de los últimos 7 días.
- 🔔 **Avisos de medicación** del navegador.
- 🔒 **Bloqueo con PIN** de 4 dígitos y **borrado total** con doble confirmación.

**3.0.0**
- Reconstrucción completa de la interfaz.
- Secciones: Inicio, Medicación, Constantes, Actividad, Nutrición, Emociones,
  Guía visual, SOS, Cuidador y Ajustes.

---

## 🧭 Secciones

| Sección | Para qué sirve |
|---------|----------------|
| **Inicio** | Resumen del día: progreso, tomas, última constante, próxima revisión y adherencia |
| **Medicación** | Alta, edición y borrado de medicamentos; marcado de tomas diarias |
| **Constantes** | Tensión, pulso, peso, cintura, glucemia y colesterol; gráficas y tablas orientativas |
| **Actividad** | Cronómetro, escala de esfuerzo Borg, historial y guías oficiales de ejercicio |
| **Nutrición** | Plato mediterráneo interactivo y semáforo de alimentos |
| **Emociones** | Registro del estado de ánimo y respiración guiada 4-7-8 |
| **Guía visual** | Los 5 pilares de la rehabilitación y las señales de alarma |
| **SOS** | Protocolo de urgencia, llamada al 112 y ubicación GPS |
| **Cuidador** | Resumen para la consulta y notas del cuidador |
| **Ajustes** | Perfil, objetivos, informe, accesibilidad, copias de seguridad y PIN |

---

## 🔒 Privacidad

- Todos los datos se guardan en el **almacenamiento local del navegador** (`localStorage`).
- **No hay servidores, cuentas ni analíticas.** Nada se envía a Internet.
- Puedes **exportar** una copia de seguridad en `.json` e **importarla** cuando quieras.
- El **PIN** es una barrera de acceso local (no es cifrado fuerte). Si lo olvidas,
  tendrás que borrar los datos del navegador.

---

## ♿ Accesibilidad

- Tamaño de letra ajustable (100 %, 110 %, 125 %).
- Modo claro, oscuro o automático según el sistema.
- Navegación por teclado, etiquetas ARIA y textos alternativos.
- Respeta la preferencia de **movimiento reducido**.
- Botón SOS flotante opcional.

---

## 🚀 Uso

### En el ordenador
Abre `index.html` con el navegador.

> ⚠️ Al abrirlo con `file://` el navegador bloquea el manifiesto y el service
> worker (es normal). La app funciona igual.

### En el móvil (recomendado)
1. Abre la app desde su dirección web.
2. Menú del navegador → **Añadir a pantalla de inicio**.
3. Se instalará como una app y funcionará sin conexión.

---

## 📁 Estructura

```
Re-Late Kardia/
├── index.html              # Aplicación completa (HTML + CSS + JavaScript)
├── sw.js                   # Service worker (funcionamiento sin conexión)
├── manifest.webmanifest    # Manifiesto PWA (nombre, iconos, colores)
├── icon-192.png            # Icono 192×192
├── icon-512.png            # Icono 512×512
└── README.md               # Este archivo
```

---

## 🌐 Publicar en GitHub Pages

1. Sube los archivos a un repositorio de GitHub.
2. Ve a **Settings → Pages**.
3. En *Source*, elige la rama `main` y la carpeta `/ (root)`.
4. Guarda. En unos minutos estará disponible en:

```
https://TU-USUARIO.github.io/TU-REPOSITORIO/
```

> 💡 Cada vez que cambies el `index.html`, sube también la versión del `sw.js`
> para que los dispositivos descarguen la nueva.

---

## ⚕️ Aviso médico

Re-Late Kardia es una herramienta de **apoyo y registro**. **No diagnostica, no
prescribe y no sustituye** el criterio de tu equipo sanitario.

Ante cualquier síntoma grave, **llama al 112**.

---

## 📄 Licencia

AGPL-3.0-or-later · © 2026 Miguel Ángel Layunta López y Re-Late
