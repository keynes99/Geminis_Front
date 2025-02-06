// Función para obtener los detalles de un domicilio
const getDetalleDomicilio = async (domicilioId) => {
    try {
        const token = localStorage.getItem('token'); // Obtener el token del localStorage
        const response = await fetch(`http://localhost:3000/api/domicilio/detalle/${domicilioId}`, {
            headers: {
                'Authorization': `Bearer ${token}` // Agregar el encabezado de autorización
            }
        });

        if (response.ok) {
            const domicilio = await response.json();
            renderDetalleDomicilio(domicilio);
        } else {
            throw new Error('No se pudo obtener el detalle del domicilio');
        }
    } catch (error) {
        console.error('Error al obtener el detalle del domicilio:', error);
    }
};

// Función para renderizar los detalles del domicilio en el HTML
const renderDetalleDomicilio = (domicilio) => {
    const domicilioDetalle = document.getElementById('domicilio-detalle');

    // Formatear la fecha
    const fecha = new Date(domicilio.Fecha);
    const fechaFormateada = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}`;
    
    // Asegurarse de que la hora esté en formato correcto
    const horaString = domicilio.Hora;  // Por ejemplo: "15:08:00"
    const hora = new Date(`1970-01-01T${horaString}`);  // Eliminamos 'Z' para evitar la conversión a UTC
    const horaFormateada = `${hora.getHours().toString().padStart(2, '0')}:${hora.getMinutes().toString().padStart(2, '0')}`;
    
    // Contenido de los detalles del domicilio
    domicilioDetalle.innerHTML = `
        <div class="domicilio-card">
            <h2>Pedido #${domicilio.NumeroDomicilio}</h2>
            <p><strong>Dirección:</strong> ${domicilio.DireccionEntrega}</p>
            <p><strong>Hora:</strong> ${horaFormateada}</p>
            <p><strong>Fecha:</strong> ${fechaFormateada}</p>
            <p><strong>Estado:</strong> ${domicilio.Estado === 1 ? 'Pendiente' : domicilio.Estado === 2 ? 'Entregando' : 'Entregado'}</p>
            <h3>Items:</h3>
            <ul id="menu-list">
                ${domicilio.menus.map(menu => `
                    <li>${menu.Nombre} - Cantidad: ${menu.Cantidad} - Valor: $${menu.Valor}</li>
                `).join('')}
            </ul>
        </div>
    `;
};

// Obtener el ID del domicilio desde la URL
const params = new URLSearchParams(window.location.search);
const domicilioId = params.get('id');

// Llamar a la función para obtener los detalles del domicilio al cargar la página
if (domicilioId) {
    getDetalleDomicilio(domicilioId);
} else {
    console.error('No se encontró el ID del domicilio en la URL');
}