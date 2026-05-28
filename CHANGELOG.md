# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [1.0.0] - 2026-05-28

Primera versión pública estable. Aplicación web autónoma de un solo archivo HTML para gestión completa del plan de estudios.

### Added — Características principales

#### Gestión de materias
- Alta, edición, duplicación y eliminación de materias.
- Validación de nombres únicos (no se permiten duplicados).
- Menú contextual `⋯` en cada tarjeta con acciones Editar / Duplicar / Eliminar.
- Campos por materia: nombre, profesor/cátedra, fecha de cursado (date picker), año, período, tipo (obligatoria/optativa), peso, anual, aprobación (promocionable/regularizable), estado, notas múltiples, fecha de vencimiento de regularidad, observaciones, correlativas.

#### Esquema temporal
- Tipos de período configurables: bimestre (6 columnas), trimestre (3), semestre (2), cuatrimestre (2).
- Carreras de 1 a 10 años.
- Soporte de **medio año final** para carreras de duración fraccional (ej. 5 años y medio).
- Materias **anuales** que cruzan todos los períodos de su año, con grilla adaptativa que las muestra junto a las materias por período.

#### Correlatividades
- Selección visual desde el modal, agrupadas por año, una materia por fila.
- **Detección automática de ciclos**: bloquea seleccionar correlativas que generarían dependencia circular.
- **Resaltado inteligente** de toda la red de dependencias (ancestros y descendientes transitivos) al seleccionar una tarjeta.
- Bloqueo de aprobación si faltan correlativas aprobadas.
- Advertencia al desaprobar una materia requisito de otras ya aprobadas.

#### Estados de cursada
- Cinco estados: Pendiente, En curso, Regularizada, Aprobada, **Libre** (automático por vencimiento de regularidad).
- Estados Pendiente/En curso/Regularizada/Aprobada seleccionables directamente desde la tarjeta.
- Estado **Bloqueada** derivado de correlativas faltantes.
- Tarjeta en rojo automática cuando una materia regularizada vence su fecha de regularidad.

#### Notas y promedio
- **Múltiples notas** por materia en orden cronológico (permite registrar aplazos).
- Nota final tomada de la última nota cargada, mostrada en la tarjeta (solo lectura).
- Cálculo en tiempo real de dos promedios ponderados:
  - Promedio sin aplazos (notas ≥ 4).
  - Promedio con aplazos (todas las notas).
- Pesos decimales libres por materia (≥ 0,1).

#### Topbar y progreso
- Barra de progreso de carrera ocupando todo el ancho del topbar.
- Color dinámico tricolor según porcentaje: **rojo** (<20%), **amarillo** (20–50%), **verde** (≥50%).
- Personita corriendo (negra) como indicador de posición animado.
- Birrete de graduación gris pulsante como meta visual.
- Filtro por estado en el topbar.
- Nombre de la carrera con metadato de años al lado.

#### Sidebar
- Card destacada con promedio ponderado, contador de materias aprobadas y promedio con aplazos.
- Lista lateral con búsqueda por nombre y mini-indicadores de estado/tipo.
- Acciones de Datos: Exportar JSON, Importar JSON, PDF, Limpiar notas, Borrar todo.
- Colapsado completo del sidebar con botón flotante para reabrir.

#### Configuración
- Nombre de la carrera, estudiante, facultad, universidad.
- Año de ingreso y egreso.
- Cantidad de años, medio año final, tipo de período.
- Persistencia en `localStorage`.

#### Persistencia e intercambio
- Guardado automático en `localStorage` del navegador.
- Fallback a memoria si `localStorage` no está disponible.
- **Exportación JSON** con metadatos (`appVersion`, `dataVersion`, `exportedAt`).
- **Importación JSON** con validación y migración automática desde versiones anteriores del formato.
- **Exportación a PDF** vía `window.print()` con hoja `@media print` A4 apaisada, incluye encabezado (carrera, estudiante, cohorte), grilla limpia y footer de autoría.

#### UX
- Drag & drop para reubicar materias entre celdas (año, período, conversión a anual).
- Confirmaciones mediante modales propios (no `confirm`/`alert` nativos).
- **Deshacer eliminación** desde toast o atajo `Ctrl+Z` / `Cmd+Z`.
- Scrollbars finas globales.
- Tipografía consistente IBM Plex Sans / IBM Plex Mono.

### Highlights de diseño
- Estética profesional sobria: paleta neutra fría, sidebar gris oscuro sin matices de color, acentos contenidos.
- Tarjetas con borde de color de estado completo (sin franja lateral).
- Headers de año y columnas con fondo oscuro neutro y texto blanco.
- Badges de aprobación con color: **amarillo** (Promocionable) y **verde** (Regularizable), mutuamente excluyentes.
- Modales con header y footer grises diferenciados, botón X con hover rojo.
- Botón "Borrar todo" en rojo sólido con texto blanco.

---

## Historial de desarrollo

El desarrollo se realizó de forma iterativa en sucesivas rondas de refinamiento. Las decisiones más relevantes:

- **Migración de stack**: arranque en React (JSX) y migración a HTML autónomo con JavaScript vanilla para eliminar dependencias y permitir uso offline con doble clic.
- **Modelo de datos v2**: pasaje de `aprobada: bool` + `nota: number` a `estado: string` + `notas: number[]`, con migración automática de datos antiguos al importar.
- **Grilla adaptativa**: refactor de "dos filas por año" (anuales + períodos como filas separadas) a "una fila por año" con subgrid interno que acomoda anuales y períodos sin duplicar el header de año.
- **Estado Libre**: incorporado como estado derivado automático al detectar vencimiento de regularidad, en lugar de transición manual.

---

## Formato

- **Added** para funcionalidades nuevas.
- **Changed** para cambios en funcionalidades existentes.
- **Deprecated** para funcionalidades que se eliminarán pronto.
- **Removed** para funcionalidades eliminadas.
- **Fixed** para corrección de bugs.
- **Security** para vulnerabilidades.

[1.0.0]: https://github.com/usuario/plan-estudios-interactivo/releases/tag/v1.0.0
