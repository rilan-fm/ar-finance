# Changelog
## 0.15.0
- **Perfil** (icono redondo arriba a la derecha; en el móvil, en la barra superior). Al pulsarlo se despliega un menú con animación suave: Tema (Claro / Oscuro / Sistema), Editar perfil, Mis categorías, Respaldo y datos, Cuenta y seguridad, Acerca de y **Cerrar sesión**.
- **Tema claro / oscuro / automático (sistema)**: se aplica al instante a toda la app (incluidos gráficos y logo) y se recuerda en el dispositivo. Sin parpadeo al abrir.
- **Editar perfil**: alias (hasta 24 caracteres) e imagen personalizada (se recorta en cuadrado y se reduce a 256 px). Se guardan en el dispositivo, por usuario.
- La pestaña **Configuración desaparece del menú izquierdo**: todo su contenido pasó al menú de perfil (cada opción abre una ventana). También se quitó «Salir» del menú izquierdo; ahora está en el perfil, con confirmación (avisa si hay cambios sin sincronizar o no hay conexión).
- Nuevos iconos del mismo estilo (cámara, luna, monitor, salida, candado, información, base de datos, cerrar). Botón «Atrás» del móvil y tecla Esc cierran el menú y las ventanas.
- Interno: el modo oscuro ahora se controla con `data-tema` en `<html>` (antes solo seguía al sistema). Lógica pura probada: `temaValido`, `aliasLimpio`, `fotoValida`.
- Sin cambios en la base de datos.
## 0.14.2
- General › Avisos: ahora muestra solo los 3 avisos más críticos (pago atrasado o presupuesto excedido primero, luego presupuesto cerca del límite, luego pagos al día) y avisa cuántos hay en total.
- Avisos: los emojis se reemplazan por iconos minimalistas del estilo de la app (campana en el título; triángulo de alerta rojo o naranja; check verde) dentro de un círculo con contorno.
- Avisos: la tarjeta tiene contorno de 1 px en #f5a62a en todo su borde.
- «Ver pagos mensuales» lleva a Historial y notas, hasta la tarjeta de Pagos mensuales, y esos pagos se ordenan del más atrasado al que está al día (los completos al final).
- Sin cambios en la base de datos.
## 0.14.1
- Móvil, botón «Atrás»: ahora retrocede **cada paso** que diste, en orden inverso, hasta llegar a General (por ejemplo: Registrar › Gasto › Víveres Alimentos › Abarrotes; cada «Atrás» quita un nivel, luego vuelve a la pestaña anterior, y así hasta General). Solo estando en General, un «Atrás» más sale de la app. Cada paso guarda su propia entrada en el historial del navegador en el momento en que tocas (antes se añadía al pulsar «Atrás», y los navegadores móviles lo ignoraban). Cerrar una ventana o enviar un registro con sus botones no deja «Atrás» muertos.
- Sin cambios en la base de datos.
## 0.14.0
- **Carga mucho más rápida.** La app guarda en el teléfono una copia de sí misma y de tus últimos datos: al abrirla, General aparece al instante con lo último guardado y luego se actualiza sola con internet. Los datos ya no se piden uno tras otro sino todos a la vez. La librería de gráficos carga aparte (los números y «Últimos movimientos» salen antes que los gráficos) y la de PDF solo cuando la necesitas. Reportes y General ya no dibujan gráficos mientras no los estás viendo.
- **Funciona sin internet (PWA).** Service worker real (`sw.js`) + manifest: la app abre sin conexión y se puede instalar en el móvil. Sin internet puedes registrar, editar y eliminar gastos e ingresos (y escribir notas); quedan guardados en el teléfono y, al volver internet, se sincronizan solos (sin duplicados). Un aviso arriba muestra «Sin conexión», «Sincronizando…» o «Todo sincronizado». Lo demás (categorías propias, presupuestos, pagos mensuales, metas, contraseña) necesita internet y lo dice claramente. Si sale una versión nueva, aparece «Actualizar».
- Seguridad: «Salir» ahora cierra solo la sesión de este dispositivo (antes cerraba todas) y borra la copia local; si hay cambios sin sincronizar, avisa antes. Tiempos máximos de espera para que nada se quede colgado con mala señal.
- **Avisos y Pagos mensuales con nueva lógica.** Ejemplos: «⏰ Banco: 10/12 pagos · atrasado: 1 mes (noviembre) ⚠️, te faltan 2 pagos para terminar los pagos del año.» y «⏰ Luz: 11/12 pagos · estás al día ✅, solo te falta 1 pago para completar todos los pagos del año.». Estados: Al día / Atrasado / Completo; el atraso se calcula con los meses transcurridos y nombra los meses sin pago (en pagos de 12 al año). Los avisos de presupuesto usan el mismo formato. La tarjeta «Pagos mensuales del año» y Reportes muestran el mismo texto.
- Sin cambios en la base de datos (los movimientos nuevos traen un id propio; la columna ya existe).
## 0.13.2
- Móvil: el botón «Atrás» del teléfono ya no saca de la app de golpe. Cada pulsación da un paso atrás dentro de la app: cierra la ventana abierta (calendario, editar, pagos) o el menú ☰; en Registrar y Reportes deshace el último nivel elegido (detalle → subcategoría → categoría → tipo); y luego vuelve a la pestaña anterior hasta llegar a General. Solo estando en General, un «Atrás» más sale de la app. Sin mensajes.
- Animaciones de los iconos (Registrar y Reportes): casi el doble de rápidas (se esconden/aparecen en ~0,2 s en vez de ~0,4 s). Mismo efecto, solo más veloz.
- Sin cambios en la base de datos.
## 0.13.1
- Reportes › Presupuesto: los iconos de categorías y subcategorías ahora tienen el mismo tamaño y estilo que los de «Gastos vs Ingresos», Gastos e Ingresos (círculo de 42 px con icono de 22 px; en subcategorías 34 px / 18 px). Mismos dibujos y colores que el resto de la app. Solo CSS; sin cambios en la base de datos.
## 0.13.0
- Configuración › Respaldo y datos: nuevo botón «📤 Exportar a Excel». Descarga `ar-finance-registros-AAAA-MM-DD.xlsx` con TODOS tus registros. Hoja «Movimientos»: Fecha, Tipo, Categoría, Subcategoría, Detalle, Descripción, Cantidad y Monto (Bs), de la más antigua a la más reciente, con filtros y encabezado fijo; tiene el mismo formato de la plantilla, así que se puede volver a importar. Hoja «Resumen»: totales por mes (ingresos, gastos y balance) y por categoría de gasto y de ingreso, con fórmulas.
- Sin cambios en la base de datos. (La librería de Excel se descarga solo al usar el botón: necesita internet.)
## 0.12.2
- General › anillo: sin bordes redondeados ni separación entre sectores (corte recto, estilo limpio). Sin cambios en la base de datos.
## 0.12.1
- General › anillo «Ingresos vs. gastos»: colores sólidos (ingresos #13dbf3, gastos #fe9900), sin degradado ni brillo, y el balance al centro en #00ff54 (rojo si es negativo). Las barras de las 3 categorías usan los mismos colores.
- General › tarjetas de los dos gráficos: fondo sólido #000b3e (sin degradado ni efectos), también en modo claro; los gráficos usan siempre texto claro sobre ese fondo.
- Reportes › Presupuesto: cada categoría y subcategoría lleva su icono (el mismo del resto de la app), en «Presupuesto real promedio», «Presupuesto asignado» y «Estado por categoría».
- Sin cambios en la base de datos.
## 0.12.0
- General (escritorio): los números de las tarjetas son mucho más grandes (hasta 27 px). Las 5 tarjetas van en una sola fila solo en pantallas muy anchas (≥1750 px); en las demás, 3 arriba y 2 abajo para que no se corten.
- General, gráficos con estilo «reporte empresarial/tecnológico»: anillo fino con degradados, brillo neón en modo oscuro y el balance al centro; barras redondeadas con degradado y cuadrícula punteada; tarjetas con fondo degradado y acento de color. (Pendiente de tu decisión si se aplica al resto de la app.)
- Historial: muestra solo los últimos 7 registros; el botón «Mostrar más» es grande y suma 10 cada vez.
- Historial y notas: se reemplazan «Presupuestos del mes» y «Pagos recurrentes» por **Pagos mensuales del año**. Pulsa «Configurar pago mensual», se abre una ventana y eliges categoría › subcategoría › detalle (ej. Hogar › Servicios básicos › Luz, Rilan › Banco, Colegio hijos › Pensiones) y cuántos pagos al año (12, o 10 para la pensión). Cada pago muestra «7/12 pagos realizados en la gestión 2026», barra de progreso y los 12 meses marcados. Un mes cuenta como pagado si registraste un gasto de ese concepto en ese mes. Estado: En curso, Sin margen, Atrasado o Completo. Botón «Registrar pago». Metas de ahorro se mantiene.
- Reportes: cuarta opción **Presupuesto**. Izquierda: «Presupuesto real promedio» (promedio mensual por categoría y subcategoría, según el periodo). Derecha: «Presupuesto asignado» (tú escribes los Bs al mes por categoría o subcategoría; botón «Rellenar con el promedio real»). Abajo, análisis asignado vs real: tarjetas, avisos por categoría (dentro del presupuesto, cerca del límite con su %, sobrepasado), 3 gráficos (asignado vs real, % usado con línea de 100 %, evolución vs presupuesto) y proyección de cierre si miras el mes actual. Usa los mismos filtros Año / Mes / Rango. El promedio mensual divide entre «meses equivalentes» (los meses parciales cuentan por días). PDF reporte-presupuesto.pdf.
- Reportes › Gastos y Presupuesto muestran el apartado «Pagos mensuales · gestión 20XX» con barras de progreso.
- General › Avisos: usa el presupuesto asignado del mes y los pagos mensuales atrasados.
- Base de datos: migración 003 (tablas plan_presupuesto y pagos_anuales; traslada lo que tenías en presupuestos y recurrentes, que no se borran). Respaldo JSON incluye plan y pagos.
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
