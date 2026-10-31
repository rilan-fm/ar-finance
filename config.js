// Pública por diseño: la protección real son las políticas RLS.
// Pega aquí la Project URL y la clave PUBLISHABLE (sb_publishable_...) o la anon antigua.
// NUNCA pongas la clave secret ni service_role.
window.MF_CONFIG = {
  url: 'TU-URL-DE-SUPABASE',
  anonKey: 'TU-CLAVE-PUBLISHABLE',
  allowSignup: false   // false = oculta «Crear cuenta» (el usuario se crea desde el panel de Supabase)
};
