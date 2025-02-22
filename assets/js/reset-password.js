const form = document.getElementById('reset-password-form');
const errorMessage = document.getElementById('error-message');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorMessage.textContent = '';

    const codigo = form.codigo.value;
    const urlParams = new URLSearchParams(window.location.search);
    const correo = urlParams.get('correo');
    urlParams.delete('correo');
    window.history.replaceState({}, document.title, window.location.pathname);

    try {
        const verifyResponse = await fetch(`${configURL1.baseUrl}/api/auth/verify-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: codigo }),
        });

        if (!verifyResponse.ok) {
            const errorData = await verifyResponse.json();
            throw new Error(errorData.message || 'Código de verificación incorrecto');
        }

        const data = await verifyResponse.json();
        alert('Código de verificación correcto, por favor ingrese su nueva contraseña');
        window.location.href = `${data.redirectUrl}?correo=${correo}`;
    } catch (error) {
        errorMessage.textContent = error.message;
    }
});
