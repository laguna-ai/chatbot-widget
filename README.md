# Chatbot Widget

Este repositorio contiene un **widget de chatbot** diseñado para ser fácilmente integrado en cualquier sitio web.

📦 **Demo en vivo**  
- [Plataforma de visualizacón del widget](https://laguna-ai.github.io/chatbot-widget/Streaming/)  
- [Sólo widget embebido](https://laguna-ai.github.io/chatbot-widget/learnia-prod/)

---

## ✨ Generación del CSS Estático con Tailwind

Para generar el archivo `.css` a partir de Tailwind, sigue los pasos descritos en la documentación oficial de Tailwind CLI:

🔗 [Guía de instalación de Tailwind CLI](https://tailwindcss.com/docs/installation/tailwind-cli)

### ✅ Consideraciones adicionales

- Si necesitas incluir **paletas personalizadas** (colores primarios y secundarios), asegúrate de crear un archivo `tailwind.config.js`. Puedes usar como referencia la estructura del archivo en la carpeta `learnia-dev`.

- Para que el archivo de configuración sea tomado en cuenta durante la compilación del CSS, añade la siguiente línea justo después de la importación principal en tu archivo `styles.css`:

```css
@import "tailwindcss";
@config "./tailwind.config.js";
```
- Para minificación del .css estático, el cual es mejor para producción, se puede correr
```bash
npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --minify
```
en la terminal, en vez del que dice en la documentación (el cual no tiene la bandera de minify).

## Minificación de JavaScript y HTML

Para optimizar el rendimiento en producción, se recomienda minificar los archivos `.js` y `.html`. A continuación se describen los pasos para realizarlo con herramientas CLI basadas en Node.js.

---

### 🔧 Minificar JavaScript con `terser`

1. Instalar `terser` de forma global (una sola vez):
   ```bash
   npm install -g terser
   ```

2. Minificar un archivo JavaScript:
   ```bash
   terser archivo.js -o archivo.min.js -c -m
   ```

   - `-c`: Comprime el código eliminando espacios, comentarios, etc.
   - `-m`: Renombra variables locales para reducir aún más el tamaño.

---

### 🔧 Minificar HTML con `html-minifier-terser`

1. Instalar `html-minifier-terser`:
   ```bash
   npm install html-minifier-terser
   ```

2. Minificar un archivo HTML:
   ```bash
   npx html-minifier-terser archivo.html -o archivo.min.html \
     --collapse-whitespace \
     --remove-comments \
     --minify-css true \
     --minify-js true
   ```

   - `--collapse-whitespace`: Elimina espacios y líneas innecesarias.
   - `--remove-comments`: Borra los comentarios HTML.
   - `--minify-css true`: Minifica el CSS embebido.
   - `--minify-js true`: Minifica el JS embebido.

---

> ✅ Ambos comandos generan archivos `.min.js` y `.min.html` listos para usarse en producción.

