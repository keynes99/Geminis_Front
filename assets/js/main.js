// Cargar componentes comunes
const loadComponent = async (id, file) => {
    const element = document.getElementById(id);
    if (element) {
        try {
            const response = await fetch(`../components/${file}`);
            if (!response.ok) throw new Error(`No se pudo cargar el archivo ${file}`);
            const html = await response.text();
            element.innerHTML = html;
            let userToken = localStorage.getItem("token");
            // Si el archivo es nav.html y tenemos un userName, actualizar el enlace
            if (id === 'nav' && userName) {
                try {
                    const authResponse = await fetch('http://localhost:3000/', {
                        headers: {
                            'Authorization': `Bearer ${userToken}`
                        }
                    });
                    if (authResponse.status === 401) {
                        alert("La sesión ha expirado. Por favor, inicie sesión nuevamente.");
                        logout();
                        return;
                    }
                    if (!authResponse.ok) throw new Error('Error en la autenticación');
                } catch (authError) {
                    console.error('Error en la autenticación:', authError);
                    alert("La sesión ha expirado. Por favor, inicie sesión nuevamente.");
                    logout();
                    return;
                }

                const enlace = document.getElementById("userName");
                if (enlace) {
                    enlace.textContent = userName;
                    enlace.href = "./profile.html";
                }
                // Mostrar "Mi restaurante" si userEmpresa no es null
                console.log("Empresa:", userEmpresa);
                if (userEmpresa !== 'null') {
                    const miRestauranteLink = document.getElementById("miRestaurante");
                    if (miRestauranteLink) {
                        miRestauranteLink.style.display = 'block';
                    }
                    const sedesLink = document.getElementById("misSedes");
                    if (sedesLink) {
                        sedesLink.style.display = 'block';
                    }
                }
                // Agregar listener al enlace "Cerrar Sesión"
                const cerrarSesionLink = document.getElementById("CerrarSes");
                if (cerrarSesionLink) {
                    cerrarSesionLink.addEventListener("click", (event) => {
                        event.preventDefault(); // Evitar la navegación predeterminada
                        logout();
                    });
                }
            }

            if (!userToken && id === 'footer') {
                const footerElement = document.querySelector(".footer-container");
                if (footerElement) {
                    const elementsToHide = footerElement.querySelectorAll(".hide-on-login");
                    elementsToHide.forEach((e) => {
                        e.style.display = "none";
                    });
                }
            }
            if (!userToken) {
                if (id === 'nav') {
                    console.log("No hay sesión activa");
                    console.log(window.location.pathname);
                    const user = document.querySelector(".dropdown");
                    const domi = document.querySelector(".domicilios");
                    const home = document.querySelector(".login");
                    user.style.display = "none";
                    domi.style.display = "none";
                    home.style.display = "block";
                    const hola = home.getAttribute("href")
                    console.log(hola);
                } else {
                    home.style.display = "none";
                }
            }

        } catch (error) {
            console.error(`Error cargando el componente ${file}:`, error);
        }
    }
};
// Función para cerrar sesión
const logout = () => {
    // Borrar variables de localStorage
    localStorage.removeItem('nombre');
    localStorage.removeItem('documento');
    localStorage.removeItem("token");
    localStorage.removeItem("empresa");

    // Borrar variables con info de la persona
    userName = '';
    userDocument = 0;
    userToken = null;
    userEmpresa = null;

    // Redirigir a login.html
    window.location.href = "home.html";
    console.log("sesion cerrada");
};

// Usuario y documento
let userName = localStorage.getItem('nombre');
let userDocument = localStorage.getItem('documento');
let userEmpresa = localStorage.getItem('empresa');
// console.log(userName, userDocument);
// Función para marcar el elemento activo en el nav
const setActiveNavItem = () => {
    const navItems = document.querySelectorAll('nav a');
    const currentPath = window.location.pathname;
    navItems.forEach(item => {
        if (currentPath.includes(item.getAttribute('href'))) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
};

// Cargar Nav y Footer
document.addEventListener("DOMContentLoaded", () => {
    loadComponent('nav', 'nav.html').then(() => {
        setActiveNavItem();
    });
    loadComponent('footer', 'footer.html');
});

