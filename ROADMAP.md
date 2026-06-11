# Roadmap

Lista de mejoras propuestas para futuras versiones de **Plan de Estudios Interactivo**, ordenadas por impacto esperado. Este documento no es un compromiso, sino un repositorio de ideas para cuando se decida priorizar trabajo.

---

## Funcionales (alto impacto)

### Cálculo detallado de progreso
Mostrar en el sidebar o topbar un resumen del estilo "Te faltan X materias para egresar, Y aprobadas, Z en curso, W regulares". El porcentaje actual da una idea general, pero conocer el número exacto de materias pendientes es información concreta y motivadora.

### Promedio por año / cuatrimestre
Hoy el promedio es global. Mostrar también el promedio de cada año por separado (o por período) ayuda a detectar en qué momento de la carrera al estudiante le fue mejor o peor, y a fijarse objetivos por ciclo.

### Vista de calendario / timeline
Como toggle en el topbar, una segunda vista que muestre las materias agrupadas por fecha real (cohorte / año calendario) en lugar de por año de carrera. Útil para planear: *"¿qué tengo que rendir en marzo del año que viene?"*.

### Búsqueda global con `Ctrl+K`
Un atajo que abra un buscador rápido estilo *command palette* para saltar a cualquier materia escribiendo parte del nombre. Aumenta mucho la velocidad de uso en planes grandes.

### Historial de cambios por materia
Registrar automáticamente eventos del tipo *"el 12/06 cambiaste el estado a Aprobada con nota 8"*. Sirve para reconstruir cuándo aprobaste cada cosa, especialmente si en algún momento perdés el seguimiento.

---

## UX (impacto medio)

### Auto-backup en background
En lugar de avisar cada 7 días para exportar, generar y guardar automáticamente una copia del JSON en `localStorage` con clave del tipo `pe2_autobackup_YYYYMMDD`, manteniendo las últimas 5 copias. Agregar un botón "Restaurar backup" en Configuración que liste las copias disponibles.

### Onboarding interactivo
En lugar (o además) del modal de texto, hacer un tour interactivo con tooltips que vayan apareciendo sobre cada elemento real de la UI (panel lateral, botón "+", barra de progreso, etc.) explicando in situ.

### Confirmación al cerrar con cambios sin exportar
Usar `beforeunload` para avisar si pasaron más de N días desde el último export y se intenta cerrar la pestaña. *"Tenés cambios sin guardar como JSON. ¿Salir igualmente?"*.

### Atajos de teclado expuestos
Además de `Ctrl+Z` (deshacer eliminación) que ya existe, agregar:
- `Ctrl+N`: nueva materia
- `Ctrl+F`: filtro / búsqueda
- `Ctrl+E`: exportar
- `Ctrl+,`: configuración
- `?`: abrir guía de ayuda

Mostrarlos en un modal "Atajos de teclado" accesible desde la guía de ayuda.

### Promedios alternativos configurables
Permitir al usuario elegir cómo se calcula el promedio: simple, ponderado por carga horaria, con o sin aplazos, considerando solo las últimas N materias, etc.

---

## Visuales (bajo impacto pero suman)

### Modo oscuro completo
Hoy el sidebar es oscuro y el contenido claro. Implementar un toggle de tema completo (claro / oscuro / sistema) que cambie también el área principal. Convendría mover toda la paleta a CSS custom properties para hacerlo sin esfuerzo.

### Densidad ajustable
Opción "compacto / cómodo / amplio" que cambia paddings y tamaños de fuente, para usuarios que quieren ver más materias a la vez versus los que prefieren tarjetas más grandes.

### Animación al aprobar una materia
Una micro-animación (confetti rápido, scale-up suave, glow verde transitorio) cuando una materia cambia a estado Aprobada. Pequeña recompensa visual que refuerza el progreso.

### Colores personalizables por materia o por área
Que el usuario pueda asignar colores a grupos de materias (ej. todas las de programación en azul, las matemáticas en rojo). Ayuda visualmente a ver "áreas temáticas" dentro del plan.

### Iconos por tipo de materia
Asignar un icono opcional a cada materia (programación, matemática, idioma, taller, etc.) que aparezca al lado del nombre. Sutil pero ayuda al escaneo visual.

---

## Técnicas

### Service Worker para offline real y detección de versiones
Convertir la app en PWA básica con un service worker que cachee los recursos y permita uso offline real. Como bonus, detectar versiones nuevas en tiempo real (sin necesidad de recargar) y mostrar el modal de novedades cuando se publica una actualización.

### Tests automatizados básicos
Crear un `tests.html` que cargue el código y ejecute aserciones sobre las funciones puras (`promedio`, `estado`, `ancestros`, `descendientes`, detección de ciclos, migración de datos, etc.). Ahorra regresiones cada vez que se agreguen features.

### Compresión del export JSON
Para planes grandes, ofrecer exportar a un formato comprimido (`.gz` o sin indentación). Mantener ambas opciones en Configuración.

### Validación estricta al importar
Hoy la validación al importar es básica (verifica que sea un array). Agregar validación de campo por campo con mensajes específicos: *"La materia 'X' tiene un peso inválido"*, *"La materia 'Y' tiene una correlativa que no existe"*, etc.

### Refactor a módulos
A medida que la app crece, el archivo único se vuelve difícil de mantener. Considerar separar en módulos ES6 con un build step mínimo (esbuild, vite) — manteniendo la salida como un solo HTML standalone si se prefiere.

---

## Sincronización entre dispositivos (mayor cambio de arquitectura)

Esto requiere backend y cambia el modelo "100% offline" actual. Solo se justifica si pasa a ser un requerimiento.

### Sincronización opcional
Permitir al usuario opcional vincular su plan a una cuenta (Google, GitHub) y sincronizar automáticamente entre dispositivos. La app sigue funcionando offline, pero con sincronización cuando hay conexión.

### Modo compartir plan
Generar un link público (de solo lectura) para mostrar el plan a otra persona sin que pueda editarlo. Útil para compartir con tutores o entre estudiantes de la misma carrera.

---

## Estado de implementación

Ninguna de las mejoras de este documento está implementada. Se irán moviendo al CHANGELOG.md a medida que se completen.
