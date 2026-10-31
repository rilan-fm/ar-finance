# Ar_Finance 0.4.2
App estática (HTML/CSS/JS) con Supabase. Despliegue: ver guía de la sección 5 del documento del proyecto.
- Pruebas: `node test/test.js` y `for f in js/*.js; do node --check $f; done`
- Configura `js/config.js` con la URL y clave **anon** de Supabase (nunca service_role).
- Ejecuta `supabase/schema.sql` en el SQL Editor de Supabase.
- `test/seed.js` es solo para pruebas; no lo subas como parte de la app.
- Repo público: no subas respaldos JSON ni datos personales.
