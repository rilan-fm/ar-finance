# Changelog
## 0.11.1
- Gastos › Hogar: nueva subcategoría «Ropa y zapatos hijos».
- Gastos › Ingrid: nuevas subcategorías «Ayuda a familia» y «Otros».
- Gastos › Rilan › «Ropa» ya existía; no se cambió.
- Los movimientos ya registrados no se tocan. Sin cambios en la base de datos.
## 0.11.0
- Registrar › Fecha: nuevo botón «📌 Fijar mes». Eliges un mes una sola vez (por ejemplo Julio) y todos los registros nuevos usan ese mes, sin tener que cambiarlo en cada uno. Mientras está fijado se ve una etiqueta «Mes fijo: Julio 2026» y el recuadro de fecha brilla para que no lo olvides. Botones «Cambiar mes» y «Quitar» (quitar vuelve a la fecha de hoy). El mes fijo no se guarda: al recargar la página vuelve a hoy.
- Con el mes fijo, el calendario solo muestra ese mes (flechas bloqueadas) y se recuerda el último día usado: el siguiente registro empieza en ese mismo día.
- Calendario propio, más grande (≈ 25–30 % más que el nativo), minimalista, con contorno naranja y esquinas redondeadas, en modo claro y oscuro: flechas de mes, toque en el título para cambiar mes o año, botones «Hoy» y «Cerrar», se cierra con Esc.
- Al registrar, el mensaje confirma la fecha usada (ej. «✔ Gasto registrado · 15/07/2026»).
- Seguridad extra: no deja guardar si la fecha queda fuera del mes fijado.
- Sin cambios en la base de datos. «Editar movimiento» (Historial) sigue con el selector de fecha nativo.
## 0.10.1
- Fix de coherencia en Reportes: el periodo ahora siempre cubre todos los movimientos incluidos (antes, un movimiento con fecha posterior a hoy entraba en las tarjetas pero no en los gráficos de evolución).
- Promedio mensual: se calcula con los meses transcurridos reales (días ÷ 30,44) en lugar de contar el mes en curso completo, que bajaba el promedio.
- Gastos vs Ingresos (gasto e ingreso a la vez): el gráfico de diferencias ya no omite subcategorías (las menores se agrupan en «Otras (n)»), de modo que la suma de sus barras es igual al Balance de la tarjeta. La tarjeta «Gasto sobre ingreso» indica además la tasa de ahorro, o avisa si se gasta más de lo que ingresa. Se muestra en una línea cómo se calcula cada valor.
- Sin cambios en la base de datos.
## 0.10.0
- Reportes › Gastos vs Ingresos con gasto e ingreso a la vez: ahora es UN solo reporte unificado. Suma los gastos de todas las categorías de gasto activas y los ingresos de todas las de ingreso activas (por ejemplo «Gasto Rilan vs Ingreso Rilan + Hospedaje»).
- 4 tarjetas: Ingresos, Gastos, Balance y Gasto sobre ingreso (%). 3 gráficos: diferencia (ingresos − gastos) por subcategoría, barras de ingresos vs gastos vs balance, y balance acumulado en el tiempo (por día, semana o mes según el periodo). PDF horizontal de una hoja (reporte-gastos-vs-ingresos.pdf).
- Mapa de calor: el dato de mayor monto o participación va en naranja #fe9900 (la rampa ahora termina en ese color).
- Menú lateral: el botón activo usa el azul #114df2.
- Sin cambios en la base de datos.
## 0.9.0
- Reportes › Gastos vs Ingresos: nueva casilla «Todos» junto a «Seleccionar varios» (en Gastos y en Ingresos). Marca todas las categorías del tipo y muestra un «Resumen global» (3 tarjetas y 3 gráficos agrupados por categoría).
- Reportes › Ingresos: si solo hay categorías de ingreso activas (ninguna de gasto), se muestran las mismas tarjetas y gráficos que en Gastos (ingresos totales, promedio flexible, ingreso más frecuente; barras, anillo y tendencia). También en PDF (reporte-ingresos.pdf).
- Mapa de calor con nueva paleta: turquesa #2AFAE9, celeste #00C0F5, azul #4254FF, violeta #8708E8, magenta #D604FF y rojo #FF0851 (de menor a mayor monto; en modo claro, tonos algo más oscuros). Porcentajes del anillo en blanco con sombra.
- Menú lateral rediseñado: iconos SVG de la app (en vez de emojis), texto e iconos más grandes, elemento activo con degradado y brillo, hover con desplazamiento suave.
- Sin cambios en la base de datos. Pendiente: flujo al combinar gastos e ingresos.
## 0.8.0
- Reportes: «TIPO DE REPORTE» encabeza la pestaña (título en mayúsculas). Tarjetas de tipo más angostas y altas, con ilustración grande, contorno celeste fijo, mini zoom y brillo neón sutil al pasar el mouse; al seleccionar se queda el color del tipo.
- Reportes, filtros: botones Año / Mes / Rango centrados y fijos al desplazarse (siempre visibles arriba). Año en curso activado por defecto; Año y Mes despliegan solo los valores con datos; Rango muestra las casillas Desde/Hasta solo cuando está activo (y desactiva Año y Mes). Se quitan los botones rápidos; queda «Limpiar».
- Gastos vs Ingresos, categorías: animación de entrada; casilla «Seleccionar varios» por tipo. Con la casilla apagada, al elegir una categoría las demás se esconden detrás de ella y la elegida queda ampliada; pulsarla de nuevo las devuelve. Con la casilla activa se eligen varias y aparece «Analizar» (pliega) / «Añadir o quitar categorías» (despliega). Gastos e Ingresos funcionan de forma independiente.
- Gastos vs Ingresos, solo categorías de gasto: un bloque por categoría con 3 tarjetas (gastos totales, promedio flexible diario/semanal/mensual según el periodo, subcategoría más frecuente) y 3 gráficos (barras horizontales por subcategoría, anillo de participación y tendencia en el tiempo) con colores de mapa de calor (morado, naranja, turquesa). 1 categoría: gráficos en una fila; 2 o más: bloques en 2 columnas, cada uno con su color de contorno.
- PDF de ese reporte: una hoja horizontal por categoría con tarjetas y gráficos en alta definición, sin listas, con los montos escritos en las barras.
- Sin cambios en la base de datos.
## 0.7.0
- Notas: el cuadro es ahora una sola línea delgada y crece solo al escribir (hasta el 70 % de la altura de la pantalla).
- Presupuestos por categoría (Historial y notas): fijas un límite mensual por categoría de gasto; barra de avance con colores (normal, naranja desde el 80 %, rojo al pasarte). Si una categoría se acerca o supera el límite, aparece un aviso en General.
- Pagos recurrentes (Historial y notas): luz, agua, internet, gas, pensión del colegio u otro. Cada uno tiene un día del mes y un estado: pagado este mes, vence en N días, vence hoy o vencido. El botón «Pagar» registra el gasto (te pide el monto real). Los avisos vencidos o por vencer aparecen en General.
- Metas de ahorro (Historial y notas): nombre, objetivo y fecha límite opcional; botón «Aportar» (número negativo para retirar), barra de avance, cuánto falta y cuánto ahorrar por mes para llegar a tiempo.
- Respaldo JSON e importación incluyen presupuestos, pagos recurrentes y metas. Renombrar una categoría propia actualiza también sus presupuestos y pagos recurrentes.
- Base de datos: 3 tablas nuevas con RLS (migraciones 001 y 002). La app sigue funcionando si aún no las ejecutas (esas tarjetas avisan que falta la migración).
- Fix móvil: las tarjetas de Historial y notas ya no desbordan en pantallas angostas.
## 0.6.0
- Menú lateral plegable (escritorio): botón ‹ para ocultarlo y ☰ (arriba a la izquierda) para mostrarlo; se recuerda en el dispositivo. Al ocultarlo, el contenido usa todo el ancho.
- Todas las pestañas usan todo el ancho con márgenes laterales moderados (16 a 48 px según la pantalla). Configuración se acomoda en dos columnas en pantallas anchas.
- Historial y Notas se fusionan en una sola pestaña: historial a la izquierda (más ancho) y notas a la derecha.
- Historial ordenado por momento de registro (lo último que registraste va primero, sin importar la fecha del movimiento). «Últimos movimientos» de General usa el mismo orden. Muestra 50 y botón «Mostrar más».
- Editar movimientos (botón lápiz en Historial y en General): fecha, categoría, subcategoría, detalle, descripción, cantidad y monto.
- Reportes: ningún tipo viene activado. «Gastos vs Ingresos» muestra dos columnas (Gastos a la izquierda, más ancha; Ingresos a la derecha) con interruptor por categoría. Cada categoría activada genera un bloque (tarjetas, veredicto y 2 gráficos); si activas la misma categoría en ambas columnas (ej. Rilan) se comparan en un mismo bloque. Los nuevos bloques se agregan abajo y, con 2 o más, aparece «Total de la selección». Botones «Activar todas» / «Quitar». Pulsar de nuevo un tipo lo desactiva.
- PDF de «Gastos vs Ingresos»: incluye los gráficos de todos los bloques.
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
