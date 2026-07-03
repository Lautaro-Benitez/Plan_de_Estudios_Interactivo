# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [1.6.0] - 2026-07-03

Extracción de scripts, correcciones de importación.

### Added
- **Nuevos badges** en el README con enlaces útiles y el correcto versionado del repositorio.

### Changed
- **Scripts y CSS externos**: El código JavaScript y CSS ahora residen en sus propios archivos (`main.js` y `styles.css` respectivamente) para mantener el `index.html` limpio.

### Fixed
- **Compatibilidad de importación**: Corrección al importar archivos JSON de versiones antiguas que no usaban el objeto `config` centralizado, permitiendo mantener la configuración de la carrera y el entorno sin problemas.

---

## [1.5.0] - 2026-06-11

Historial de versiones accesible desde Acerca de, colapso real de columnas y correcciones de UX.

### Added
- **Acceso al historial completo de versiones** desde el modal "Acerca de" con un nuevo enlace "Historial de versiones" que muestra todos los cambios de la app, ordenados de la versión más reciente a la más antigua.

### Changed
- **Botón "Ayuda" en el footer** ahora tiene estilo de botón azul pequeño (antes era un enlace de texto), para hacerlo más visible y consistente con el resto de la UI.
- **Colapso real de columnas**: cuando se colapsa una columna ahora se reduce realmente su ancho a 40 px (antes solo se ocultaba el contenido pero la columna seguía ocupando el ancho proporcional del grid). El header colapsado muestra `⋯`.

### Fixed
- **Hover de la versión del footer**: el cambio de color a azul ahora se activa solo cuando el mouse pasa por encima del texto de la versión, no de todo el footer.
- **Nota automática en equivalencias**: las materias marcadas como aprobadas por equivalencia ya no reciben automáticamente la nota 7 cuando se eliminan sus notas. Esto restaura el comportamiento esperado: equivalencia sin nota = no afecta el promedio.

---

## [1.4.0] - 2026-06-11

Guía de inicio para nuevos usuarios, botón de ayuda persistente y botones principales con colores distintivos.

### Added
- **Modal de bienvenida**: al iniciar la app por primera vez (sin materias cargadas y sin carrera configurada), se despliega automáticamente una guía paso a paso con 4 pasos numerados que explican cómo configurar la carrera, agregar materias, cargar correlatividades y actualizar el progreso. Incluye una mención al atajo "Generar con IA" para quienes tengan el plan completo.
- **Botón flotante de ayuda** (`?`) en la esquina inferior derecha, persistente y discreto (semi-transparente, se opaca al hover). Reabre la guía de bienvenida en cualquier momento.

### Changed
- **Botones principales con colores distintivos**:
  - "Agregar materia" en **verde** (acción de creación).
  - "Configuración" en **azul** (configuración del sistema).
  - "Generar con IA" en **amarillo** (acción asistida con IA).
- **Modal "Generar con IA" en mobile**: el textarea del prompt ahora tiene 300 px de altura (antes 180 px) y los pasos ocupan menos espacio para que el contenido sea más cómodo de leer en celulares. El modal sigue siendo scrolleable.

---

## [1.3.0] - 2026-06-11

Mejoras de UI, unificación visual de botones y exportación a PDF con opciones de orientación.

### Added
- **Modal de exportación a PDF** con elección de orientación A4 (horizontal o vertical) según la cantidad de períodos de la carrera. La última orientación elegida queda recordada.
- **Estilos de impresión optimizados**: tarjetas más compactas, badges de estado coloreados por estado, headers con contraste alto, footer con autoría.
- **Click en la versión del footer** abre el modal "Acerca de" (el botón dedicado se eliminó del sidebar).

### Changed
- **Colapsar columnas y filas**: ahora se hace con click directo en el encabezado (se eliminaron los botones `+`/`−`). El encabezado tiene hover indicativo.
- **Botones unificados**: todos los modales usan el mismo estilo "Cancelar" (secundario) y la misma acción primaria (azul). Eliminada la variante violeta del botón "Generar con IA".
- **Footer de modales**: los botones ahora siempre se alinean a la derecha en una sola fila, con un tamaño mínimo consistente. En mobile pasan a ocupar el ancho completo en una fila horizontal.
- **Modales centrados en mobile**: ya no se anclan a la parte superior, ahora se centran vertical y horizontalmente en la pantalla.
- **Footer de la app centrado en mobile** (era right-aligned).
- **Eliminados los botones Importar/Exportar del sidebar**: ahora viven solo en el modal de Configuración para mantener una sola entrada de acceso.
- **Sin emojis en los botones**; se reemplazan por etiquetas de texto consistentes.

### Removed
- Botón "Acerca de" del sidebar (ahora accesible desde la versión del footer).
- Botones de colapso/expansión `+`/`−` en headers de filas y columnas.
- Botones de Importar y Exportar JSON del sidebar (movidos a Configuración).

---

## [1.2.0] - 2026-06-11

Aprobación por equivalencia, generador de JSON con IA y colapso de columnas/filas en la grilla.

### Added
- **Aprobación por equivalencia**: nueva opción en el modal de materia para marcar una materia aprobada como obtenida por equivalencia. Si tiene nota cargada, cuenta en el promedio normalmente; si no tiene nota, no afecta el promedio. Se identifica en la tarjeta con un badge "EQUIV".
- **Generador de plan con IA**: nuevo botón "✨ Generar con IA" en la sección Datos del sidebar. Abre un modal con un prompt prearmado y un botón para copiarlo al portapapeles. El usuario pega ese prompt en cualquier IA (ChatGPT, Claude, Gemini, etc.) junto con su plan de estudios, recibe un JSON listo para importar y lo carga con la opción Importar.
- **Colapso de columnas y filas en la grilla**:
  - Cada encabezado de columna (Bimestre 1, Cuatrimestre 1, etc.) y cada encabezado de año tiene un botón `−`/`+` para colapsarlo o expandirlo.
  - Las columnas colapsadas se muestran como una franja rayada con `⋯` indicando contenido oculto; las filas colapsadas reducen su año al header con un contador de materias.
  - El estado de colapso se guarda en `localStorage` y se mantiene entre sesiones.
  - En mobile el colapso de columnas se desactiva (no aporta nada con una sola columna visible).

### Changed
- Versión de datos a `3`. Se agregó el campo `equivalencia` (boolean) a cada materia. Los datos existentes se migran automáticamente al cargar, asignando `equivalencia: false` por defecto.
- El encabezado de columnas del board tiene un poco más de padding lateral para acomodar el nuevo botón de colapso.

---

## [1.1.0] - 2026-06-11

Soporte completo para dispositivos móviles. Inicio con sistema vacío. Modal "Acerca de" con enlaces a documentación y licencia.

### Added
- **Soporte mobile**: layout responsive completo para pantallas ≤ 768 px y ajustes finales para pantallas ≤ 380 px.
  - **Sidebar off-canvas**: en mobile el panel lateral arranca oculto y se abre como cajón desde la izquierda con backdrop oscuro.
  - **Botón hamburguesa** (☰) permanente en el topbar para abrir el sidebar.
  - **Cierre por tap en el backdrop** o al seleccionar cualquier opción del sidebar.
  - **Grilla del plan en una sola columna**: los períodos se apilan verticalmente con etiqueta de período arriba de cada celda.
  - **Header de año como banner horizontal** (en lugar de columna izquierda).
  - **Topbar compacto**: altura reducida a 56 px, título recortado con ellipsis, metadato de años oculto en mobile.
  - **Modales a pantalla completa**: ocupan 100 % del ancho con padding reducido; grillas de configuración pasan a 2 columnas (o 1 en móviles muy chicos).
  - **Toast a ancho completo** anclado al borde inferior.
  - **Etiquetas de período por celda** (Cuatrimestre 1, etc.) en lugar del encabezado fijo de columnas, que se oculta en mobile.
- **Modal "Acerca de"** accesible desde el sidebar con descripción del proyecto, versión, enlaces a README y LICENSE en GitHub, y créditos.

### Changed
- **Inicio en blanco**: nuevas instalaciones arrancan sin materias precargadas (antes cargaba un plan de ejemplo de 13 materias). La función `seed()` se mantiene en el código por compatibilidad.
- **Layout del sidebar en desktop**: la lógica de colapso fue refactorizada para coexistir con el modo off-canvas de mobile sin conflictos.

### Fixed
- El sidebar fixed en pantallas chicas ahora se cierra correctamente al hacer tap fuera o seleccionar una acción (antes quedaba abierto bloqueando interacción).

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

[1.5.0]: https://github.com/Lautaro-Benitez/Plan_de_Estudios_Interactivo/releases/tag/v1.5.0
[1.4.0]: https://github.com/Lautaro-Benitez/Plan_de_Estudios_Interactivo/releases/tag/v1.4.0
[1.3.0]: https://github.com/Lautaro-Benitez/Plan_de_Estudios_Interactivo/releases/tag/v1.3.0
[1.2.0]: https://github.com/Lautaro-Benitez/Plan_de_Estudios_Interactivo/releases/tag/v1.2.0
[1.1.0]: https://github.com/Lautaro-Benitez/Plan_de_Estudios_Interactivo/releases/tag/v1.1.0
[1.0.0]: https://github.com/Lautaro-Benitez/Plan_de_Estudios_Interactivo/releases/tag/v1.0.0
