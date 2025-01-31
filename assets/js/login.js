const form = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');
const createButton = document.getElementById('go-to-create');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorMessage.textContent = '';

    const documento = form.documento.value;
    const contrasena = form.contrasena.value;

    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ documento, contrasena }),
        });

        if (!response.ok) {
            throw new Error('Credenciales incorrectas');
        }

        const data = await response.json();
        console.log(data);
        let userName=data.user.Nombres+' '+data.user.Apellido;
        localStorage.setItem('nombre', userName); // Guardar el nombre del usuario
        localStorage.setItem('documento',data.user.Documento); // Guardar el documento del usuario
        localStorage.setItem('empresa', data.user.Empresa); // Guardar la empresa del usuario
        localStorage.setItem('token', data.token); // Guardar el token
        window.location.href = './home.html'; // Redirigir al home
    } catch (error) {
        errorMessage.textContent = error.message;
    }
});

createButton.addEventListener('click', () => {
    window.location.href = 'create.html';
});