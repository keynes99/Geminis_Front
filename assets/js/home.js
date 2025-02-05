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
            image: "../assets/images/restaurante2.jpg"
        },
        {
            id: "3",
            name: "Comida tradicional",
            logo: "../assets/images/logoRestaurante3.webp",
            description: "Comida tradicional de la región.",
            distance: "3.2 km",
            image: "../assets/images/restaurante3.jpg"
        },
        {
            id: "4",
            name: "Comida oriental",
            logo: "../assets/images/logoRestaurante4.webp",
            description: "Sabores auténticos del este asiático.",
            distance: "1.1 km",
            image: "../assets/images/restaurante4.jpg"
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

document.addEventListener("DOMContentLoaded", async () => {
    loadRestaurants();
});

(function ($) {
    $(document).ready(function () {
        function initOwlCarousel() {
            $(".carousel-container").owlCarousel("destroy"); // Destruir si ya está inicializado
            $(".carousel-container").owlCarousel({
                nav: true,
                dots: false,
                loop: true,
                margin: 30,
                stagePadding: 2,
                center: true,
                autoplay: false,
                navText: ["<i class=\"fa-solid fa-chevron-left\"></i>", "<i class=\"fa-solid fa-chevron-right\"></i>"],
                autoWidth: true,
                responsive: {
                    0: {
                        items: 1,
                        nav: false
                    },
                    
                    768: {
                        items: 2.6
                    },
                    992: {
                        items: 3
                    },
                    1200: {
                        items: 3.6,
                        center: false
                    }

                }
            });
        }

        initOwlCarousel(); // Inicializar el carrusel al cargar la página

        $(window).resize(function () {
            initOwlCarousel(); // Reinicializar al cambiar el tamaño de la ventana
        });
    });

})(jQuery);

function togglePricingPlans() {
    const isChecked = document.getElementById('color_mode').checked;
    const personalContainer = document.querySelector('.pricing-card-container-personal');
    const empresaContainer = document.querySelector('.pricing-card-container-empresa');

    if (isChecked) {
        personalContainer.style.display = 'none';
        empresaContainer.style.display = 'flex';
    } else {
        personalContainer.style.display = 'flex';
        empresaContainer.style.display = 'none';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('color_mode').addEventListener('change', togglePricingPlans);
    togglePricingPlans(); // Initialize the correct state on page load
});
// Ver Detalles del Plan
function openModal(planType) {
    const modal = document.getElementById("pricingModal");
    const modalTitle = document.getElementById("modal-title");
    const modalDescription = document.getElementById("modal-description");
    
    if (planType === "basic") {
        modalTitle.innerText = "Plan Básico";
        modalDescription.innerText = "Este plan incluye acceso a funciones básicas como X, Y, Z.";
    } else if (planType === "intermediate") {
        modalTitle.innerText = "Plan Intermedio";
        modalDescription.innerText = "Este plan incluye funciones básicas y soporte adicional, además de A, B, C.";
    } else if (planType === "advanced") {
        modalTitle.innerText = "Plan Avanzado";
        modalDescription.innerText = "Accede a todas las funciones y soporte premium, incluyendo D, E, F, G.";
    }
    
    modal.style.display = "flex";
}

function closeModal() {
    const modal = document.getElementById("pricingModal");
    modal.style.display = "none";
}
