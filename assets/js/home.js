const loadRestaurants = () => {
    const carousel = document.getElementById('restaurant-carousel');
    const restaurants = [
        {
            id: "1", // Identificador único
            name: "Restaurante El Buen Sabor",
            logo: "../assets/images/logoRestaurante1.webp",
            description: "Un lugar perfecto para disfrutar de comida casera.",
            distance: "2.5 km",
            image: "../assets/images/restaurante.jpg"
        },
        {
            id: "2",
            name: "Comida Rápida Express",
            logo: "../assets/images/logoRestaurante2.webp",
            description: "Comida rápida para disfrutar en familia.",
            distance: "5.0 km",
            image: "../assets/images/restaurante.jpg"
        },
        {
            id: "3",
            name: "Comida tradicional",
            logo: "../assets/images/logoRestaurante3.webp",
            description: "Comida tradicional de la región.",
            distance: "3.2 km",
            image: "../assets/images/restaurante.jpg"
        },
        {
            id: "4",
            name: "Comida oriental",
            logo: "../assets/images/logoRestaurante4.webp",
            description: "Sabores auténticos del este asiático.",
            distance: "1.1 km",
            image: "../assets/images/restaurante.jpg"
        }
    ];

    restaurants.forEach((restaurant) => {
        const item = document.createElement('div');
        item.classList.add('carousel-item');
        item.innerHTML = `
            <div class="restaurant-logo">
                <img src="${restaurant.logo}" alt="logotipo de ${restaurant.name}">
            </div>
            <img class="restaurant-img" src="${restaurant.image}" alt="${restaurant.name}">
            <div class="restaurant-info">
                <h3>${restaurant.name}</h3>
                <p>${restaurant.description}</p>
                <p>Distancia: ${restaurant.distance}</p>
                <a href="restaurant.html?id=${restaurant.id}" class="secondary-btn">Ver Restaurante</a>
            </div>
        `;
        carousel.appendChild(item);
    });
};

loadRestaurants();
