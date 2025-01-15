// Cargar los restaurantes (ficticios por ahora)
const loadRestaurants = () => {
    const carousel = document.getElementById('restaurant-carousel');
    const restaurants = [
        {
            name: "Restaurante El Buen Sabor",
            logo: "../assets/images/logoRestaurante1.webp", // Logo del restaurante
            description: "Un lugar perfecto para disfrutar de comida casera.",
            distance: "2.5 km",
            image: "../assets/images/restaurante.jpg", // Imagen del restaurante
            link: "restaurant.html"
        },
        {
            name: "Comida Rápida Express",
            logo: "../assets/images/logoRestaurante2.webp", // Logo del restaurante
            description: "Comida rápida para disfrutar en familia.",
            distance: "5.0 km",
            image: "../assets/images/restaurante.jpg", // Imagen del restaurante
            link: "restaurant.html"
        },
        {
            name: "Comida tradicional",
            logo: "../assets/images/logoRestaurante3.webp", // Logo del restaurante
            description: "Comida rápida para disfrutar en familia.",
            distance: "5.0 km",
            image: "../assets/images/restaurante.jpg", // Imagen del restaurante
            link: "restaurant.html"
        },
        {
            name: "Comida oriental",
            logo: "../assets/images/logoRestaurante4.webp", // Logo del restaurante
            description: "Comida rápida para disfrutar en familia.",
            distance: "5.0 km",
            image: "../assets/images/restaurante.jpg", // Imagen del restaurante
            link: "restaurant.html"
        }
    ];

    restaurants.forEach((restaurant) => {
        const item = document.createElement('div');
        item.classList.add('carousel-item');
        item.innerHTML = `
            <div class="restaurant-logo">
                <img src="${restaurant.logo}" alt="logotipo de ${restaurant.name}">
            </div>
            <img class="restaurant-img" src="${restaurant.image}" alt=" ${restaurant.name}">
            <div class="restaurant-info">
                <h3>${restaurant.name}</h3>
                <p>${restaurant.description}</p>
                <p>Distancia: ${restaurant.distance}</p>
                <a href="${restaurant.link}" class="secondary-btn">Ver Menú</a>
            </div>
        `;
        carousel.appendChild(item);
    });
};

loadRestaurants();
