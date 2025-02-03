document.addEventListener("DOMContentLoaded", async () => {
    const nit = localStorage.getItem('empresa');
    if (nit) {
        try {
            const response = await fetch(`http://localhost:3000/api/restaurantes/${nit}`);
            if (!response.ok) throw new Error('Error al obtener la información del restaurante');
            const restaurant = await response.json();
            console.log(restaurant);
            document.getElementById('nit').value = restaurant.NIT;
            document.getElementById('nombre').value = restaurant.Nombre;
            document.getElementById('descripcion').value = restaurant.Descripcion;
            document.getElementById('categoria').value = restaurant.Categoria;
            document.querySelector('.editarRestaurante-container h1').textContent = restaurant.Nombre;
            const restaurantLogo = document.querySelector('.restaurant-logo');
            if (restaurantLogo && restaurant.Logo && restaurant.Logo.data) {
                const base64Logo = arrayBufferToBase64(restaurant.Logo.data);
                restaurantLogo.src = `data:image/png;base64,${base64Logo}`;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const editarRestauranteForm = document.getElementById('editarRestaurante-form');
    if (editarRestauranteForm) {
        editarRestauranteForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(editarRestauranteForm);
            const nit = formData.get('nit');
            const data = {
                NIT: formData.get('nit'),
                Nombre: formData.get('nombre'),
                Descripcion: formData.get('descripcion'),
                Categoria: formData.get('categoria')
            };

            // Convertir el logo a base64 si existe
            if (formData.get('logo')) {
                const logoFile = formData.get('logo');
                const reader = new FileReader();
                reader.readAsDataURL(logoFile);
                reader.onload = async () => {
                    data.Logo = reader.result.split(',')[1]; // Obtener solo la parte base64
                    await sendFormData(data);
                };
                reader.onerror = (error) => {
                    console.error('Error al leer el archivo de logo:', error);
                    alert('Error al leer el archivo de logo');
                };
            } else {
                await sendFormData(data);
            }
        });
    }

    async function sendFormData(data) {
        try {
            const response = await fetch(`http://localhost:3000/api/restaurantes/${data.NIT}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Error al actualizar la información del restaurante');
            alert('Información del restaurante actualizada con éxito');
            location.reload(); // Recargar la página
        } catch (error) {
            console.error('Error:', error);
            alert('Error al actualizar la información del restaurante');
        }
    }

    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
});
