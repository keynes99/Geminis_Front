// URL de configuración
const configURL1 = {
    baseUrl: 'http://localhost:3000'
    //baseUrl: 'https://geminisback-production.up.railway.app'
};

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
                    const authResponse = await fetch(`${configURL1.baseUrl}/`, {
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
                document.querySelector(".login").style.display = "none";
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
                } else {
                    const miRestauranteLink = document.getElementById("miRestaurante");
                    const sedesLink = document.getElementById("misSedes");
                    miRestauranteLink.style.display = 'none';
                    sedesLink.style.display = 'none';
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
                    // Activar al final
                    console.log("No hay sesión activa");
                    const user = document.querySelector(".dropdown");
                    const domi = document.querySelector(".domicilios");
                    const reserva = document.querySelector(".reservas");
                    const logIn = document.querySelector(".login");
                    user.style.display = "none";
                    domi.style.display = "none";
                    reserva.style.display = "none";
                    logIn.style.display = "block";

                    // Seleccionar el li padre de domicilios y reservas y establecer display none
                    const domiParent = domi.closest('li');
                    const reservaParent = reserva.closest('li');

                    if (domiParent) {
                        domiParent.style.display = "none";
                    }

                    if (reservaParent) {
                        reservaParent.style.display = "none";
                    }

                    let hasReloaded = false;

                    window.addEventListener('resize', () => {
                        if (window.innerWidth  && !hasReloaded) {
                            if (!sessionStorage.getItem('reloaded')) {
                                sessionStorage.setItem('reloaded', 'true');
                                hasReloaded = true;
                                location.reload();
                            }
                        }
                    });

                    // Restablecer la variable al cargar la página en caso de que se haya recargado
                    window.addEventListener('load', () => {
                        sessionStorage.removeItem('reloaded');

                        if (window.innerWidth < 992) {
                            logIn.innerHTML = '<i class="fa-solid fa-right-to-bracket" style="color: #fdedef; font-size: 24px;"></i>';
                        }
                    });



                }
            } else {

                const logInparent = document.querySelector(".login").closest('li');
                if (logInparent) {
                    logInparent.style.display = "none";
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
            if (item.querySelector('img')) {
                item.classList.add('no-hover')
                return;
            }
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
};
// Desactivar el boxShadow para el nav sticky
const handleNavShadow = () => {
    const navElement = document.getElementById('nav');
    if (navElement && navElement.classList.contains('nav-sticky')) {
        const nav = document.querySelector('nav');
        nav.style.boxShadow = 'none';
    }
};
function toggleCollapseMenu() {

    const menu = document.querySelector('#collapseMenu');

    if (window.innerWidth < 1200) {
        menu.classList.toggle('show'); // Cambiar a toggle para alternar la visibilidad

    }
}
const reloadOnResize = (() => {
    let hasReloaded = false;

    return () => {
        if (!hasReloaded) {
            hasReloaded = true;
            sessionStorage.setItem('reloaded', 'true');
            location.reload();
        }
    };
})();

// Detectar cambios de tamaño de la ventana
let lastWidth = window.innerWidth;
let lastHeight = window.innerHeight;

window.addEventListener("resize", () => {
    if (window.innerWidth !== lastWidth || window.innerHeight !== lastHeight) {
        lastWidth = window.innerWidth;
        lastHeight = window.innerHeight;
        location.reload();
    }
});
// Cargar Nav y Footer
document.addEventListener("DOMContentLoaded", () => {
    loadComponent('nav', 'nav.html').then(() => {

        setActiveNavItem();
        handleNavShadow();

    });
    loadComponent('footer', 'footer.html');

});


