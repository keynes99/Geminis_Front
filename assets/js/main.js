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

//Usuario y documento

const userName = localStorage.getItem('nombre');
const userDocument = localStorage.getItem('documento');
console.log(userName,userDocument);


// Cargar el componente nav
document.addEventListener("DOMContentLoaded", async () => {
    const navContainer = document.getElementById("nav");

    try {
        // Cargar el contenido del archivo nav.html
        const response = await fetch('../components/nav.html');
        if (!response.ok) throw new Error('No se pudo cargar el archivo nav.html');
        const navHTML = await response.text();

        // Insertar el contenido en el contenedor
        navContainer.innerHTML = navHTML;

        // Actualizar el enlace dentro del nav
        const enlace = document.getElementById("userName");
        enlace.textContent = userName;
        enlace.href = "./profile.html";
    } catch (error) {
        console.error("Error cargando el componente nav:", error);
    }
});

