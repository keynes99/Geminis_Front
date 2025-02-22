const form = document.getElementById('forgot-password-form');
const errorMessage = document.getElementById('error-message');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorMessage.textContent = '';

    const correo = form.correo.value;

    try {
        const response = await fetch(`${configURL1.baseUrl}/api/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo }),
        });

        if (!response.ok) {
            throw new Error('Error al enviar el código de restablecimiento');
        }

        const data = await response.json();
        alert("código de restablecimiento enviado, revisa tu correo");
        window.location.href = `reset-password.html?correo=${correo}`;
    } catch (error) {
        errorMessage.textContent = error.message;
    }
});
