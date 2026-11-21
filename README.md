# Ar_Finance 0.18.2
App estática (HTML/CSS/JS) con Supabase. Despliegue: ver guía de la sección 5 del documento del proyecto.
- Pruebas: `node test/test.js`, `node test/voz.test.js`, `node test/sw.test.js` y `for f in js/*.js; do node --check $f; done`
- Configura `js/config.js` con la URL y clave **anon** de Supabase (nunca service_role).
- Ejecuta `supabase/schema.sql` en el SQL Editor de Supabase.
- `test/seed.js` es solo para pruebas; no lo subas como parte de la app.
- Repo público: no subas respaldos JSON ni datos personales.

## Agregar otra persona (usuario)
Cada persona ve solo sus propios registros (RLS). Se crea desde Supabase: Authentication → Users → Add user → Create new user; escribe correo y contraseña, marca «Auto Confirm User» y pulsa Create user. Luego esa persona entra en la app con ese correo. Cada una puede cambiar su contraseña en Configuración.

## Actualizar en GitHub
1. Descomprime el paquete de actualización.
2. En el repositorio: Add file → Upload files, y arrastra TODO el contenido (archivos y carpetas) de una vez. Las rutas iguales se reemplazan.
3. Un solo Commit. Nunca subas js/config.js ni la carpeta test.

## Funciona sin internet (0.14.0)
La primera vez abre la app CON internet y espera unos segundos (se guarda sola). Después abre sin conexión y funciona; los registros hechos sin internet se sincronizan al reconectar. Para instalarla en el móvil: Chrome › menú ⋮ › «Instalar aplicación» (o «Añadir a pantalla de inicio»). En cada versión nueva sube también el número `V` de `sw.js`.

## Migraciones de base de datos
Ejecuta en Supabase (SQL Editor → New query), una sola vez y en orden, el contenido de: `supabase/migrations/001_presupuestos_recurrentes.sql` `supabase/migrations/002_metas_ahorro.sql` y `supabase/migrations/003_pagos_presupuesto.sql` (0.12.0: presupuesto asignado y pagos mensuales). Antes haz un Respaldo JSON (Configuración). Solo agregan tablas nuevas.

## Perfil y tema (0.15.0)
Icono redondo arriba a la derecha: tema, alias, imagen, categorías propias, respaldo, contraseña, versión y cerrar sesión. Alias, imagen y tema se guardan en el dispositivo (localStorage), no en Supabase.

## Imagen de perfil (0.16.0)
Al elegir una imagen se abre un recuadro para encuadrarla: arrastra, usa el zoom (barra, − / + o rueda del mouse) y «Centrar»; luego «Aplicar».

## Actualizar con un solo archivo (0.17.0)
1. Descarga `actualizacion.zip` (NO lo descomprimas).
2. En tu repositorio de GitHub: Add file → Upload files, arrastra el ZIP y pulsa Commit changes.
3. Pestaña Actions: aparece «Aplicar actualización»; en 1 o 2 minutos queda en verde. Luego GitHub Pages publica (otro minuto o dos).
4. Abre Ar_Finance instalada: abajo a la izquierda aparece «Nueva versión» → Descargar actualización → Instalar y reiniciar.
- Si el paso 3 falla con un error de permisos: Settings → Actions → General → Workflow permissions → «Read and write permissions» → Save, y sube el ZIP otra vez.
- Los cambios dentro de `.github/workflows/` (como este mismo workflow) se siguen subiendo a mano.
- Primera vez con 0.17.0: sube los archivos del paquete normalmente (arrastrando carpetas). Después, cierra Ar_Finance por completo y ábrela dos veces.

## Grabar registro por voz (0.18.0)
En General › «Grabar registro». Pensado para Android + Chrome (o la app instalada). La primera vez Chrome pide permiso de micrófono: pulsa «Permitir». Si el botón no escucha, toca el micrófono de tu teclado dentro del cuadro de texto. Lo que corriges se guarda en el teléfono (no se comparte entre teléfonos).

## Si el dictado no funciona en un teléfono (0.18.1)
Perfil › «Buscar actualizaciones» para tener la última versión. En la ventana de grabar, la app indica la causa del problema del micrófono. Casos típicos en Samsung: Chrome › ⋮ › Configuración › Configuración de sitios › Micrófono (permitir esta página); Ajustes › Aplicaciones › Chrome › Permisos › Micrófono; que la app «Google» esté activada; y probar con «Idioma del dictado» en Latinoamérica.
