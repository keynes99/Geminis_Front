document.addEventListener("DOMContentLoaded", async () => {
    const createDishForm = document.getElementById('crearPlato-form');
    const editDishForm = document.getElementById('editarPlato-form');
    const dishList = document.getElementById('dishList');
    const editDishBtn = document.getElementById('editarPlatoBtn');
    const showCreateDishFormBtn = document.getElementById('showCreateDishFormBtn');
    const showEditDishFormBtn = document.getElementById('showEditDishFormBtn');

    const urlParams = new URLSearchParams(window.location.search);
    const selectedBranch = urlParams.get('id');

    if (createDishForm && editDishForm && dishList && editDishBtn && showCreateDishFormBtn && showEditDishFormBtn) {
        showCreateDishFormBtn.addEventListener('click', () => {
            createDishForm.style.display = 'block';
            editDishForm.style.display = 'none';
        });

        showEditDishFormBtn.addEventListener('click', () => {
            createDishForm.style.display = 'none';
            editDishForm.style.display = 'block';
            loadDishes();
        });

        createDishForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(createDishForm);
            const dishData = {
                Nombre: formData.get('nombrePlato'),
                Descripcion: formData.get('descripcionPlato'),
                Precio: formData.get('precioPlato'),
                Tipo: formData.get('categoria'),
                Sede: selectedBranch
            };

            if (formData.get('imagenPlato') && formData.get('imagenPlato').size > 0) {
                const imageFile = formData.get('imagenPlato');
                const imageUrl = await uploadImage(imageFile);
                if (imageUrl) {
                    dishData.Imagen = imageUrl;
                }
            }
            await sendDishData(dishData);
        });

        async function sendDishData(dishData) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/api/menu/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(dishData)
                });
                if (!response.ok) throw new Error('Error al agregar el plato');
                alert('Plato agregado exitosamente');
                createDishForm.reset();
                location.reload(); // Recargar la página
            } catch (error) {
                console.error('Error:', error);
            }
        }

        editDishBtn.addEventListener('click', async () => {
            const selectedDish = dishList.value;
            if (selectedDish) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`http://localhost:3000/api/menu/plato/${selectedDish}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!response.ok) throw new Error('Error al obtener la información del plato');
                    const dish = await response.json();
                    console.log(dish);

                    document.getElementById('nombrePlato1').value = dish.Nombre;
                    document.getElementById('descripcionPlato1').value = dish.Descripcion;
                    document.getElementById('precioPlato1').value = dish.Precio;
                    document.getElementById('categoriaPlato1').value = dish.Tipo; // Set the category

                    // Remove previous image container if exists
                    const existingImageContainer = document.querySelector('.image-container');
                    if (existingImageContainer) {
                        existingImageContainer.remove();
                    }

                    // Create and load images into the img tag dynamically
                    const imageContainer = document.createElement('img');
                    imageContainer.classList.add('image-container');
                    imageContainer.width = 500;
                    imageContainer.height = 300;
                    if (dish.ImagenMenu) {
                        imageContainer.src = dish.ImagenMenu;
                    }
                    const inputGroup = document.querySelector('#imagenPlato1').parentElement;
                    inputGroup.appendChild(imageContainer);
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        });

        editDishForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(editDishForm);
            const dishData = {
                Nombre: formData.get('nombrePlato1'),
                Descripcion: formData.get('descripcionPlato1'),
                Precio: formData.get('precioPlato1'),
                Tipo: formData.get('categoria'),
                Sede: selectedBranch
            };

            if (formData.get('imagenPlato1') && formData.get('imagenPlato1').size > 0) {
                const imageFile = formData.get('imagenPlato1');
                const imageUrl = await uploadImage(imageFile);
                if (imageUrl) {
                    dishData.Imagen = imageUrl;
                }
            }
            await updateDishData(dishData);
        });

        async function updateDishData(dishData) {
            const selectedDish = dishList.value;
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3000/api/menu/${selectedDish}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(dishData)
                });
                if (!response.ok) throw new Error('Error al actualizar el plato');
                alert('Plato actualizado exitosamente');
                editDishForm.reset();
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }

    async function loadDishes() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/menu/${selectedBranch}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al obtener la lista de platos');
            const dishes = await response.json();
            console.log(dishes);

            // Clear the dishList dropdown
            dishList.innerHTML = '';

            // Populate the dishList dropdown with the dishes
            dishes.forEach(dish => {
                const option = document.createElement('option');
                option.value = dish.Rowid;
                option.textContent = dish.Nombre;
                dishList.appendChild(option);
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function uploadImage(imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);

        try {
            const response = await fetch('https://api.imgbb.com/1/upload?&key=b15f59e3b69de9b1198771b85354d22b', {
                method: 'POST',
                body: imageFormData
            });
            const result = await response.json();
            if (result.success) {
                return result.data.url;
            } else {
                alert('Failed to upload image.');
                return null;
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image.');
            return null;
        }
    }
});
