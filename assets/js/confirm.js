// URL de configuración
const config = {
    //baseUrl: 'http://localhost:3000'
    baseUrl: 'geminisback-production.up.railway.app'
};

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
        localStorage.setItem('token', token);

        // Obtener la información del usuario usando el token
        fetch(`${config.baseUrl}/api/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.user) {
                let userName = data.user.Nombres + ' ' + data.user.Apellido;
                localStorage.setItem('nombre', userName); // Guardar el nombre del usuario
                localStorage.setItem('documento', data.user.Documento); // Guardar el documento del usuario
                localStorage.setItem('empresa', data.user.Empresa); // Guardar la empresa del usuario
                // Redirigir a la página de inicio sin el token en la URL
                window.location.href = 'home.html';
            }
        })
        .catch(error => {
            console.error('Error al obtener la información del usuario:', error);
        });
    }
});