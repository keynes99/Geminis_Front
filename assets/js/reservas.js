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
            mesasTotales: item.MesasTotales,
            mesasDisponibles: item.MesasDisponibles,
            reservasMaximas: item.ReservasMaximas,
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
            mesasTotales: 20,
            mesasDisponibles: 5,
            reservasMaximas: 10,
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
            mesasTotales: 15,
            mesasDisponibles: 3,
            reservasMaximas: 5,
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
            mesasTotales: 25,
            mesasDisponibles: 10,
            reservasMaximas: 15,
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
            mesasTotales: 30,
            mesasDisponibles: 20,
            reservasMaximas: 25,
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
    const container = document.getElementById('restaurante');
    container.placeholder = restaurant.name;
    container.setAttribute('disabled', 'disabled');

};

// Llamar a la función para cargar los datos del restaurante
getRestaurantData();