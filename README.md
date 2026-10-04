# SAE.cloud — Gestión Escolar Integral

Prototipo estático (HTML + Tailwind CDN + JS vanilla) reorganizado a partir del export de Stitch `stitch_educontrol_sae_pro`.

## Estructura
```
index.html              Login (pantalla principal)
pages/                  17 pantallas (dashboard, alumnos, finanzas, bitácora, etc.)
assets/css/app.css      Estilos compartidos y reglas responsive
assets/js/tailwind-config.js   Tokens de diseño (colores, tipografía, espaciado)
assets/js/app.js        Shell (menú lateral, cabecera), modales, avisos y acciones
assets/img/             Logo y favicon locales
```

## Cómo funciona
- **Sesión demo:** el login acepta cualquier usuario/contraseña y guarda la sesión en `sessionStorage`; las páginas internas redirigen al login si no hay sesión.
- **Navegación:** el menú lateral y la cabecera se generan una sola vez desde `NAV` en `assets/js/app.js`. Para añadir o mover una pantalla, edita ese arreglo.
- **Modales:** `SAE.openModal({title, fields, onConfirm})` y `SAE.toast(msg)`. Los botones de cada pantalla abren su modal según las reglas `RULES` (nuevo alumno, pago, evento, comunicado, exportar, filtros, etc.). Todo es demostrativo: no se guarda nada.
- **Responsive:** en pantallas < 1024 px el menú pasa a panel lateral con botón de hamburguesa; las tablas hacen scroll horizontal.

## Ejecutar / desplegar
Es un sitio estático: `python3 -m http.server` en esta carpeta, o importar la carpeta en Vercel sin configuración.

## Pendientes conocidos
- Tailwind se carga por CDN (`cdn.tailwindcss.com`); para producción conviene compilarlo.
- Entradas del menú sin pantalla propia apuntan a la más cercana (Materias → Docentes, Tutores → Alumnos, Ciclos Escolares → Configuración, las 4 de Finanzas → Finanzas, Mensajería → Comunicación).
- Los datos de tablas y tarjetas son estáticos.
