const form = document.getElementById('create-form');
const errorMessage = document.getElementById('error-message');
const tipoSelect = document.getElementById('tipo');
const usuarioFields = document.getElementById('usuario-fields');
const restauranteFields = document.getElementById('restaurante-fields');
const goToLogin = document.getElementById('go-to-login');

const esAdminSelect = document.getElementById('es-admin');
const adminNitContainer = document.getElementById('admin-nit');
const nitRestauranteSelect = document.getElementById('nit-restaurante');


// Mostrar/Ocultar campos según el tipo seleccionado
tipoSelect.addEventListener('change', () => {
    if (tipoSelect.value === 'usuario') {
        usuarioFields.style.display = 'block';
        restauranteFields.style.display = 'none';

        // Activar campos de usuario
        usuarioFields.querySelectorAll('input').forEach(input => input.required = true);
        restauranteFields.querySelectorAll('input').forEach(input => input.required = false);

    } else if (tipoSelect.value === 'restaurante') {
        usuarioFields.style.display = 'none';
        restauranteFields.style.display = 'block';

        // Activar campos de restaurante
        usuarioFields.querySelectorAll('input').forEach(input => input.required = false);
        restauranteFields.querySelectorAll('input').forEach(input => input.required = true);
    }
});

// Enviar datos al backend
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorMessage.textContent = '';

    const formData = new FormData(form);
    const body = {};
    formData.forEach((value, key) => (body[key] = value));
    console.log(body);
    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        

        if (!response.ok) {
            throw new Error('Error al crear usuario o restaurante');
        }

        const data = await response.json();
        alert(data.message);
        form.reset();
    } catch (error) {
        errorMessage.textContent = error.message;
    }
});

goToLogin.addEventListener('click', () => {
    window.location.href = 'login.html';
});

// Mostrar/Ocultar campos de administrador según la selección
esAdminSelect.addEventListener('change', () => {
    if (esAdminSelect.value === 'si') {
        adminNitContainer.style.display = 'block';
        nitRestauranteSelect.required = true;
    } else {
        adminNitContainer.style.display = 'none';
        nitRestauranteSelect.required = false;
    }
});

// Cargar NITs de restaurantes desde el backend
const cargarNITsRestaurantes = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/restaurantes/nits'); // Ruta para obtener NITs
        if (!response.ok) {
            throw new Error('Error al cargar NITs de restaurantes');
        }

        const nits = await response.json();
        nitRestauranteSelect.innerHTML = '<option value="">Seleccione un NIT</option>';
        nits.forEach(nit => {
            const option = document.createElement('option');
            option.value = nit;
            option.textContent = nit;
            nitRestauranteSelect.appendChild(option);
        });
    } catch (error) {
        console.error(error.message);
    }
};

// Llamar a cargarNITsRestaurantes al cargar la página
window.addEventListener('DOMContentLoaded', cargarNITsRestaurantes);
