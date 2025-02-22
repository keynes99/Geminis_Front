// URL de configuración
const config = {
    //baseUrl: 'http://localhost:3000'
    baseUrl: 'geminisback-production.up.railway.app'
};

document.addEventListener("DOMContentLoaded", async () => {
    const nit = localStorage.getItem('empresa');

    const createBranchForm = document.getElementById('crearSede-form');
    const editBranchForm = document.getElementById('editarSede-form');
    const branchList = document.getElementById('branchList');
    const editBranchBtn = document.getElementById('editarSedeBtn');
    const showCreateBranchFormBtn = document.getElementById('showCreateBranchFormBtn');
    const showEditBranchFormBtn = document.getElementById('showEditBranchFormBtn');
    const editMenuBtn = document.getElementById('editarMenuBtn');

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

    if (createBranchForm && editBranchForm && branchList && editBranchBtn && showCreateBranchFormBtn && showEditBranchFormBtn) {
        showCreateBranchFormBtn.addEventListener('click', () => {
            createBranchForm.style.display = 'block';
            editBranchForm.style.display = 'none';
            resetScheduleField();
            document.getElementById("horario").value = '';
        });

        showEditBranchFormBtn.addEventListener('click', () => {
            createBranchForm.style.display = 'none';
            editBranchForm.style.display = 'block';
            loadBranches();
            resetScheduleField();
            const horario1 = document.getElementById("horario1");
            if (horario1) {
                horario1.value = '';
            }
        });

        createBranchForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(createBranchForm);
            const branchData = {
                Direccion: formData.get('direccionSede'),
                Empresa: nit,
                MesasDisponibles: formData.get('mesasDisponibles'),
                CantidadDePersonasPorMesa: formData.get('cantidadDePersonasPorMesa'),
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
                const response = await fetch(`${config.baseUrl}/api/sedes/`, {
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
                    const response = await fetch(`${config.baseUrl}/api/sedes/${selectedBranch}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!response.ok) throw new Error('Error al obtener la información de la sede');
                    const branch = await response.json();
                    console.log(branch);

                    document.getElementById('direccionSede1').value = branch.Direccion;
                    document.getElementById('telefonoSede1').value = branch.Telefono;
                    document.getElementById('mesasDisponibles1').value = branch.MesasDisponibles;
                    document.getElementById('cantidadDePersonasPorMesa1').value = branch.CantidadDePersonasPorMesa;
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

                    // Load schedule into modal
                    loadScheduleIntoModal(branch.Horario);

                    // Show the "Editar Menú" button
                    editMenuBtn.style.display = 'block';
                    editMenuBtn.onclick = () => {
                        window.location.href = `editarMenu.html?id=${selectedBranch}`;
                    };

                } catch (error) {
                    console.error('Error:', error);
                }
            }
        });

        function loadScheduleIntoModal(scheduleJson) {
            try {
                const schedule = JSON.parse(scheduleJson);
                const checkboxes = document.querySelectorAll(".day");
                checkboxes.forEach(checkbox => {
                    const daySchedule = schedule.find(item => item.day === checkbox.value);
                    if (daySchedule) {
                        checkbox.checked = true;
                        const timeInputs = checkbox.parentNode.querySelectorAll("input[type='time']");
                        timeInputs[0].value = daySchedule.startTime;
                        timeInputs[1].value = daySchedule.endTime;
                        timeInputs.forEach(input => {
                            input.removeAttribute('disabled');
                            input.setAttribute('required', 'required');
                        });
                    } else {
                        checkbox.checked = false;
                        const timeInputs = checkbox.parentNode.querySelectorAll("input[type='time']");
                        timeInputs.forEach(input => {
                            input.setAttribute('disabled', 'disabled');
                            input.removeAttribute('required');
                            input.value = '';
                        });
                    }
                });
            } catch (error) {
                console.error('Error parsing schedule JSON:', error);
            }
        }

        editBranchForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(editBranchForm);
            const branchData = {
                Direccion: formData.get('direccionSede1'),
                Empresa: nit,
                MesasDisponibles: formData.get('mesasDisponibles1'),
                CantidadDePersonasPorMesa: formData.get('cantidadDePersonasPorMesa1'),
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
            resetScheduleField();
            const horario1 = document.getElementById("horario1");
            if (horario1) {
                horario1.value = '';
            }
            const horario = document.getElementById("horario");
            if (horario) {
                horario.value = '';
            }
        });

        async function updateBranchData(branchData) {
            const selectedBranch = branchList.value;
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${config.baseUrl}/api/sedes/${selectedBranch}`, {
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
            const response = await fetch(`${config.baseUrl}/api/sedes?empresa=${nit}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al obtener la lista de sedes');
            const branches = await response.json();
            branchList.innerHTML = branches.map(branch => `<option value="${branch.Rowid}">${branch.Direccion}</option>`).join('');
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function resetScheduleField() {
        const horarioTextarea = document.getElementById("horario");
        if (horarioTextarea) {
            horarioTextarea.value = '';
        }
        const checkboxes = document.querySelectorAll(".day");
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            const timeInputs = checkbox.parentNode.querySelectorAll("input[type='time']");
            timeInputs.forEach(input => {
                input.setAttribute('disabled', 'disabled');
                input.removeAttribute('required');
                input.value = '';
            });
        });
    }
});

function openModal() {
    const modal = document.getElementById("horarioModal");
    
    modal.style.display = "flex";
}

function closeModal() {
    const modal = document.getElementById("horarioModal");
    modal.style.display = "none";
    alert('Horario guardado exitosamente');
}
// Agregar horario dinamico
document.addEventListener("DOMContentLoaded", function () {
    // Get all day checkboxes and other elements
    const checkboxes = document.querySelectorAll(".day");
    const saveBtn = document.getElementById("save-btn");
    const output = document.getElementById("output");
    const horarioTextarea = document.getElementById("horario");
    const horarioTextarea1 = document.getElementById("horario1");
    
    // Add change event listener to each checkbox
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            // Enable or disable time inputs based on checkbox state
            let timeInputs = this.parentNode.querySelectorAll("input[type='time']");
            timeInputs.forEach(input => {
                if (this.checked) {
                    input.removeAttribute('disabled');
                    input.setAttribute('required', 'required');
                    
                } else {
                    input.setAttribute('disabled', 'disabled');
                    input.removeAttribute('required');
                    
                }
            });
        });
    });
    
    // Add click event listener to the save button
    saveBtn.addEventListener("click", function () {
        let schedule = [];
        // Collect selected days and their time ranges
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                let day = checkbox.value;
                let startTime = checkbox.parentNode.querySelector(".start-time").value;
                let endTime = checkbox.parentNode.querySelector(".end-time").value;
                schedule.push({ day, startTime, endTime });
            }
        });
        // Display the schedule as a JSON string
        const scheduleJson = JSON.stringify(schedule, null, 2);
        if (horarioTextarea) {
            horarioTextarea.value = scheduleJson;
        }
        if (horarioTextarea1) {
            horarioTextarea1.value = scheduleJson;
        }
    });
});
