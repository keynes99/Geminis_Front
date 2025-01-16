// Obtener los parámetros de la URL
const getRestaurantData = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get('id');

    if (!restaurantId) {
        // Manejar el caso donde no se proporciona un ID
        document.body.innerHTML = "<h1>Restaurante no encontrado</h1>";
        return;
    }

    // Datos de los restaurantes
    const restaurants = [
        {
            id: "123",
            name: "Restaurante El Buen Sabor",
            logo: "../assets/images/logoRestaurante1.webp",
            description: "Un lugar perfecto para disfrutar de comida casera.",
            distance: "2.5 km",
            image: "../assets/images/restaurante.jpg"
        },
        {
            id: "234",
            name: "Comida Rápida Express",
            logo: "../assets/images/logoRestaurante2.webp",
            description: "Comida rápida para disfrutar en familia.",
            distance: "5.0 km",
            image: "../assets/images/restaurante.jpg"
        },
        {
            id: "345",
            name: "Comida tradicional",
            logo: "../assets/images/logoRestaurante3.webp",
            description: "Comida tradicional de la región.",
            distance: "3.2 km",
            image: "../assets/images/restaurante.jpg"
        },
        {
            id: "456",
            name: "Comida oriental",
            logo: "../assets/images/logoRestaurante4.webp",
            description: "Sabores auténticos del este asiático.",
            distance: "1.1 km",
            image: "../assets/images/restaurante.jpg"
        }
    ];

    // Buscar el restaurante correspondiente
    const restaurant = restaurants.find((r) => r.id === restaurantId);

    if (!restaurant) {
        document.body.innerHTML = "<h1>Restaurante no encontrado</h1>";
        return;
    }

    // Mostrar los datos del restaurante
    const container = document.getElementById('restaurant-details');
    container.innerHTML = `
            <div class="background-highlight"></div>
            <h1>${restaurant.name}</h1>
            <img class="restaurant-logo" src="${restaurant.logo}" alt="logotipo de ${restaurant.name}">
            <p class="descripcion">${restaurant.description}</p>  
            <img class="restaurant-img" src="${restaurant.image}" alt="Imagen de ${restaurant.name}">
            <p class="distancia">Distancia: ${restaurant.distance}</p>
            <a href="menu.html?id=${restaurant.id}" class="secondary-btn">Ver Menú</a>
        
        
    `;
};

// Llamar a la función para cargar los datos del restaurante
getRestaurantData();
