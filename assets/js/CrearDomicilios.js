// Función para crear un domicilio
const createDomicilio = async (sedeId, documentoUsuario, direccionEntrega, tipoPago, numeroDomicilio) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/domicilio/${sedeId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                documentoUsuario,
                direccionEntrega,
                tipoPago,
                numeroDomicilio
            })
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.message); // Muestra un mensaje de éxito
            // Aquí podrías llamar a la función para actualizar la lista de domicilios si lo deseas
            getDomicilios(documentoUsuario); // Actualizar la lista de domicilios
        } else {
            throw new Error('No se pudo crear el domicilio');
        }
    } catch (error) {
        console.error('Error al crear el domicilio:', error);
    }
};

// Función para manejar el envío del formulario
document.querySelector('#create-domicilio-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita el comportamiento por defecto del formulario (recarga de página)

    // Obtener los valores del formulario
    const sedeId = new URLSearchParams(window.location.search).get('id'); // Asumiendo que 'id' es parte de la URL
    const documentoUsuario = document.querySelector('#documentoUsuario').value; // Asegúrate de tener un campo con este id
    const direccionEntrega = document.querySelector('#direccionEntrega').value; // Asegúrate de tener un campo con este id
    const tipoPago = document.querySelector('#tipoPago').value; // Asegúrate de tener un campo con este id
    const numeroDomicilio = document.querySelector('#numeroDomicilio').value; // Asegúrate de tener un campo con este id

    // Llamar a la función para crear el domicilio
    await createDomicilio(sedeId, documentoUsuario, direccionEntrega, tipoPago, numeroDomicilio);
});

// Función para obtener los menús de una sede
const getMenusDomicilios = async (sedeId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/domicilio/Menus/${sedeId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const menus = await response.json();
            renderMenus(menus); // Llama a la función correcta para renderizar los menús
            document.getElementById('sede-nombre').textContent = menus[0].NombreEmpresa; // Accede al primer elemento del array
        } else {
            throw new Error('No se encontraron menús');
        }
    } catch (error) {
        console.error('Error al obtener los menús:', error);
    }
};

// Función para renderizar los menús en el HTML
const renderMenus = (menus) => {
    const menuList = document.querySelector('#menu-list'); // Cambia a #menu-list para coincidir con el HTML
    
    // Limpiar la lista de menús antes de agregar los nuevos
    menuList.innerHTML = '';

    // Recorrer la lista de menús y agregar un card por cada uno
    menus.forEach(menu => {
        const menuCard = document.createElement('div');
        menuCard.classList.add('menu-card');

        // Crear un campo para la cantidad
        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.value = 0; // Valor predeterminado de la cantidad
        inputCantidad.min = 0; // La cantidad mínima es 0
        inputCantidad.classList.add('cantidad-input');
        inputCantidad.dataset.precio = menu.Precio; // Almacenar el precio en un atributo de datos

        // Agregar un evento de cambio para actualizar el total
        inputCantidad.addEventListener('change', updateTotal);

        // Contenido de la tarjeta
        menuCard.innerHTML = `
            <h2>${menu.Nombre}</h2>
            <p><strong>Descripción:</strong> ${menu.Descripcion || 'Sin descripción'}</p>
            <p><strong>Precio:</strong> $${menu.Precio}</p>
        `;
        
        // Agregar el input de cantidad a la tarjeta
        menuCard.appendChild(inputCantidad);
        
        menuList.appendChild(menuCard);
    });
};

// Función para cargar datos al cargar la página
window.onload = function() {
    // Obtener los valores del localStorage
    var documento = localStorage.getItem('documento');
    console.log('Documento:', documento);
    var nombre = localStorage.getItem('nombre');
    console.log('Nombre:', nombre);

    // Obtener la fecha y la hora
    var fecha = today(); 
    var hora = now();

    // Asignar los valores al HTML
    document.getElementById("cliente-nombre").textContent = nombre || "Nombre no disponible"; 
    document.getElementById("fecha").textContent = fecha;
    document.getElementById("hora").textContent = hora;

    // Calcular el total inicial
    updateTotal();
}

// Función de fecha
function today() {
    var today = new Date();
    var day = today.getDate().toString().padStart(2, '0');
    var month = (today.getMonth() + 1).toString().padStart(2, '0');
    var year = today.getFullYear();
    return `${day}/${month}/${year}`;
}

// Función de hora
function now() {
    var currentDate = new Date();
    var hours = currentDate.getHours().toString().padStart(2, '0');
    var minutes = currentDate.getMinutes().toString().padStart(2, '0');
    var seconds = currentDate.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

// Función para actualizar el total a pagar
function updateTotal() {
    let totalPagar = 0;

    // Obtener todos los inputs de cantidad
    const cantidadInputs = document.querySelectorAll('.cantidad-input');

    // Recorrer cada input de cantidad
    cantidadInputs.forEach(input => {
        const cantidad = parseFloat(input.value) || 0; // Obtener la cantidad (convertir a número)
        const precio = parseFloat(input.dataset.precio) || 0; // Obtener el precio desde el atributo de datos

        // Calcular el subtotal para este ítem
        const subtotal = cantidad * precio;

        // Sumar al total general
        totalPagar += subtotal;
    });

    // Actualizar el total a pagar en el DOM
    document.getElementById('total-pagar').textContent = totalPagar.toFixed(2); // Mostrar con 2 decimales
}