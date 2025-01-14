// Cargar los restaurantes (ficticios por ahora)
const loadRestaurants = () => {
    const carousel = document.getElementById('restaurant-carousel');
    const restaurants = [
        {
            name: "Restaurante El Buen Sabor",
            logo: "../assets/images/logoGeminis.png", // Logo del restaurante
            description: "Un lugar perfecto para disfrutar de comida casera.",
            distance: "2.5 km",
            image: "../assets/images/logoUnal.png", // Imagen del restaurante
            link: "restaurant.html"
        },
        {
            name: "Comida Rápida Express",
            logo: "../assets/images/logoGeminis.png", // Logo del restaurante
            description: "Comida rápida para disfrutar en familia.",
            distance: "5.0 km",
            image: "../assets/images/logoUnal.png", // Imagen del restaurante
            link: "restaurant.html"
        }
    ];

    restaurants.forEach((restaurant) => {
        const item = document.createElement('div');
        item.classList.add('carousel-item');
        item.innerHTML = `
            <img src="${restaurant.image}" alt="${restaurant.name}">
            <div class="restaurant-logo">
                <img src="${restaurant.logo}" alt="${restaurant.name}">
            </div>
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
