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

const loadRestaurants = async () => {
    const carousel = document.getElementById('restaurant-carousel');
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
        },
        {
            id: "401",
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
                <p>Dirección: ${restaurant.direccion}</p>
                <a href="restaurant.html?id=${restaurant.id}" class="primary-btn">Ver Restaurante</a>
            </div>
        `;

        carousel.appendChild(item);
    });

    initOwlCarousel(); // Initialize the carousel after loading restaurants
};

document.addEventListener("DOMContentLoaded", async () => {
    await loadRestaurants();
});

document.addEventListener("DOMContentLoaded", () => {
        function initOwlCarousel() {
            $(".carousel-container").owlCarousel("destroy"); // Destruir si ya está inicializado
            $(".carousel-container").owlCarousel({
                nav: true,
                dots: false,
                loop: true,
                margin: 30,
                stagePadding: 2,
                center: false,
                autoplay: false,
                navText: ["<i class=\"fa-solid fa-chevron-left\"></i>", "<i class=\"fa-solid fa-chevron-right\"></i>"],
                autoWidth: true,
                responsive: {
                    0: {
                        items: 1,
                        nav: false,
                        dots: true
                    },
                    768: {
                        items: 2.6,
                        nav: true
                    },
                    992: {
                        items: 3
                    },
                    1200: {
                        items: 3.6
                    }, 
                    1400:{
                        items: 4
                    }
                },
                onInitialized: function () {
                    limitOwlDots(6); // Límite de dots visibles
                },
                onResized: function () {
                    limitOwlDots(6);
                     // Asegurar que el límite se mantenga al redimensionar

                }
            });
        }

        function limitOwlDots(maxDots) {
            let dots = $(".carousel-container .owl-dots .owl-dot");
            if (dots.length > maxDots) {
                dots.hide().slice(0, maxDots).show(); // Oculta todos y solo muestra los primeros `maxDots`
            }
        }

        window.initOwlCarousel = initOwlCarousel; // Make initOwlCarousel globally accessible

        initOwlCarousel(); // Inicializar el carrusel al cargar la página

        window.addEventListener('resize', function (){
            initOwlCarousel(); // Reinicializar al cambiar el tamaño de la ventana
        });
    });


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

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
        localStorage.setItem('token', token);

        // Obtener la información del usuario usando el token
        fetch('http://localhost:3000/api/auth/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.user) {
                let userName = data.user.Nombres + ' ' + data.user.Apellido;
                localStorage.setItem('nombre', userName); // Guardar el nombre del usuario
                localStorage.setItem('documento', data.user.Documento); // Guardar el documento del usuario
                localStorage.setItem('empresa', data.user.Empresa); // Guardar la empresa del usuario
                // Redirigir a la página de inicio sin el token en la URL
                window.location.href = 'home.html';
            }
        })
        .catch(error => {
            console.error('Error al obtener la información del usuario:', error);
        });
    }
});
