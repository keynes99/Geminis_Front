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
                const enlace = document.getElementById("userName");
                if (enlace) {
                    enlace.textContent = userName;
                    enlace.href = "./profile.html";
                }
                // Mostrar "Mi restaurante" si userEmpresa no es null
                console.log("Empresa:",userEmpresa);
                if (userEmpresa!=='null') {
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
                        // Borrar variables de localStorage
                        localStorage.removeItem('nombre');
                        localStorage.removeItem('documento');
                        localStorage.removeItem("token");
                        localStorage.removeItem("empresa");

                        //Borrar variables con info de la persona

                        userName='';
                        userDocument=0;
                        userToken=null;
                        userEmpresa = null;

                        // Redirigir a login.html
                        window.location.href = "login.html";
                        console.log("sesion cerrada")
                    });
                }
                
            }

            if (!userToken && id === 'footer') {
                const footerElement = document.querySelector(".footer-container");
                if (footerElement ) {
                    const elementsToHide = footerElement.querySelectorAll(".hide-on-login");
                    elementsToHide.forEach((e) => {
                        e.style.display = "none";
                    });
                }

            }
            if (!userToken) {
                if (id === 'nav') {
                    console.log("No hay sesión activa");
                    const user = document.querySelector(".dropdown");
                    const domi = document.querySelector(".domicilios");
                    const home = document.querySelector(".inicio");
                    user.style.display = "none";
                    domi.style.display = "none";
                    home.innerText = "Iniciar sesión";
                    home.href = "./login.html";
                    
                }
            }

        } catch (error) {
            console.error(`Error cargando el componente ${file}:`, error);
        }
    }
};

// Usuario y documento
let userName = localStorage.getItem('nombre');
let userDocument = localStorage.getItem('documento');
let userEmpresa = localStorage.getItem('empresa');
// console.log(userName, userDocument);

// Cargar Nav y Footer
document.addEventListener("DOMContentLoaded", () => {
    loadComponent('nav', 'nav.html');
    loadComponent('footer', 'footer.html');
});


