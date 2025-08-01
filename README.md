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

