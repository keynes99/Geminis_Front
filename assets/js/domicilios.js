// Función para obtener los domicilios de un usuario
const getDomicilios = async (userId) => {
    try {
        const token = localStorage.getItem('token'); // Obtener el token del localStorage
        const response = await fetch(`http://localhost:3000/api/domicilio/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}` // Agregar el encabezado de autorización
            }
        });

        if (response.ok) {
            const domicilios = await response.json();
            renderDomicilios(domicilios);
        } else {
            throw new Error('No se encontraron domicilios');
        }
    } catch (error) {
        console.error('Error al obtener los domicilios:', error);
    }
};

// Función para renderizar los domicilios en el HTML
const renderDomicilios = (domicilios) => {
    const domiciliosList = document.querySelector('.domicilios-list');
    
    // Limpiar la lista de domicilios antes de agregar los nuevos
    domiciliosList.innerHTML = '';

    // Recorrer la lista de domicilios y agregar un card por cada uno
    domicilios.forEach(domicilio => {
        const domicilioCard = document.createElement('div');
        domicilioCard.classList.add('domicilio-card');

        // Aplicar la clase de estado según el valor de 'Estado'
        let estadoClass = '';
        switch (domicilio.Estado) {
            case 1:
                estadoClass = 'estado-pendiente'; // Rojo
                break;
            case 2:
                estadoClass = 'estado-entregando'; // Amarillo
                break;
            case 3:
                estadoClass = 'estado-entregado'; // Verde
                break;
            default:
                estadoClass = '';
        }

        // Formatear la fecha
        const fecha = new Date(domicilio.Fecha);
        const fechaFormateada = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}`;
        
        // Asegurarse de que la hora esté en formato correcto
        const horaString = domicilio.Hora;  // Por ejemplo: "15:08:00"
        const hora = new Date(`1970-01-01T${horaString}`);  // Eliminamos 'Z' para evitar la conversión a UTC
        const horaFormateada = `${hora.getHours().toString().padStart(2, '0')}:${hora.getMinutes().toString().padStart(2, '0')}`;

        // Agregar la clase de estado al card
        domicilioCard.classList.add(estadoClass);

        // Contenido de la tarjeta
        domicilioCard.innerHTML = `
            <h2>Pedido #${domicilio.NumeroDomicilio}</h2>
            <p><strong>Cliente:</strong> ${domicilio.Empresa}</p>
            <p><strong>Cliente:</strong> ${domicilio.NombreCompleto}</p>
            <p><strong>Dirección:</strong> ${domicilio.DireccionEntrega}</p>
            <p><strong>Hora:</strong> ${horaFormateada}</p>
            <p><strong>Fecha:</strong> ${fechaFormateada}</p>
            <p><strong>Estado:</strong> ${domicilio.Estado === 1 ? 'Pendiente' : domicilio.Estado === 2 ? 'Entregando' : 'Entregado'}</p>
            <button class="priamry-btn" data-domicilio-id="${domicilio.Rowid}">Ver Detalles</button>
        `;

        domiciliosList.appendChild(domicilioCard);
    });

    // Agregar evento a los botones "Ver Detalles"
    document.querySelectorAll('.priamry-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const domicilioId = event.target.getAttribute('data-domicilio-id');
            window.location.href = `detalleDomicilio.html?id=${domicilioId}`; // Redirigir a la pantalla de detalles
        });
    });
};

// Llamar a la función para obtener los domicilios al cargar la página
getDomicilios(localStorage.getItem('documento'));