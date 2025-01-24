// Función para crear un domicilio
const createDomicilio = async (sedeId, documentoUsuario, direccionEntrega, tipoPago, numeroDomicilio) => {
    try {
        const response = await fetch(`http://localhost:3000/api/domicilio/${sedeId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
        const response = await fetch(`http://localhost:3000/api/domicilio/Menus/${sedeId}`);
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
        inputCantidad.min = 0; // La cantidad mínima es 1
        inputCantidad.classList.add('cantidad-input');

        // Crear un botón para agregar el menú al domicilio
        const buttonAgregar = document.createElement('button');
        buttonAgregar.textContent = 'Agregar al Domicilio';
        buttonAgregar.classList.add('add-to-cart-btn');

        // Acción al hacer clic en el botón "Agregar al Domicilio"
        buttonAgregar.addEventListener('click', () => {
            const cantidad = inputCantidad.value;
            addMenuToDomicilio(menu, cantidad); // Llamar a la función para agregar el menú con la cantidad
        });

        // Contenido de la tarjeta
        menuCard.innerHTML = `
            <h2>${menu.Nombre}</h2>
            <p><strong>Descripción:</strong> ${menu.Descripcion || 'Sin descripción'}</p>
            <p><strong>Precio:</strong> $${menu.Precio}</p>
        `;
        
        // Agregar el input de cantidad y el botón a la tarjeta
        menuCard.appendChild(inputCantidad);
        
        menuList.appendChild(menuCard);
    });
};
