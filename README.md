# BauViTech — sitio comercial

Sitio estático HTML/CSS/JavaScript. Base: descarga del sitio del 15/11/2026 (commit dd310a1dcf89bf59c1867cd1adc7f2778cae44aa). No hay backend, compilación ni dependencias instalables del sitio. Google Fonts se conserva; Tailwind CDN se retira del portfolio al no usar utilidades Tailwind; los iconos técnicos del portfolio provienen de Wikimedia.

## Ejecución local

Servir la raíz con un servidor HTTP estático (por ejemplo Live Server de VS Code o `python -m http.server 8000`). Abrir index.html, portfolio.html y contacto.html. No publicar hasta recuperar y validar los recursos pendientes.

## Sprint 1A

- BVT-00: base de seis archivos en main; imágenes y manifiesto pendientes.
- BVT-01: CSS de página separado, comportamiento compartido en js/shared.js y diccionarios por página; ES/EN y tema persistidos. Sin migración de framework.
- BVT-04: cuatro productos principales (Kineos360, OmniDate, ParkSoft/MultiParking, BauVi.Notify), SaliYa en desarrollo, tres casos (licenciamiento/QR, Laserwork, Mazur). Aplicaciones de salud retiradas solo del sitio comercial. Métricas de impacto no verificadas retiradas de las tarjetas; no se prometen funciones ni disponibilidad no confirmadas.
- BVT-07: enlaces de contacto con mailto en lugar de dependencia Cloudflare, WhatsApp conserva el envío iniciado por el usuario; navegación responsive y accesibilidad básica.

## Recursos pendientes

- img/yo.jpeg
- img/logoParkSoft.png
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

La tarjeta de Kineos360 enlaza al sitio oficial https://www.kineos360.uy/ y conserva el enlace de consulta. Kineos360 usa su logo original publicado en https://www.kineos360.uy/assets/img/logo.png (origen: assets/img/logo.png del repositorio AsistanceControl). Se mantiene texto de respaldo si no carga. El cambio claro/oscuro fue aprobado visualmente; sigue pendiente guardar una copia local optimizada de los PNG para eliminar la dependencia externa. BauVi.Notify utiliza su banner aprobado local; SaliYa utiliza su logotipo provisional original. Confirmar rutas públicas, madurez y funciones de BauVi.Notify y SaliYa antes de publicar. Verificar permisos de uso de imágenes y ausencia de datos personales en capturas.

## Validación

Ejecutar `node --test tests/*.test.cjs` (Node 20+). Pruebas estáticas de estructura, traducciones, sintaxis y enlaces; no sustituyen pruebas de navegador. Validar Chrome/Edge/Firefox/Safari, anchos 320/375/768/850/1024, menú, tema y ES/EN entre páginas, teclado, formulario válido/inválido y WhatsApp con datos ficticios sin enviar mensaje. Revisar imágenes, manifiesto y enlace externo. No hay migraciones, persistencia de datos de clientes ni CI configurado. No publicar ni fusionar sin autorización.

### Regresión BVT-07

Las pruebas de comportamiento simulan DOM y almacenamiento local; comprueban tema, idioma, menú, validación, foco, selección opcional de presupuesto y composición de WhatsApp. No abren navegador ni envían mensajes. Las etiquetas del formulario están asociadas a los campos, los errores se anuncian con aria-invalid y los botones de presupuesto funcionan con teclado. El menú móvil del portfolio lleva a la misma página de contacto que escritorio.

### OmniDate — actualización de portfolio

Revisión de AgendaPro: main ce1e89f1452ee8f0cc04ab2482d519f33e77e21e, release/omnidate-rel02-integration-20261031 063c220bb969f164fde6851b2a48ea2a05c38975 y feature/omnidate-seo02-html-indexable-20261107 977bdcac2e6003e1c754cfbd885f065c89faf4bc. La landing, configuración WhatsApp, catálogo de servicios y manifiesto sustentan la descripción. SportCatalog y páginas deportivas confirman fútbol, pádel y tenis en las ramas de integración; disponibilidad comercial pendiente de verificación, indicada en la tarjeta. No se afirma despliegue de la rama SEO/deportiva. El icono oficial procede de AgendaPro.Web/wwwroot/favicon.svg en 977bdcac2e6003e1c754cfbd885f065c89faf4bc; se copia localmente a img/omnidate-logo.svg, con eliminación exclusiva de la declaración DOCTYPE externa. Se conservan los trazados y colores originales. Se sustituye la referencia a omnidate.jfif (ya no necesaria en la rama). Enlace canónico https://omnidate.com.uy/ y consulta interna, ambos bilingües. Validar apariencia y acceso público en navegador.

### Kineos360 — identidad y descripción comercial

Fuente: AsistanceControl main ade96db51c85f639fb6dbeafc3f5de73772160d6 (versión 2026.11.15.2). La landing pública documenta funciones, aplicación PWA por club, permisos e informes. El encabezado de landing usa logo.png sobre fondo oscuro; views/auth/login.php usa logoB.png sobre una tarjeta blanca. BauViTech selecciona los recursos oficiales https://www.kineos360.uy/assets/img/logo.png y https://www.kineos360.uy/assets/img/logoB.png mediante su controlador de tema existente; fallback textual durante carga/error. No se agregan archivos binarios porque el conector no permite descargarlos. logoB.png pesa 4.76 MB en el repositorio original: recomendable obtener y optimizar copias locales de ambos PNG antes de publicar. Pendiente comprobar HTTP, contraste y cambio de tema en navegador. No se cambian módulos de Kineos360.

### ParkSoft / Multiparking — actualización de portfolio

Fuente: repositorio Multiparking, main 73d75caeb5a4ee6aa0de3670424536fbc999cbb5. ParkSoft.csproj identifica la marca y .NET MAUI 8/SQLite. Views/MainPage.xaml, ViewModels/MainViewModel.cs, Services/TicketService.cs y Services/ParkingFeeCalculator.cs respaldan matrícula, cobros, impresión/escaneo/reimpresión y reglas tarifarias. ViewModels/InformesViewModel.cs confirma informes por usuario/fecha y exportación Excel. Por solicitud del Product Owner se conserva la imagen original del portfolio, img/logoParkSoft.png, con el contenedor, fondo degradado y estilos de imagen exactos de la tarjeta previa al rediseño (commit c594d5039062d6be4b66d2341507d90a1054d3ba): width/height 100% y object-fit: cover. El PNG no estaba incluido en la descarga de seis archivos ni en GitHub; pendiente recuperar el archivo original antes de publicar. La imagen requiere el PNG original en su ruta; no se aplica el controlador de logos a esta tarjeta. El SVG incorporado en el commit anterior se retira al quedar sin uso. Se reutilizan los estilos y el fallback de logos ya existentes, ES/EN y enlace de contacto para solicitar demostración; no se inventa sitio público ni disponibilidad por plataforma. Pendiente verificar apariencia y formulario en navegador. No se cambia Multiparking.

### BauVi.Notify — actualización de portfolio

Fuentes: BauVi.Notify main 314eacaac5942f2005dbabe5c9d87798ad8309d1 y phase-3-traffic-routing-foundation 85bdb3204878f8b945f23784326b7c3ea72dbb73. README, NotificationService, Dashboard y proyecto Infrastructure respaldan integración WhatsApp, API, instancias autorizadas, límites, registros y estadísticas, .NET 8/MySQL. La documentación Sprint 4 y Sprint 11 y Fase 3 identifica cola persistente, prioridades, TTL, retries y webhooks en ramas de evolución; no se afirma despliegue ni disponibilidad comercial, ni routing híbrido habilitado. El servicio rechaza canales distintos de WhatsApp; SMS/email se excluyen de las funcionalidades actuales. Se utiliza el banner comercial aprobado por el Product Owner, generado para BauVi.Notify y guardado en img/bauvi-notify-banner.webp (960 × 573, 33.5 kB). Se recortó únicamente el margen blanco inferior del PNG original, y se optimizó a WebP. El fondo claro y object-fit: contain conservan la imagen completa en ambos temas. No se identificó sitio público verificable. CTA a contacto para consultar integración, ES/EN y estilos compartidos. No se modifica BauVi.Notify ni CommercialPlatform.

### SaliYa — actualización de portfolio

Fuentes: SaliYa main de7fc1eab70e37725e9c704b31eca7872b708594 (base sin módulos) y feature/sprint15-branch-menus 87478afb0ec3a48aee1080574e0b894b0241a407. docs/domain/domain-overview.md, Home.razor y páginas de promociones, sucursales, reservas y menú sustentan el enfoque de marketplace gastronómico; pagos incluyen simulación de desarrollo, no se anuncia cobro real ni fecha de lanzamiento. El README de la rama conserva descripción histórica de Sprint 2; se revisaron archivos de implementación actuales. La tarjeta permanece en #en-desarrollo y el CTA consulta disponibilidad. Se copia el wordmark provisional design/assets/logo-saliya-provisional.svg sin alteraciones a img/saliya-logo.svg, no se afirma identidad definitiva (O-016 pendiente). ES/EN, estilos y fallback reutilizados; contraste de etiqueta de desarrollo ajustado con variables existentes. No se modifica SaliYa ni se anuncian descuentos específicos.

## Sprint 1B — BVT-02 y BVT-03

Rama feature/bauvitech-sprint-1b creada desde feature/bauvitech-sprint-1a en 603b22cadd708edb049a67ca33a26e9234a22b0f. Hero comercial con CTA a #productos y contacto, seguido del catálogo de cuatro productos principales y SaliYa en desarrollo, servicios existentes, sección de problema/solución, casos, perfil, proceso y contacto. Se retiran cifras de clientes/proyectos no verificadas del hero y ejemplos genéricos reemplazados por acceso a casos existentes. Los anclajes previos se conservan. Cada resumen de producto enlaza a su detalle en portfolio (nuevos IDs en los títulos), y a los sitios oficiales ya aprobados o al contacto. Se reutilizan las mismas rutas, markup de imagen, logos por tema y JS compartido; ParkSoft mantiene la configuración original, Notify el WebP aprobado y SaliYa el SVG provisional. No se afirma disponibilidad del módulo deportivo OmniDate, canales no implementados de Notify ni lanzamiento SaliYa. No se agrega dependencia ni se cambia el framework. ES/EN con diccionario local; CSS de landing adaptado a 2 columnas y 1 columna móvil. La revisión de recursos pendientes y publicación quedan fuera de BVT-02/03; BVT-05/06 se documentan a continuación. Validar manualmente home y portfolio, 320/375/768/1024, ambos temas e idiomas, enlaces profundos, botones, imágenes y navegación con teclado. No publicar ni fusionar hasta autorización.

## Sprint 1B — BVT-05 y BVT-06

BVT-02/03: las ocho pruebas visuales fueron aprobadas por el Product Owner. BVT-05: landmark main y enlace de salto, nombres accesibles y estado aria-pressed de tema/idioma, etiquetas traducidas, foco visible y manejo del menú al pasar a escritorio (1024 px), controles táctiles, menú desplazable, reglas estrechas y contraste de textos y formulario. Se consolida WhatsApp flotante en CSS, sin eventos inline; el flujo de consulta no cambia. Se retira Tailwind CDN del portfolio tras comprobar que no hay utilidades Tailwind en el HTML; los estilos existentes siguen siendo la fuente de diseño. Preconexión a Google Fonts, carga diferida de imágenes secundarias visibles (no de logos ocultos con fallback), y sin dependencias nuevas. Se conserva exactamente el markup de imagen ParkSoft. Los logos remotos Kineos siguen pendientes de copia local optimizada.

BVT-06: título y descripción únicos, canonical y Open Graph/Twitter coherentes, JSON-LD Organization/WebSite/WebPage con datos comprobados, sitemap.xml y robots.txt de tres páginas públicas. Se usa https://www.bauvitech.com/ como origen canónico según los metadatos históricos; confirmar redirecciones https y www/no-www en alojamiento. HTML inicial español indexable; el selector EN traduce contenido, accesibilidad y título de pestaña sin crear URL independientes; no hreflang ni duplicados ficticios. No se publica precio, valoración, fecha de lanzamiento ni datos estructurados de ofertas sin evidencia. Se conserva la URL social histórica img/og-image.png; el archivo real y sus dimensiones/HTTP no están verificados y son requisito de publicación. No hay promesa de indexación ni ranking. Antes de producción recuperar recursos originales listados, comprobar HTTP 200 de las tres páginas, sitemap, robots, imagen social y favicon; comprobar canonical y redirecciones, compartir enlaces en WhatsApp, inspeccionar páginas y enviar sitemap en Google Search Console. Probar 320/375/768/850/1024/1440, ambos idiomas y temas, teclado (Tab/Shift+Tab/Escape), formulario, menú en orientación horizontal y zoom 200%, contraste y performance Lighthouse. No ejecutar cambios de hosting, producción ni merge sin autorización.

El HTML inicial de las tres páginas declara tema oscuro de forma consistente para evitar texto oscuro sobre fondo oscuro del portfolio mientras carga JavaScript. El controlador compartido restaura la preferencia guardada al iniciar.

## IIS / SmarterASP.NET — corrección 403.14

El sitio estático necesita un documento predeterminado al solicitar la raíz. web.config habilita defaultDocument y registra index.html mediante remove/add para evitar duplicar una entrada heredada; no elimina otros documentos predeterminados ni modifica directoryBrowse, reglas de redirección, autenticación, MIME o configuración de aplicaciones. No se cambian HTML, CSS ni JavaScript. El archivo debe estar junto a index.html en la raíz física del sitio (el error reporta c:\hosting\public), no en js ni img. Si ya existe web.config en el hosting, descargar una copia de respaldo y fusionar únicamente defaultDocument dentro del system.webServer existente, conservando sus demás secciones. No duplicar elementos configuration, system.webServer o defaultDocument. Si la sección está bloqueada (500.19 / 0x80070021), revertir el archivo y configurar Default Document en el panel o solicitar soporte. Si hay otro documento predeterminado existente que tiene prioridad, revisar el orden efectivo con el hosting. Mantener Directory Browsing deshabilitado. Tras subida autorizada, verificar /index.html y / en el mismo hostname, HTTP 200 o redirección válida a HTTPS que termina en 200, luego portfolio.html, contacto.html, robots.txt y sitemap.xml. Comparar también las variantes www y sin www y HTTP/HTTPS; si persiste 403.14, comprobar la raíz física y configuración efectiva de cada binding. No se implementan redirecciones en este cambio. Reversión: restaurar el web.config anterior o retirar el nuevo si no existía. No se realiza publicación desde el repositorio.

## Commercial v2 — BVT-09 / BVT-10
Rama feature/bauvitech-commercial-v2 desde ef71754. Portada centrada en contratación .NET y software a medida, tres recorridos, Kineos360 y OmniDate destacados. ParkSoft, BauVi.Notify y SaliYa conservan tarjetas, arte, enlaces y estado aprobados en portfolio. Anclas históricas conservadas. Perfil profesional en desarrollador.html (es) y developer.html (en), HTML estático, canonical individual y hreflang recíproco, contacto por email/WhatsApp y enlaces a proyectos. El selector del perfil navega entre URL reales y el idioma de cada URL prevalece sobre localStorage; enlaces al perfil siguen ES/EN. Reutiliza shared.css, index.css, shared.js, foto original, tarjetas y logos. Sin dependencias, tarifas, disponibilidad garantizada ni métricas nuevas. Formulario no modificado (BVT-11). Sitemap de cinco páginas. Canonical www existente se conserva hasta resolver BVT-08 (403.14, bindings, web.config efectivo, manifiesto y recursos sociales). No se modifica IIS ni producción. Validar con node --test tests/*.test.cjs y Live Server, 320/375/768/1024/1440, temas, idiomas, links, correo/WhatsApp, teclado e imágenes. No publicar hasta resolver bloqueo y aprobar pruebas visuales.

En navegación principal y móvil de las tres páginas existentes, Perfil profesional sustituye el enlace Sobre mí para mantener el número de opciones y evitar aumentar el ancho del menú. Las secciones anteriores y sus anclas siguen disponibles.
