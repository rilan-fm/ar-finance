# Ar_Finance 0.8.0
App estática (HTML/CSS/JS) con Supabase. Despliegue: ver guía de la sección 5 del documento del proyecto.
- Pruebas: `node test/test.js` y `for f in js/*.js; do node --check $f; done`
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

## Migraciones de base de datos
Ejecuta en Supabase (SQL Editor → New query), una sola vez y en orden, el contenido de: `supabase/migrations/001_presupuestos_recurrentes.sql` y `supabase/migrations/002_metas_ahorro.sql`. Antes haz un Respaldo JSON (Configuración). Solo agregan tablas nuevas.
