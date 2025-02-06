document.addEventListener("DOMContentLoaded", async () => {
    const nit = localStorage.getItem('empresa');

    const createBranchForm = document.getElementById('crearSede-form');
    const editMenuForm = document.getElementById('editarMenu-form');
    const editBranchForm = document.getElementById('editarSede-form');
    const branchList = document.getElementById('branchList');
    const editBranchBtn = document.getElementById('editarSedeBtn');
    const showCreateBranchFormBtn = document.getElementById('showCreateBranchFormBtn');
    const showEditBranchFormBtn = document.getElementById('showEditBranchFormBtn');

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

    if (createBranchForm && editMenuForm && editBranchForm && branchList && editBranchBtn && showCreateBranchFormBtn && showEditBranchFormBtn) {
        showCreateBranchFormBtn.addEventListener('click', () => {
            createBranchForm.style.display = 'block';
            editMenuForm.style.display = 'none';
            editBranchForm.style.display = 'none';
        });

        showEditBranchFormBtn.addEventListener('click', () => {
            createBranchForm.style.display = 'none';
            editMenuForm.style.display = 'none';
            editBranchForm.style.display = 'block';
            loadBranches();
        });

        createBranchForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(createBranchForm);
            const branchData = {
                Direccion: formData.get('direccionSede'),
                Empresa: nit,                
                MesasTotales: formData.get('mesasTotales'),
                MesasDisponibles: formData.get('mesasDisponibles'),
                ReservasMaximas: formData.get('reservasMaximas'),
                Telefono: formData.get('telefonoSede'),
                Horario: formData.get('horario')
            };

            if (formData.get('imagenes') && formData.get('imagenes').size > 0) {
                const imageFile = formData.get('imagenes');
                const imageUrl = await uploadImage(imageFile);
                if (imageUrl) {
                    branchData.Imagenes = imageUrl;
                }
            }
            await sendBranchData(branchData);
        });

        async function sendBranchData(branchData) {
            console.log(branchData);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/api/sedes/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(branchData)
                });
                if (!response.ok) throw new Error('Error al crear la sede');
                alert('Sede creada exitosamente');
                createBranchForm.reset();
                location.reload(); // Recargar la página
            } catch (error) {
                console.error('Error:', error);
            }
        }

        editBranchBtn.addEventListener('click', async () => {
            const selectedBranch = branchList.value;
            if (selectedBranch) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`http://localhost:3000/api/sedes/${selectedBranch}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!response.ok) throw new Error('Error al obtener la información de la sede');
                    const branch = await response.json();
                    console.log(branch);
                    
                    document.getElementById('direccionSede1').value = branch.Direccion;
                    document.getElementById('telefonoSede1').value = branch.Telefono;
                    document.getElementById('mesasTotales1').value = branch.MesasTotales;
                    document.getElementById('mesasDisponibles1').value = branch.MesasDisponibles;
                    document.getElementById('reservasMaximas1').value = branch.ReservasMaximas;
                    document.getElementById('horario1').value = branch.Horario;

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
                    if (branch.Imagenes) {
                        imageContainer.src = branch.Imagenes;
                    }
                    const inputGroup = document.querySelector('#imagenes1').parentElement;
                    inputGroup.appendChild(imageContainer);
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        });

        editBranchForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(editBranchForm);
            const branchData = {
                Direccion: formData.get('direccionSede1'),
                Empresa: nit,
                MesasTotales: formData.get('mesasTotales1'),
                MesasDisponibles: formData.get('mesasDisponibles1'),
                ReservasMaximas: formData.get('reservasMaximas1'),
                Telefono: formData.get('telefonoSede1'),
                Horario: formData.get('horario1')
            };

            if (formData.get('imagenes1') && formData.get('imagenes1').size > 0) {
                const imageFile = formData.get('imagenes1');
                const imageUrl = await uploadImage(imageFile);
                if (imageUrl) {
                    branchData.Imagenes = imageUrl;
                }
            }
            await updateBranchData(branchData);
        });

        async function updateBranchData(branchData) {
            const selectedBranch = branchList.value;
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3000/api/sedes/${selectedBranch}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(branchData)
                });
                if (!response.ok) throw new Error('Error al actualizar la sede');
                alert('Sede actualizada exitosamente');
                editBranchForm.reset();
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }

    async function loadBranches() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/sedes?empresa=${nit}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al obtener la lista de sedes');
            const branches = await response.json();
            branchList.innerHTML = branches.map(branch => `<option value="${branch.Rowid}">${branch.Direccion}</option>`).join('');
        } catch (error) {
            console.error('Error:', error);
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
