# Changelog
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
