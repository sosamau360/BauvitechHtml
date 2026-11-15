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

La tarjeta de Kineos360 enlaza al sitio oficial https://www.kineos360.uy/ y conserva el enlace de consulta. Kineos360 usa su logo original publicado en https://www.kineos360.uy/assets/img/logo.png (origen: assets/img/logo.png del repositorio AsistanceControl). Se mantiene texto de respaldo si no carga. Pendiente comprobar HTTP y apariencia en navegador, y guardar una copia local del PNG cuando esté disponible para eliminar la dependencia externa. Logos/capturas reales de BauVi.Notify y SaliYa pendientes; se usan portadas de texto, sin imágenes falsas. Confirmar rutas públicas, madurez y funciones de BauVi.Notify y SaliYa antes de publicar. Verificar permisos de uso de imágenes y ausencia de datos personales en capturas.

## Validación

Ejecutar `node --test tests/*.test.cjs` (Node 20+). Pruebas estáticas de estructura, traducciones, sintaxis y enlaces; no sustituyen pruebas de navegador. Validar Chrome/Edge/Firefox/Safari, anchos 320/375/768/850/1024, menú, tema y ES/EN entre páginas, teclado, formulario válido/inválido y WhatsApp con datos ficticios sin enviar mensaje. Revisar imágenes, manifiesto y enlace externo. No hay migraciones, persistencia de datos de clientes ni CI configurado. No publicar ni fusionar sin autorización.

### Regresión BVT-07

Las pruebas de comportamiento simulan DOM y almacenamiento local; comprueban tema, idioma, menú, validación, foco, selección opcional de presupuesto y composición de WhatsApp. No abren navegador ni envían mensajes. Las etiquetas del formulario están asociadas a los campos, los errores se anuncian con aria-invalid y los botones de presupuesto funcionan con teclado. El menú móvil del portfolio lleva a la misma página de contacto que escritorio.

### OmniDate — actualización de portfolio

Revisión de AgendaPro: main ce1e89f1452ee8f0cc04ab2482d519f33e77e21e, release/omnidate-rel02-integration-20261031 063c220bb969f164fde6851b2a48ea2a05c38975 y feature/omnidate-seo02-html-indexable-20261107 977bdcac2e6003e1c754cfbd885f065c89faf4bc. La landing, configuración WhatsApp, catálogo de servicios y manifiesto sustentan la descripción. SportCatalog y páginas deportivas confirman fútbol, pádel y tenis en las ramas de integración; disponibilidad comercial pendiente de verificación, indicada en la tarjeta. No se afirma despliegue de la rama SEO/deportiva. El icono oficial procede de AgendaPro.Web/wwwroot/favicon.svg en 977bdcac2e6003e1c754cfbd885f065c89faf4bc; se copia localmente a img/omnidate-logo.svg, con eliminación exclusiva de la declaración DOCTYPE externa. Se conservan los trazados y colores originales. Se sustituye la referencia a omnidate.jfif (ya no necesaria en la rama). Enlace canónico https://omnidate.com.uy/ y consulta interna, ambos bilingües. Validar apariencia y acceso público en navegador.

### Kineos360 — identidad y descripción comercial

Fuente: AsistanceControl main ade96db51c85f639fb6dbeafc3f5de73772160d6 (versión 2026.11.15.2). La landing pública documenta funciones, aplicación PWA por club, permisos e informes. El encabezado de landing usa logo.png sobre fondo oscuro; views/auth/login.php usa logoB.png sobre una tarjeta blanca. BauViTech selecciona los recursos oficiales https://www.kineos360.uy/assets/img/logo.png y https://www.kineos360.uy/assets/img/logoB.png mediante su controlador de tema existente; fallback textual durante carga/error. No se agregan archivos binarios porque el conector no permite descargarlos. logoB.png pesa 4.76 MB en el repositorio original: recomendable obtener y optimizar copias locales de ambos PNG antes de publicar. Pendiente comprobar HTTP, contraste y cambio de tema en navegador. No se cambian módulos de Kineos360.

### ParkSoft / Multiparking — actualización de portfolio

Fuente: repositorio Multiparking, main 73d75caeb5a4ee6aa0de3670424536fbc999cbb5. ParkSoft.csproj identifica la marca y .NET MAUI 8/SQLite. Views/MainPage.xaml, ViewModels/MainViewModel.cs, Services/TicketService.cs y Services/ParkingFeeCalculator.cs respaldan matrícula, cobros, impresión/escaneo/reimpresión y reglas tarifarias. ViewModels/InformesViewModel.cs confirma informes por usuario/fecha y exportación Excel. El ícono oficial configurado en MauiIcon (Resources/AppIcon/appicon.svg) se copia a img/parksoft-logo.svg sin DOCTYPE externo; se conservan sus trazados y colores. Se elimina la referencia a img/logoParkSoft.png. Se reutilizan los estilos y el fallback de logos ya existentes, ES/EN y enlace de contacto para solicitar demostración; no se inventa sitio público ni disponibilidad por plataforma. Pendiente verificar apariencia y formulario en navegador. No se cambia Multiparking.
