# Mapas del frontend

El dashboard utiliza React Leaflet con las teselas estándar de OpenStreetMap:

```text
https://tile.openstreetmap.org/{z}/{x}/{y}.png
```

Esta integración no solicita API key, token ni cuenta de mapas. Los marcadores se dibujan con CSS local; no dependen de imágenes externas. Se muestra la atribución de OpenStreetMap y el navegador envía el origen de la página mediante `Referer`.

`VITE_API_URL` es únicamente la URL del backend CAI. No hay que añadir una clave de mapas en Vercel ni Render.

Para publicar el cambio, subir el frontend al repositorio conectado a Vercel y volver a desplegar. La versión publicada anterior no cambia por modificar los archivos locales.

Los puntos del mapa siguen siendo ubicaciones de ejemplo que ya contenía el dashboard; no son coordenadas consultadas desde la base de datos.

El servicio público permite visualización interactiva normal y tiene capacidad limitada; no se usa precarga masiva ni descarga offline. Referencia: [política oficial de teselas](https://operations.osmfoundation.org/policies/tiles/).
