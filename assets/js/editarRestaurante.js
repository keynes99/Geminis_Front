document.addEventListener("DOMContentLoaded", async () => {
    const nit = localStorage.getItem('empresa');
    if (nit) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${configURL1.baseUrl}/api/restaurantes/${nit}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al obtener la información del restaurante');
            const restaurant = await response.json();
            console.log(restaurant);
            document.getElementById('nit').value = restaurant.NIT;
            document.getElementById('nombre').value = restaurant.Nombre;
            document.getElementById('descripcion').value = restaurant.Descripcion;
            document.getElementById('categoria').value = restaurant.Categoria;
            document.querySelector('.editarRestaurante-container h1').textContent = restaurant.Nombre;
            const restaurantLogo = document.querySelector('.restaurant-logo');
            if (restaurantLogo) {
                if (restaurant.UbicacionLogo) {
                    restaurantLogo.src = restaurant.UbicacionLogo;
                } else if (restaurant.Logo && restaurant.Logo.data) {
                    const base64Logo = arrayBufferToBase64(restaurant.Logo.data);
                    restaurantLogo.src = `data:image/png;base64,${base64Logo}`;
                }
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

            if (formData.get('logo') && formData.get('logo').size > 0) {
                const logoFile = formData.get('logo');
                const logoFormData = new FormData();
                logoFormData.append('image', logoFile);

                try {
                    const response = await fetch('https://api.imgbb.com/1/upload?&key=b15f59e3b69de9b1198771b85354d22b', {
                        method: 'POST',
                        body: logoFormData
                    });
                    const result = await response.json();
                    if (result.success) {
                        data.UbicacionLogo = result.data.url;
                        await sendFormData(data);
                    } else {
                        alert('Failed to upload logo.');
                    }
                } catch (error) {
                    console.error('Error uploading logo:', error);
                    alert('Error uploading logo.');
                }
            } else {
                await sendFormData(data);
            }
        });
    }

    async function sendFormData(data) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${configURL1.baseUrl}/api/restaurantes/${data.NIT}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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
