# Changelog
## 0.5.2
- Navegación fluida: al elegir una opción, la pantalla se desplaza sola (con suavidad) para mostrar lo que aparece: fecha y categorías al elegir Gasto/Ingreso, subcategorías y detalle al elegir una categoría, y el formulario con el botón Registrar al terminar. Al registrar o cancelar, vuelve arriba para ver la confirmación.
- Reportes: al elegir tipo o categoría se muestran las siguientes opciones (o el reporte, si no hay más); los botones rápidos (Este mes, etc.) llevan al reporte.
- Configuración: al abrir «Importar desde Excel» y al revisar o importar, se muestra el resultado.
- Al cambiar de pestaña, la página siempre empieza arriba.
## 0.5.1
- Registrar: usa todo el ancho en pantallas grandes (centrado, iconos y textos más grandes, descripción/cantidad/monto en una fila).
- Registrar: Gasto e Ingreso ahora son una ilustración (monitor con gráfico, moneda y flecha) con un botón debajo: contorno cuando está inactivo; relleno, elevación y brillo al pasar el cursor o al estar activo. Gasto en naranja, Ingreso en celeste.
- Iconos: Rilan › Coca/Extras = dos hojas (#00d947); Rilan › Ocio = caña de pesca (#356bff); icono de Rilan en #356bff.
- Gráficos: más nítidos (el doble de resolución), colores más vivos, ejes y cuadrícula mínimos, texto más claro y bordes finos. Anillo con bordes redondeados.
- PDF: los gráficos se exportan en alta definición (3x), con fondo blanco y colores claros para imprimir, y mantienen su proporción.
## 0.5.0
- Nueva pestaña ⚙️ Configuración: Mis categorías (editar nombre y subcategorías, eliminar; si cambias el nombre, también se actualizan los movimientos ya registrados), Respaldo y datos (con aviso de cuándo fue el último respaldo), Cuenta (correo, cambiar contraseña, Salir) y Acerca de (versión).
- Respaldo JSON, Importar respaldo e Importar desde Excel pasan de Notas a Configuración.
- Datos separados por persona: cada usuario ve solo lo suyo (sin cambios en la base). Instrucciones para crear usuarios en el README.
## 0.4.9
- Móvil: barra superior más pequeña. El botón ☰ pasa de 52 a 44 px y el logo de 38 a 32 px (misma proporción, centrados en la misma línea).
## 0.4.8
- General: resumen del año en curso (si no hay datos de este año, el último año con datos). Ocupa todo el ancho disponible (las demás pestañas mantienen su ancho).
- General, tarjetas: menos alto, con contorno completo en el color de su borde izquierdo; 5 en una fila en pantallas anchas, una por fila en móvil.
- General, nuevos gráficos: anillo de % ingresos vs. gastos y barras con las 3 categorías más fuertes de ingresos y de gastos, antes de «Últimos movimientos».
- General: dos botones grandes al final: «Añadir registro» y «Ver historial».
- Botón eliminar: ahora es un icono de papelera rojo con contorno, proporcional al texto (General, Historial y categorías propias en Registrar). Antes era un emoji casi invisible en modo oscuro.
- Fix: el botón eliminar de «Últimos movimientos» en General no hacía nada; ahora elimina (con confirmación).
## 0.4.7
- Registrar › Ingreso: nuevo primer paso «Origen del ingreso» (Rilan, Ingrid, Hospedaje, Otros ingresos) y luego su categoría: Rilan (Sueldo escuela, Dividendo escuela, Trading, Otros ingresos), Ingrid (Sueldo escuela, Dividendo escuela, Yanbal, Otros ingresos), Hospedaje (En mi familia, En otras familias). «Otros ingresos» va directo a descripción y monto.
- En la base: categoria = origen, subcategoria = categoría. Sin cambios de esquema; los ingresos antiguos se conservan.
- Iconos: Rilan = varón, Ingrid = mujer, Hospedaje = cama/hotel, Trading = gráfico. Mismo flujo animado de siempre.
- Importar desde Excel: valida origen y categoría de ingresos. Nueva Plantilla_Ar_Finance.xlsx con gastos e ingresos.
- Reportes (solo lo necesario): el filtro de ingresos usa los nuevos orígenes y muestra también los ingresos antiguos si existen.
## 0.4.6
- Reportes, filtros: tarjeta «Filtros» con botones rápidos (Este mes, Mes anterior, Este año), campos más grandes en cuadrícula (2x2 en móvil), selector de tipo como 3 botones con borde, aviso si «Desde» es posterior a «Hasta», calendario visible en modo oscuro y corrección del Mes en blanco al cambiar de año.
- Reportes, tarjetas: textos más grandes, 2 columnas en móvil, línea con el periodo y nº de movimientos, veredicto con barra de color.
- Reportes, cálculos nuevos: tasa de ahorro, categoría más fuerte con su %, participación de la categoría en el total, promedio por movimiento.
- Reportes, gráficos: colores según modo claro/oscuro, cuadrícula visible en oscuro, montos y % en las barras, ejes en Bs, tooltips con Bs, etiquetas largas recortadas, fondo propio (el PDF ya no sale con texto invisible en modo oscuro).
## 0.4.5
- Los archivos css/js se enlazan con ?v=0.4.5 en index.html: el navegador (sobre todo el móvil) pide siempre los archivos nuevos. Subir este número en cada versión.
- Entrega de actualizaciones como paquete «solo archivos cambiados, con sus carpetas y sin config.js».
## 0.4.4
- Registrar: casilla de fecha grande con contorno naranja y fecha en texto largo («Hoy · …»).
- Iconos de categorías y subcategorías: el icono central toma colores de la marca y de su significado (contorno sin cambios; relleno morado al elegir subcategoría).
- Cantidad: 1 por defecto en todos los registros, con botones − / +; la importación de Excel y JSON también usa 1 si falta.
- Móvil: icono ☰ más grande, texto +1.5 px, botones Registrar/Cancelar más grandes, barra superior con el logo completo.
## 0.4.3
- Importar desde Excel (Notas): sube un .xlsx (plantilla) o pega las filas copiadas; revisa antes de importar (errores por fila, categorías inexistentes, duplicados omitidos).
- Plantilla Plantilla_Ar_Finance.xlsx. Inserción por lotes (agregarVarios).
## 0.4.2
- supabase-js fijado en 2.116.0 (compatible con la clave publishable sb_publishable_...).
- Importar respaldo JSON (Notas): omite duplicados, valida datos, recupera categorías propias y notas.
- .github/workflows/keepalive.yml: ping cada 3 días para evitar la pausa del plan gratuito.
- config.js: allowSignup:false oculta «Crear cuenta».
## 0.4.1
- General y Reportes: tarjetas con iconos alusivos al dato.
- Registrar: botón Gasto con contorno #fe9900; subcategorías con hover/activo #af11f2; iconos de detalle #fe9900.
- Reportes: mismo comportamiento de iconos que Registrar (categoría → subcategoría → detalle con animación) y filtro por subcategoría/detalle.
- Gráficos: #00f8ff para datos positivos (ingresos) y #af11f2 para negativos (gastos).
## 0.4.0
- Fix: texto de los botones (Gasto/Ingreso, menú) ilegible en modo oscuro.
- Categorías, subcategorías y detalles como iconos (contorno redondeado) con animación: las demás se ocultan detrás de la elegida, que se agranda, y el siguiente nivel entra de izquierda a derecha.
- Reportes: Año y Mes combinables; Desde/Hasta opcionales y vacíos; tipo Gastos / Ingresos / Gastos vs Ingresos con iconos; categorías con iconos (multi-selección).
- Con categoría: gasto total, gasto más frecuente, promedio por semana, gráfico de recurrentes y evolución con línea de tendencia.
- Granularidad automática: mes → días y semanas; rango mayor → semanas y días; año → meses y semanas.
- Gastos vs Ingresos: gráfico mensual solo en este modo, y gráfico de comportamiento con tendencias.
## 0.3.0
- Renombrada a Ar_Finance, con logo (icono e icono+texto, claro/oscuro) e iconos de instalación.
- Menú lateral: General, Registrar, Reportes, Historial, Notas (en móvil, menú ☰).
- General: resumen del mes (categoría más fuerte, producto más registrado en unidades, últimos movimientos).
- Registrar en cascada: Gasto/Ingreso → fecha → categoría → subcategoría → detalle → descripción, cantidad, monto. 11 categorías de gasto nuevas y hasta 3 categorías propias.
- Reportes: selectores de mes y año solo con datos; reporte general del año (barras horizontales por categoría + ingresos vs. gastos) y desglose por categoría.
- BD: columnas subcategoria, detalle, cantidad y tabla categorias (límite 3 por trigger). Editado schema.sql (aún no había Supabase).
## 0.2.0
- Estructura de proyecto GitHub Pages + Supabase.
- Capa de datos js/data.js con adaptadores memoria y supabase.
- Login con correo y contraseña (Supabase Auth).
- Pestañas Registrar, Historial (búsqueda, filtro, eliminar), Reportes (filtros, tarjetas, gráficos, PDF) y Notas (autoguardado, respaldo JSON).
- schema.sql con RLS. Pruebas en test/test.js. manifest y sw.js solo como marcadores (PWA real en 0.3.0).
## 0.1.0
- Prototipo en Claude.
