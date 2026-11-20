# Re-Late Kardia

**Aplicación web progresiva (PWA) de acompañamiento en rehabilitación cardiaca.**

Autoría: **Miguel Ángel Layunta López** · **Re-Late**

---

## Qué es

Re-Late Kardia acompaña a personas que han sufrido un evento cardiaco y a quienes las cuidan.
No es una app de bienestar genérica: está pensada para el día a día de un programa de
rehabilitación cardiaca, con especial atención a la medicación, las constantes, la actividad
progresiva y la seguridad ante una urgencia.

## Funcionalidades

| Módulo | Qué hace |
|---|---|
| **Hoy** | Panel diario con adherencia a 7 días, próxima toma y accesos rápidos |
| **Constantes** | Registro de tensión, pulso, peso y glucosa con gráficas y rangos acordados |
| **Actividad** | Cronómetro con pantalla siempre activa, pulsómetro Bluetooth y escala de Borg |
| **Comida** | Semáforo nutricional, buscador de alimentos, menú semanal y lista de la compra |
| **Ánimo** | Escalas visuales, evolución emocional y respiración guiada 4-6 |
| **Cuidador** | Panel de seguimiento, agenda médica y bloc de dudas para la consulta |
| **Ajustes** | Perfil clínico, medicación con foto, copias de seguridad y exportación FHIR |

### Seguridad

- Protocolo SOS paso a paso para dolor torácico, falta de aire o mareo.
- Llamada directa al 112 y aviso al contacto de emergencia.
- Ubicación compartida **solo** tras una acción explícita de la persona usuaria.

### Ficha de urgencias

Resumen imprimible con datos críticos, medicación y contacto, más un **código QR**
generado localmente. Funciona sin conexión.

### Interoperabilidad

Exportación en **FHIR** (`Bundle` con `Patient`, `Observation`, `MedicationStatement`
y `AllergyIntolerance`), lista para integrarse con sistemas clínicos.

## Privacidad

- Todos los datos se guardan en el dispositivo (`localStorage`).
- No hay servidor, ni analítica, ni rastreadores, ni publicidad.
- La exportación solo se produce cuando la persona usuaria la solicita.

## Accesibilidad

Diseñada siguiendo los criterios de la **EN 301 549** y las **WCAG 2.2**:

- Objetivos táctiles de 48 px como mínimo.
- Contraste alto y escalado al 200 % sin pérdida de contenido.
- Navegación completa por teclado y lector de pantalla.
- Respeto de `prefers-reduced-motion`.
- Modo claro y oscuro.

## Estructura del proyecto

