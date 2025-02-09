const fetchAndAddRestaurants = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/sedes/all');
        const data = await response.json();
        const newRestaurants = data.map(item => ({
            id: item.Rowid.toString(),
            name: item.EmpresaNombre,
            logo: item.UbicacionLogo,
            description: item.EmpresaDescripcion,
            distance: `${Math.floor(Math.random() * 10) + 1} km`, // Random distance
            image: item.Imagenes,
            direccion: item.Direccion,
            mesasDisponibles: item.MesasDisponibles,
            cantidadDePersonasPorMesa: item.CantidadDePersonasPorMesa,
            telefono: item.Telefono,
            horario: item.Horario,
            categoria: parseInt(item.EmpresaCategoria)
        }));
        return newRestaurants;
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        return [];
    }
};

const getRestaurantData = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get('id');

    if (!restaurantId) {
        // Manejar el caso donde no se proporciona un ID
        document.body.innerHTML = "<h1>Restaurante no encontrado</h1>";
        return;
    }

    const existingRestaurants = [
        {
            id: "100",
            name: "Restaurante El Buen Sabor",
            logo: "../assets/images/logoRestaurante1.webp",
            description: "Un lugar perfecto para disfrutar de comida casera.",
            distance: "2.5 km",
            image: "../assets/images/restaurante.jpg",
            direccion: "Calle 123, Ciudad",
            mesasDisponibles: 5,
            cantidadDePersonasPorMesa: 10,
            telefono: "123-456-7890",
            horario: "9:00 AM - 10:00 PM",
            categoria: 3
        },
        {
            id: "200",
            name: "Comida Rápida Express",
            logo: "../assets/images/logoRestaurante2.webp",
            description: "Comida rápida para disfrutar en familia.",
            distance: "5.0 km",
            image: "../assets/images/restaurante2.jpg",
            direccion: "Avenida 456, Ciudad",
            mesasDisponibles: 3,
            cantidadDePersonasPorMesa: 5,
            telefono: "098-765-4321",
            horario: "10:00 AM - 11:00 PM",
            categoria: 1
        },
        {
            id: "300",
            name: "Comida tradicional",
            logo: "../assets/images/logoRestaurante3.webp",
            description: "Comida tradicional de la región.",
            distance: "3.2 km",
            image: "../assets/images/restaurante3.jpg",
            direccion: "Calle 789, Ciudad",
            mesasDisponibles: 10,
            cantidadDePersonasPorMesa: 15,
            telefono: "456-789-0123",
            horario: "8:00 AM - 9:00 PM",
            categoria: 12
        },
        {
            id: "400",
            name: "Comida oriental",
            logo: "../assets/images/logoRestaurante4.webp",
            description: "Sabores auténticos del este asiático.",
            distance: "1.1 km",
            image: "../assets/images/restaurante4.jpg",
            direccion: "Avenida 101, Ciudad",
            mesasDisponibles: 20,
            cantidadDePersonasPorMesa: 25,
            telefono: "321-654-0987",
            horario: "11:00 AM - 12:00 AM",
            categoria: 10
        }
    ];

    const fetchedRestaurants = await fetchAndAddRestaurants();
    const restaurants = existingRestaurants.concat(fetchedRestaurants);
    const restaurant = restaurants.find(r => r.id === restaurantId);

    if (!restaurant) {
        document.body.innerHTML = "<h1>Restaurante no encontrado</h1>";
        return;
    }

    // Mostrar los datos del restaurante
    const container = document.getElementById('restaurant-details');
    container.innerHTML = `
        <div class="background-highlight"></div>
        <div class="background-highlight2"></div>
        <h1>${restaurant.name}</h1>
        <img class="restaurant-logo" src="${restaurant.logo}" alt="logotipo de ${restaurant.name}">
        <p class="descripcion">${restaurant.description}</p>  
        <img class="restaurant-img" src="${restaurant.image}" alt="Imagen de ${restaurant.name}">
        <p class="distancia">Dirección: ${restaurant.direccion}</p>
        <p class="telefono">Teléfono: ${restaurant.telefono}</p>

        <!-- Contenedor para los botones -->
        <div class="button-container">
            <a href="menu.html?id=${restaurant.id}" class="primary-btn">Ver Menú</a>
            <a href="CrearDomicilio.html?id=${restaurant.id}" class="primary-btn">Domicilio</a>
            <a href="reservas.html?id=${restaurant.id}" class="primary-btn">Reservar</a>
        </div>
    `;
};

// Llamar a la función para cargar los datos del restaurante
getRestaurantData();


// <p class="horario">Horario: ${restaurant.horario}</p>
//