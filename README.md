# vCard QR Generator

Genera un código QR a partir de los datos de contacto. Al escanearlo, el móvil ofrece añadir el contacto directamente al directorio.

No requiere servidor, base de datos ni conexión a internet tras la carga inicial. Todo ocurre en el navegador.

## Uso

Abre `index.html` en cualquier navegador. Rellena los campos y pulsa "Generar QR".

## Archivos

- `index.html` — estructura y markup
- `styles.css` — estilos
- `app.js` — lógica: construcción del vCard, generación del QR, descarga PNG y VCF

## Dependencias externas

- [Tailwind CSS](https://tailwindcss.com) — via CDN
- [QRCode.js](https://github.com/davidshimjs/qrcodejs) — via CDN
- [DM Sans + DM Serif Display](https://fonts.google.com) — via Google Fonts

## Formato

Genera vCard 3.0. Compatible con iOS, Android y la mayoría de clientes de contactos.

## Descarga

- **PNG** — imagen del QR lista para imprimir o compartir
- **VCF** — archivo de contacto estándar para importar directamente
