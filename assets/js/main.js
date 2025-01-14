// Cargar componentes comunes
const loadComponent = async (id, file) => {
    const element = document.getElementById(id);
    if (element) {
        const response = await fetch(`../components/${file}`);
        const html = await response.text();
        element.innerHTML = html;
    }
};

// Cargar Nav y Footer
loadComponent('nav', 'nav.html');
loadComponent('footer', 'footer.html');
