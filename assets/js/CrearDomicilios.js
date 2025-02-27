// Función para crear un domicilio
const createDomicilio = async (sedeId, documentoUsuario, direccionEntrega, tipoPago, numeroDomicilio) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${configURL1.baseUrl}/api/domicilio/${sedeId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ documentoUsuario, direccionEntrega, tipoPago, numeroDomicilio })
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.message); // Mensaje de éxito
            getDomicilios(documentoUsuario); // Actualizar lista de domicilios
        } else {
            throw new Error('No se pudo crear el domicilio');
        }
    } catch (error) {
        console.error('Error al crear el domicilio:', error);
    }
};

// Manejar el envío del formulario
document.querySelector('#create-domicilio-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar recarga de la página

    const sedeId = new URLSearchParams(window.location.search).get('id'); // Obtener ID de la URL
    const documentoUsuario = document.querySelector('#documentoUsuario').value;
    const direccionEntrega = document.querySelector('#direccionEntrega').value;
    const tipoPago = document.querySelector('#tipoPago').value;
    const numeroDomicilio = document.querySelector('#numeroDomicilio').value;

    await createDomicilio(sedeId, documentoUsuario, direccionEntrega, tipoPago, numeroDomicilio);
});

// Obtener los menús de una sede
const getMenusDomicilios = async (sedeId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${configURL1.baseUrl}/api/domicilio/Menus/${sedeId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const menus = await response.json();
            renderMenus(menus); // Renderizar menús
            document.getElementById('sede-nombre').textContent = menus[0].NombreEmpresa; // Mostrar nombre de la sede
        } else {
            throw new Error('No se encontraron menús');
        }
    } catch (error) {
        console.error('Error al obtener los menús:', error);
    }
};

// Renderizar los menús en el HTML
const renderMenus = (menus) => {
    const menuList = document.querySelector('#menu-list');
    menuList.innerHTML = ''; // Limpiar lista de menús

    menus.forEach(menu => {
        const menuCard = document.createElement('div');
        menuCard.classList.add('menu-card');
        menuCard.dataset.menuId = menu.Rowid; // Asegúrate de que cada menú tenga un ID único

        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.value = 0;
        inputCantidad.min = 0;
        inputCantidad.classList.add('cantidad-input');
        inputCantidad.dataset.precio = menu.Precio;
        inputCantidad.addEventListener('change', updateTotal); // Actualizar total al cambiar cantidad
        
        menuCard.innerHTML = `
            <div class="menu-content"> <!-- Contenedor para el contenido principal -->
                
                    <img src="${menu.ImagenMenu}" alt="Imagen de ${menu.Nombre}" class="menu-img">
                 <!-- Agregar imagen del plato -->
                <div>
                    <h2>${menu.Nombre}</h2>
                    <p><strong>Descripción:</strong> ${menu.Descripcion || 'Sin descripción'}</p>
                    <p><strong>Precio:</strong> $${Math.floor(menu.Precio)}</p>
                </div>
            </div>
        `;
        menuCard.appendChild(inputCantidad); // Input de cantidad fuera del contenedor principal
        menuList.appendChild(menuCard);
    });
};

// Cargar datos al cargar la página
window.onload = () => {
    const documento = localStorage.getItem('documento');
    const nombre = localStorage.getItem('nombre');

    document.getElementById("cliente-nombre").textContent = nombre || "Nombre no disponible";
    document.getElementById("fecha").textContent = today();
    document.getElementById("hora").textContent = now();

    updateTotal(); // Calcular total inicial
};

// Obtener fecha actual
const today = () => {
    const today = new Date();
    return `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
};

// Obtener hora actual
const now = () => {
    const currentDate = new Date();
    return `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`;
};

// Actualizar el total a pagar
const updateTotal = () => {
    let totalPagar = 0;

    document.querySelectorAll('.cantidad-input').forEach(input => {
        const cantidad = parseFloat(input.value) || 0;
        const precio = parseFloat(input.dataset.precio) || 0;
        totalPagar += cantidad * precio;
    });

    document.getElementById('total-pagar').textContent = Math.floor(totalPagar); // Mostrar total sin decimales
};

const poblarDomicilio = async () => {
    try {
        // Obtener el documento del usuario desde el localStorage
        const usuario = localStorage.getItem('documento');
        if (!usuario) {
            alert('No se pudo obtener el documento del usuario. Por favor, inicia sesión nuevamente.');
            return;
        }

        // Obtener los datos del formulario
        const sedeId = new URLSearchParams(window.location.search).get('id'); // Obtener ID de la URL
        const fechaPantalla = document.getElementById('fecha').textContent; // Obtener la fecha desde la pantalla (formato DD/MM/YYYY)
        const hora = document.getElementById('hora').textContent; // Obtener la hora desde la pantalla
        const tipoPago = document.querySelector('#metodo-pago').value;

        // Convertir la fecha al formato YYYY-MM-DD
        const [dia, mes, anio] = fechaPantalla.split('/');
        const fecha = `${anio}-${mes}-${dia}`; // Formato YYYY-MM-DD

        // Obtener los menús seleccionados y sus cantidades
        const menus = [];
        document.querySelectorAll('.menu-card').forEach(menuCard => {
            const cantidadInput = menuCard.querySelector('.cantidad-input');
            const cantidad = parseFloat(cantidadInput.value) || 0;
            if (cantidad > 0) {
                const menuId = menuCard.dataset.menuId; // Asegúrate de que cada menu-card tenga un data-menu-id
                const valor = parseFloat(cantidadInput.dataset.precio) || 0;
                menus.push({ menuId, cantidad, valor });
            }
        });

        if (menus.length === 0) {
            alert('Por favor, selecciona al menos un menú.');
            return;
        }

        // Obtener el número de domicilio más alto para la sede
        const token = localStorage.getItem('token');
        const responseConsecutivo = await fetch(`${configURL1.baseUrl}/api/domicilio/consecutivo/${sedeId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!responseConsecutivo.ok) {
            throw new Error('No se pudo obtener el consecutivo del domicilio.');
        }

        const { consecutivo } = await responseConsecutivo.json();
        const numeroDomicilio = consecutivo + 1; // Incrementar el consecutivo

        // Enviar los datos al backend
        const response = await fetch(`${configURL1.baseUrl}/api/domicilio/domicilios/crear`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                usuario,
                sede: sedeId,
                fecha,
                hora,
                tipoPago,
                numeroDomicilio,
                menus,
            }),
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.message); // Mensaje de éxito
            window.location.href = 'domicilios.html'; // Redirigir a la página de domicilios
        } else {
            throw new Error('No se pudo crear el domicilio');
        }
    } catch (error) {
        console.error('Error al crear el domicilio:', error);
        alert('Error al crear el domicilio. Por favor, inténtalo de nuevo.');
    }
};

document.querySelector('#solicitar-domicilio').addEventListener('click', (event) => {
    event.preventDefault(); // Evitar recarga de la página
    poblarDomicilio();
});

document.getElementById('terms-link').addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('termsModal').style.display = 'flex';
});

document.getElementById('closeTermsBtn').addEventListener('click', () => {
    document.getElementById('termsModal').style.display = 'none';
});

document.getElementById('terms').addEventListener('change', (event) => {
    document.getElementById('solicitar-domicilio').disabled = !event.target.checked;
});

 // Obtener los parámetros de la URL
 const params = new URLSearchParams(window.location.search);

 // Obtener el valor del parámetro 'id'
 const id = params.get('id');

 // Llamar a la función con el ID extraído
 if (id) {
     getMenusDomicilios(id);
 } else {
     console.error('No se encontró el parámetro "id" en la URL');
 }