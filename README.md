# BauViTech — sitio comercial

Sitio estático HTML/CSS/JavaScript. Base: descarga del sitio del 15/11/2026 (commit dd310a1dcf89bf59c1867cd1adc7f2778cae44aa). No hay backend, compilación ni dependencias instalables del sitio. Google Fonts y Tailwind CDN se conservan; los iconos técnicos del portfolio provienen de Wikimedia.

## Ejecución local

Servir la raíz con un servidor HTTP estático (por ejemplo Live Server de VS Code o `python -m http.server 8000`). Abrir index.html, portfolio.html y contacto.html. No publicar hasta recuperar y validar los recursos pendientes.

## Sprint 1A

- BVT-00: base de seis archivos en main; imágenes y manifiesto pendientes.
- BVT-01: CSS de página separado, comportamiento compartido en js/shared.js y diccionarios por página; ES/EN y tema persistidos. Sin migración de framework.
- BVT-04: cuatro productos principales (Kineos360, OmniDate, ParkSoft/MultiParking, BauVi.Notify), SaliYa en desarrollo, tres casos (licenciamiento/QR, Laserwork, Mazur). Aplicaciones de salud retiradas solo del sitio comercial. Métricas de impacto no verificadas retiradas de las tarjetas; no se prometen funciones ni disponibilidad no confirmadas.
- BVT-07: enlaces de contacto con mailto en lugar de dependencia Cloudflare, WhatsApp conserva el envío iniciado por el usuario; navegación responsive y accesibilidad básica.

## Recursos pendientes

- img/yo.jpeg
- img/logoLicencias.png
- img/logoParkSoft.png
- img/omnidate.jfif
- img/laserwork.png
- img/mazur.png
- img/og-image.png
- img/favicon.ico
- img/favicon-16.png
- img/favicon-32.png
- img/favicon-180.png
- img/favicon-192.png
- img/favicon-512.png
- site.webmanifest

Logos/capturas reales de Kineos360, BauVi.Notify y SaliYa pendientes; se usan portadas de texto, sin imágenes falsas. Confirmar rutas públicas, madurez y funciones de BauVi.Notify y SaliYa antes de publicar. Verificar permisos de uso de imágenes y ausencia de datos personales en capturas.

## Validación

Ejecutar `node --test tests/site.test.cjs` (Node 20+). Pruebas estáticas de estructura, traducciones, sintaxis y enlaces; no sustituyen pruebas de navegador. Validar Chrome/Edge/Firefox/Safari, anchos 320/375/768/850/1024, menú, tema y ES/EN entre páginas, teclado, formulario válido/inválido y WhatsApp con datos ficticios sin enviar mensaje. Revisar imágenes, manifiesto y enlace externo. No hay migraciones, persistencia de datos de clientes ni CI configurado. No publicar ni fusionar sin autorización.
