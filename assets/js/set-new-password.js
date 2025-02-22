const form = document.getElementById('set-new-password-form');
const errorMessage = document.getElementById('error-message');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorMessage.textContent = '';

    const urlParams = new URLSearchParams(window.location.search);
    const correo = urlParams.get('correo');
    urlParams.delete('correo');
    window.history.replaceState({}, document.title, window.location.pathname);

    const nuevaContrasena = form.nuevaContrasena.value;

    try {
        const resetResponse = await fetch(`${configURL1.baseUrl}/api/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, nuevaContrasena }),
        });

        if (!resetResponse.ok) {
            const errorData = await resetResponse.json();
            throw new Error(errorData.message || 'Error al restablecer la contraseña');
        }

        const data = await resetResponse.json();
        alert("Contraseña restablecida correctamente");
        window.location.href = 'login.html';
    } catch (error) {
        errorMessage.textContent = error.message;
    }
});
