# 🌟 Portafolio Web Profesional

Una página web moderna y completamente responsive para mostrar tu curriculum, proyectos de GitHub y habilidades profesionales.

## ✨ Características

### 🎨 Diseño Moderno
- **Responsive Design**: Perfecto en móviles, tablets y desktop
- **Tema Oscuro/Claro**: Cambio automático con preferencias del usuario
- **Animaciones Fluidas**: Transiciones suaves y efectos visuales
- **Tipografía Profesional**: Fuente Inter para máxima legibilidad

### 🚀 Funcionalidades
- **Navegación Inteligente**: Scroll suave y actualización automática del menú activo
- **Integración GitHub**: Carga automática de tus repositorios más recientes
- **Formulario de Contacto**: Sistema de contacto funcional con validación
- **Filtros de Proyectos**: Organiza tus proyectos por categorías
- **Estadísticas Animadas**: Contadores dinámicos para impresionar
- **Barras de Habilidades**: Visualización interactiva de tu nivel técnico

### 🔧 Tecnologías Utilizadas
- **HTML5**: Estructura semántica y accesible
- **CSS3**: Flexbox, Grid, Custom Properties, Animaciones
- **JavaScript ES6+**: Funcionalidad moderna sin dependencias
- **GitHub API**: Integración automática con tus repositorios
- **Font Awesome**: Iconografía profesional
- **Google Fonts**: Tipografía optimizada

## 🛠️ Instalación y Uso

### 1. Descarga los archivos
```bash
# Clona o descarga los archivos del proyecto
git clone [URL_DEL_REPOSITORIO]
cd web-page
```

### 2. Personalización Básica

#### Información Personal
Edita el archivo `index.html` y actualiza:

```html
<!-- Línea 41: Título de la página -->
<title>Tu Nombre - Desarrollador Full Stack</title>

<!-- Líneas 67-69: Tu información -->
<span class="name-highlight">Tu Nombre</span>
<p class="hero-subtitle">Tu Título Profesional</p>

<!-- Líneas 79-88: Enlaces sociales -->
<a href="https://github.com/tu-usuario" target="_blank">
<a href="https://linkedin.com/in/tu-perfil" target="_blank">
<a href="mailto:tu@email.com">
```

#### Configurar GitHub
En el archivo `script.js`, línea 442:
```javascript
// Reemplaza 'tu-usuario' con tu username de GitHub
const username = 'tu-usuario-github';
```

#### Información de Contacto
Actualiza la sección de contacto (líneas 450-480 en `index.html`):
```html
<p>tu@email.com</p>
<p>+34 123 456 789</p>
<p>Tu Ciudad, País</p>
```

### 3. Personalización Avanzada

#### Colores y Tema
En `styles.css` (líneas 12-30), personaliza los colores:
```css
:root {
    --primary-color: #6366f1;    /* Tu color principal */
    --secondary-color: #f59e0b;  /* Color secundario */
    --accent-color: #10b981;     /* Color de acento */
}
```

#### Secciones del CV
Edita las secciones de experiencia, educación y certificaciones en `index.html`:

**Experiencia Laboral** (líneas 180-250):
```html
<div class="timeline-item">
    <div class="timeline-content">
        <h3>Tu Puesto</h3>
        <h4>Nombre de la Empresa</h4>
        <p>Descripción de tus responsabilidades...</p>
    </div>
</div>
```

**Habilidades** (líneas 350-450):
```html
<div class="skill-item">
    <div class="skill-info">
        <span class="skill-name">Tu Habilidad</span>
        <span class="skill-level">90%</span>
    </div>
    <div class="skill-bar">
        <div class="skill-progress" style="--progress: 90%"></div>
    </div>
</div>
```

## 📁 Estructura del Proyecto

```
web-page/
│
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Funcionalidad JavaScript
└── README.md           # Este archivo
```

## 🌐 Despliegue

### GitHub Pages (Gratis)
1. Sube los archivos a un repositorio de GitHub
2. Ve a Settings → Pages
3. Selecciona la rama main como source
4. Tu página estará disponible en `https://tu-usuario.github.io/nombre-repo`

### Netlify (Gratis)
1. Arrastra la carpeta del proyecto a [netlify.com](https://netlify.com)
2. Tu página estará disponible inmediatamente
3. Conecta tu repositorio para actualizaciones automáticas

### Vercel (Gratis)
1. Sube tu código a GitHub
2. Conecta tu repositorio en [vercel.com](https://vercel.com)
3. Despliegue automático en cada push

## 🎯 Optimizaciones Incluidas

### Performance
- **Lazy Loading**: Carga diferida de imágenes
- **CSS Optimizado**: Uso eficiente de Custom Properties
- **JavaScript Eficiente**: Sin dependencias externas pesadas
- **Compresión de Recursos**: Minificación recomendada para producción

### SEO
- **Meta Tags**: Configuración completa para redes sociales
- **Estructura Semántica**: HTML5 semántico para mejor indexación
- **Schema Markup**: Preparado para datos estructurados
- **Sitemap**: Estructura clara para crawlers

### Accesibilidad
- **ARIA Labels**: Etiquetas para lectores de pantalla
- **Contraste**: Cumple estándares WCAG 2.1
- **Navegación por Teclado**: Totalmente accesible
- **Focus Management**: Indicadores visuales claros

## 🔧 Personalización Avanzada

### Añadir Nuevas Secciones
```html
<!-- Ejemplo: Sección de Testimonios -->
<section id="testimonios" class="testimonios">
    <div class="container">
        <div class="section-header">
            <h2 class="section-title">Testimonios</h2>
        </div>
        <!-- Tu contenido aquí -->
    </div>
</section>
```

### Integrar Analytics
```javascript
// En script.js, método trackEvent()
gtag('config', 'TU-GOOGLE-ANALYTICS-ID');
```

### Añadir Blog
Para integrar un blog, considera usar:
- **Headless CMS**: Strapi, Contentful, Sanity
- **Static Site Generators**: Integrar con Gatsby, Next.js
- **Markdown**: Sistema de archivos markdown simple

## 🐛 Solución de Problemas

### Los proyectos de GitHub no cargan
1. Verifica tu username en `script.js`
2. Comprueba que tus repositorios sean públicos
3. Revisa la consola del navegador para errores de CORS

### El formulario no funciona
1. El formulario actual es solo demostración
2. Para funcionalidad real, integra con:
   - **Formspree**: Servicio gratuito para formularios
   - **Netlify Forms**: Si usas Netlify
   - **EmailJS**: Envío directo desde el cliente

### Problemas de responsive
1. Testa en diferentes dispositivos
2. Usa las herramientas de desarrollo del navegador
3. Ajusta los breakpoints en `styles.css` si es necesario

## 🤝 Contribuciones

¿Encontraste un bug o tienes una mejora? 

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Puedes usarlo libremente para tus proyectos personales o comerciales.

## 🎉 Créditos

- **Diseño**: Inspirado en las mejores prácticas de UI/UX moderno
- **Iconos**: Font Awesome
- **Fuentes**: Google Fonts (Inter)
- **Animaciones**: CSS3 y JavaScript vanilla

## 📞 Soporte

¿Necesitas ayuda personalizando tu portafolio?

- 📧 Email: [tu-email@ejemplo.com]
- 💬 LinkedIn: [tu-perfil-linkedin]
- 🐦 Twitter: [@tu-usuario]

---

⭐ **¡Si te gusta este proyecto, no olvides darle una estrella!** ⭐

Hecho con ❤️ y mucho café ☕ 