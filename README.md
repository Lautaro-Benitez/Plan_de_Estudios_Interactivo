# Plan de Estudios Interactivo

Aplicación web autónoma (un solo archivo HTML) para gestionar el plan de estudios de una carrera universitaria: alta de materias, correlatividades, estados de cursada, notas, promedio ponderado, progreso de carrera y exportación a PDF.

No requiere instalación, servidor ni dependencias. Se abre con doble clic en cualquier navegador moderno.

---

## Características

### Gestión del plan
- Alta, edición, duplicación y eliminación de materias desde un menú contextual en cada tarjeta.
- Validación de nombres únicos.
- Materias **obligatorias** y **optativas** con peso configurable para el promedio (decimal libre, no se limita a 1 o 0,5).
- Cada materia admite: nombre, profesor/cátedra, fecha de cursado, año, período, peso, tipo y observaciones.

### Esquema temporal flexible
- Períodos configurables: **bimestre, trimestre, semestre, cuatrimestre**.
- Carreras de **1 a 10 años**, con opción de **medio año final** (ej. carreras de 5 años y medio).
- Materias **anuales** que cruzan todos los períodos del año, conviviendo en la misma fila con materias cuatrimestrales/semestrales (grilla adaptativa).

### Correlatividades
- Selección de correlativas agrupadas por año en el modal de edición.
- **Detección automática de ciclos**: si seleccionar una correlativa crearía una dependencia circular, la opción aparece deshabilitada.
- **Resaltado inteligente de la red**: al hacer clic en una tarjeta se resaltan todas sus dependencias (ancestros y descendientes transitivos) en verde si está aprobada, rojo si no lo está.
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

Una materia **promocionable** que no llegó a promocionar puede quedar como *Regularizada* y luego pasar a *Aprobada* rindiendo final.

### Notas y promedio
- Múltiples notas por materia en orden cronológico (permite registrar aplazos).
- La última nota cargada es la **nota final** (se muestra en la tarjeta, solo lectura).
- Dos promedios calculados en tiempo real:
  - **Promedio ponderado** sin aplazos (notas ≥ 4).
  - **Promedio con aplazos** (todas las notas).
- Fórmula: Σ(nota × peso) / Σ(peso).

### Progreso de carrera
- Barra de progreso en el topbar a todo el ancho con tres tramos de color:
  - **Rojo** hasta 20%.
  - **Amarillo** del 20% al 50%.
  - **Verde** del 50% en adelante.
- Personita corriendo (indicador de posición) y birrete de graduación pulsante como meta.

### Filtros y vista
- Filtro por estado en el topbar (Aprobadas, Regularizadas, Libres, En curso, Pendientes, Pendientes con correlativas).
- Búsqueda por nombre en la lista lateral.
- Sidebar colapsable a pantalla completa.
- Drag & drop para reubicar materias entre celdas (año, período, anual).

### Configuración de la carrera
- Nombre de la carrera, estudiante, facultad, universidad.
- Año de ingreso y egreso.
- Cantidad de años, medio año final, tipo de período.

### Persistencia de datos
- Almacenamiento automático en `localStorage` del navegador.
- **Exportación / importación en JSON** con versionado (`appVersion`, `dataVersion`, `exportedAt`).
- Migración automática al importar versiones anteriores del formato.
- **Exportación a PDF** vía diálogo de impresión del navegador (A4 apaisado, sin librerías externas).

### Otros
- Atajo de teclado `Ctrl+Z` / `Cmd+Z` para deshacer eliminación de materia.
- Toast con acción "Deshacer" al eliminar.
- Sistema de confirmaciones modales en lugar de `alert`/`confirm` nativos.
- Scrollbars finas en todo el documento.

---

## Uso

1. Descargá el archivo `plan-estudios.html` (o cloná el repo).
2. Abrilo con doble clic en cualquier navegador moderno (Chrome, Firefox, Edge, Safari).
3. Configurá tu carrera desde el botón **⚙ Configuración** en el sidebar.
4. Agregá materias con **+ Agregar materia**.
5. Definí correlatividades, estados y notas según vayas avanzando.

Los datos se guardan automáticamente en tu navegador. Para conservarlos entre dispositivos, usá **Exportar** para descargar un archivo JSON.

### Atajos de teclado

| Atajo | Acción |
|---|---|
| `Esc` | Cerrar modales |
| `Enter` | Confirmar en diálogos de confirmación |
| `Ctrl+Z` / `Cmd+Z` | Deshacer última eliminación |

---

## Compatibilidad

- Probado en navegadores con soporte de CSS Grid moderno (Chrome/Edge 88+, Firefox 87+, Safari 14+).
- Funciona 100% offline.
- Requiere JavaScript habilitado.

---

## Estructura del proyecto

```
plan-estudios-interactivo/
├── plan-estudios.html      # Aplicación completa (HTML + CSS + JS embebidos)
├── README.md
├── CHANGELOG.md
└── LICENSE
```

No hay build, no hay `package.json`, no hay dependencias. Todo en un archivo.

---

## Stack técnico

- HTML5 + CSS3 (Grid, Custom Properties).
- JavaScript ES5 vanilla (sin frameworks).
- Tipografías IBM Plex Sans / IBM Plex Mono desde Google Fonts.
- `localStorage` para persistencia.
- `window.print()` + `@media print` para generación de PDF.

---

## Contribuir

Las contribuciones son bienvenidas. Si encontrás un bug o tenés una idea, abrí un issue.

Para cambios mayores, abrí primero un issue para discutir qué te gustaría modificar.

---

## Licencia

MIT — ver [LICENSE](LICENSE).

---

## Autor

**Lautaro Benitez** — IN3DITO 2026
