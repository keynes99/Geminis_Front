document.addEventListener("DOMContentLoaded", async () => {
    const nit = localStorage.getItem('empresa');

    const createBranchForm = document.getElementById('crearSede-form');
    const editMenuForm = document.getElementById('editarMenu-form');
    const editBranchForm = document.getElementById('editarSede-form');
    const branchList = document.getElementById('branchList');
    const editBranchBtn = document.getElementById('editarSedeBtn');
    const showCreateBranchFormBtn = document.getElementById('showCreateBranchFormBtn');
    const showEditBranchFormBtn = document.getElementById('showEditBranchFormBtn');

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

            if (formData.get('imagenes')) {
                const imageFile = formData.get('imagenes');
                const reader = new FileReader();
                reader.readAsDataURL(imageFile);
                reader.onload = async () => {
                    branchData.Imagenes = reader.result.split(',')[1]; // Obtener solo la parte base64
                    await sendBranchData(branchData);
                };
                reader.onerror = (error) => {
                    console.error('Error al leer el archivo de imagen:', error);
                    alert('Error al leer el archivo de imagen');
                };
            } else {
                await sendBranchData(branchData);
            }
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
                    
                    document.getElementById('direccionSede1').value = branch.Direccion;
                    document.getElementById('telefonoSede1').value = branch.Telefono;
                    document.getElementById('mesasTotales1').value = branch.MesasTotales;
                    document.getElementById('mesasDisponibles1').value = branch.MesasDisponibles;
                    document.getElementById('reservasMaximas1').value = branch.ReservasMaximas;
                    document.getElementById('horario1').value = branch.Horario;

                    // Load images into the img tag

                    const imageContainer = document.querySelector('.image-container');

                    if (imageContainer && branch.Imagenes) {

                        const base64Image = arrayBufferToBase64(branch.Imagenes.data);
                        imageContainer.src = `data:image/png;base64,${base64Image}`;
                    }
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

            if (formData.get('imagenes1')) {
                const imageFile = formData.get('imagenes1');
                const reader = new FileReader();
                reader.readAsDataURL(imageFile);
                reader.onload = async () => {
                    branchData.Imagenes = reader.result.split(',')[1]; // Obtener solo la parte base64
                    await updateBranchData(branchData);
                };
                reader.onerror = (error) => {
                    console.error('Error al leer el archivo de imagen:', error);
                    alert('Error al leer el archivo de imagen');
                };
            } else {
                await updateBranchData(branchData);
            }
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
