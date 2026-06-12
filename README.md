# Plan de Estudios Interactivo

[![Live](https://img.shields.io/badge/live-online-success)](https://lautaro-benitez.github.io/Plan_de_Estudios_Interactivo/)
[![Version](https://img.shields.io/badge/version-1.5.0-blue)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-lightgrey)](LICENSE)

Aplicación web autónoma —un solo archivo HTML— para gestionar el plan de estudios de una carrera universitaria: materias, correlatividades, estados de cursada, notas, promedio ponderado, progreso de carrera, generación de plan con IA y exportación a PDF.

No requiere instalación, servidor ni dependencias. Funciona 100% offline y se abre con doble clic en cualquier navegador moderno.

**🔗 [Probar en vivo](https://lautaro-benitez.github.io/Plan_de_Estudios_Interactivo/)**

---

## Características

### Gestión del plan
- Alta, edición, duplicación y eliminación de materias desde un menú contextual en cada tarjeta.
- Validación de nombres únicos.
- Materias **obligatorias** y **optativas** con peso configurable para el promedio (decimal libre, no se limita a 1 o 0,5).
- Cada materia admite: nombre, profesor o cátedra, fecha de cursado, año, período, peso, tipo, observaciones libres y correlatividades.
- **Aprobación por equivalencia**: marca explícita para materias aprobadas por equivalencia. Si no se le carga nota, no afecta el promedio.

### Esquema temporal flexible
- Períodos configurables: **bimestre, trimestre, semestre, cuatrimestre**.
- Carreras de **1 a 10 años**, con opción de **medio año final** (ej. carreras de 5 años y medio).
- Materias **anuales** que cruzan todos los períodos del año, conviviendo en la misma fila con materias cuatrimestrales o semestrales (grilla adaptativa).

### Correlatividades
- Selección de correlativas agrupadas por año en el modal de edición, una por fila.
- **Detección automática de ciclos**: si seleccionar una correlativa crearía una dependencia circular, la opción aparece deshabilitada.
- **Resaltado inteligente de la red**: al hacer clic en una tarjeta se resaltan todas sus dependencias (ancestros y descendientes transitivos) en verde si está aprobada o rojo si no lo está.
- Bloqueo automático para aprobar una materia si faltan correlativas aprobadas.
- Advertencia al desaprobar una materia que es requisito de otras aprobadas.

### Estados de cursada
Cinco estados con transiciones explícitas o automáticas:

| Estado | Descripción |
|---|---|
| Pendiente | Aún no cursada |
| En curso | Cursándose actualmente |
| Regularizada | Cursada aprobada, falta final |
| Aprobada | Materia aprobada con nota final |
| **Libre** | Automático cuando una materia regularizada vence su regularidad. Tarjeta en rojo. |

Una materia **promocionable** que no llegó a promocionar puede quedar como *Regularizada* y luego pasar a *Aprobada* rindiendo final. Promocionable y Regularizable son mutuamente excluyentes y se eligen al editar la materia.

### Notas y promedio
- Múltiples notas por materia en orden cronológico (permite registrar aplazos).
- La última nota cargada es la **nota final** (se muestra en la tarjeta, solo lectura).
- Dos promedios calculados en tiempo real:
  - **Promedio ponderado** sin aplazos (notas ≥ 4).
  - **Promedio con aplazos** (todas las notas).
- Fórmula: Σ(nota × peso) / Σ(peso).

### Progreso de carrera
- Barra de progreso en el topbar a todo el ancho, con tres tramos de color:
  - **Rojo** hasta 20%.
  - **Amarillo** del 20% al 50%.
  - **Verde** del 50% en adelante.
- Personita corriendo (indicador de posición) y birrete de graduación pulsante como meta.

### Filtros y vista
- Filtro por estado en el topbar (Aprobadas, Regularizadas, Libres, En curso, Pendientes, Pendientes con correlativas).
- Búsqueda por nombre en la lista lateral.
- **Colapsar filas y columnas** completas con un click en el encabezado del año o del período. El estado de colapso se recuerda entre sesiones.
- Sidebar colapsable a pantalla completa en mobile.
- Drag & drop para reubicar materias entre celdas (año, período, anual).

### Configuración de la carrera
Nombre de la carrera, estudiante, facultad, universidad, año de ingreso y egreso, cantidad de años, medio año final, tipo de período. Importar y exportar JSON también viven en este modal.

### Generación con IA
Si tenés el plan completo a mano, podés generar el JSON automáticamente:

1. Click en **Generar con IA** (sidebar).
2. Copiá el prompt prearmado.
3. Pegalo en cualquier IA (ChatGPT, Claude, Gemini, etc.) junto con la lista de materias de tu carrera.
4. Guardá la respuesta como `.json` e importala desde Configuración.

### Persistencia de datos
- Almacenamiento automático en `localStorage` del navegador.
- **Aviso de modo incógnito** si el storage no está disponible.
- **Recordatorio cada 7 días** para exportar el plan como backup, con opción "No recordar más".
- **Exportación / importación en JSON** con versionado (`appVersion`, `dataVersion`, `exportedAt`).
- Migración automática al importar versiones anteriores del formato.
- **Exportación a PDF** con modal de opciones para elegir orientación A4 (horizontal o vertical), estilos de impresión optimizados.

### Otros
- **Guía interactiva de uso** al iniciar la app y reapertura desde el link "Ayuda" del footer.
- **Modal "Acerca de"** con enlaces a este README y a la licencia, abierto haciendo click en la versión del footer.
- **Modal de novedades** al actualizar a una versión nueva, con la lista de cambios.
- Atajo de teclado `Ctrl+Z` / `Cmd+Z` para deshacer eliminación de materia.
- Toast con acción "Deshacer" al eliminar.
- Sistema de confirmaciones modales en lugar de `alert` / `confirm` nativos.
- Scrollbars finas en desktop y ocultas en mobile (scroll por gesto).

### Diseño responsive
- Adaptación completa para pantallas móviles (≤ 768 px) con sidebar off-canvas a pantalla completa.
- Grilla del plan reorganizada a una sola columna en mobile, con etiqueta de período por celda.
- Modales y toasts ajustados para tap cómodo y ancho completo.

---

## Uso

### Online
Abrí directamente la versión publicada: <https://lautaro-benitez.github.io/Plan_de_Estudios_Interactivo/>

### Local
1. Descargá `index.html` desde el repo (o cloná el repositorio completo).
2. Abrilo con doble clic en cualquier navegador moderno (Chrome, Firefox, Edge, Safari).
3. La primera vez aparece la **guía de bienvenida** con los pasos para configurar tu carrera, agregar materias y empezar a usar la app.

Los datos se guardan automáticamente en tu navegador. Para conservarlos entre dispositivos, usá **Exportar JSON** en Configuración y luego importalos en el otro dispositivo.

### Atajos de teclado

| Atajo | Acción |
|---|---|
| `Esc` | Cerrar modales |
| `Enter` | Confirmar en diálogos de confirmación |
| `Ctrl+Z` / `Cmd+Z` | Deshacer última eliminación |

---

## Compatibilidad

- Navegadores con soporte de CSS Grid moderno: Chrome / Edge 88+, Firefox 87+, Safari 14+.
- Funciona 100% offline una vez cargado.
- Requiere JavaScript habilitado.
- Optimizado para desktop, tablet y mobile.

---

## Estructura del proyecto

```
plan-estudios-interactivo/
├── index.html          # Aplicación completa (HTML + CSS + JS embebidos)
├── README.md
├── CHANGELOG.md        # Historial de versiones
├── ROADMAP.md          # Mejoras propuestas para próximas versiones
└── LICENSE             # MIT
```

No hay build step, no hay `package.json`, no hay dependencias. Todo el código vive en `index.html`.

---

## Stack técnico

- **HTML5 + CSS3** (Grid, custom properties, `@media print`).
- **JavaScript ES5 vanilla** sin frameworks.
- **Tipografías** IBM Plex Sans / IBM Plex Mono desde Google Fonts.
- **`localStorage`** para persistencia con fallback en memoria.
- **`window.print()`** + hoja de estilos `@media print` para PDF.

---

## Roadmap

Las mejoras planificadas para futuras versiones están documentadas en [ROADMAP.md](ROADMAP.md). Incluye ideas funcionales (cálculo detallado de progreso, búsqueda con `Ctrl+K`, vista de calendario), de UX (auto-backup, onboarding interactivo) y técnicas (PWA / service worker, tests automatizados).

---

## Contribuir

Las contribuciones son bienvenidas. Si encontrás un bug o tenés una idea, abrí un issue.

Para cambios mayores, abrí primero un issue para discutir qué te gustaría modificar.

---

## Licencia

MIT — ver [LICENSE](LICENSE).

---

## Autor

**Lautaro Benitez** — 2026
