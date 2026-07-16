# Directorio de Fuentes: Magistral

Este directorio está configurado para alojar los archivos físicos de la tipografía comercial **Magistral**.

## ¿Qué archivos colocar aquí?
Para que las reglas `@font-face` configuradas en `src/styles.css` carguen automáticamente la fuente en el navegador, coloca en esta carpeta los archivos en formato `.woff2`, `.woff` o `.ttf` con los siguientes nombres exactos (o ajusta los nombres en `styles.css` según corresponda):

- `Magistral-Light.woff2` (o `.ttf`) -> para peso `300` (Light)
- `Magistral-Regular.woff2` (o `.ttf`) -> para peso `400` (Regular)
- `Magistral-Medium.woff2` (o `.ttf`) -> para peso `500` (Medium)
- `Magistral-Bold.woff2` (o `.ttf`) -> para peso `700` (Bold)

> **Nota:** Si mientras tanto no se han colocado los archivos de Magistral, el sistema utiliza el fallback configurado en `styles.css` (`Inter Tight`, `-apple-system`, `sans-serif`) sin generar errores bloqueantes.
