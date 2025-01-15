const getRestaurantData = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get('id');

    if (!restaurantId) {
        document.body.innerHTML = "<h1>Restaurante no encontrado</h1>";
        return;
    } else {
        const restaurants = [
            { id: "123", name: "Restaurante El Buen Sabor", logo: "../assets/images/logoRestaurante1.webp", description: "Un lugar perfecto para disfrutar de comida casera.", distance: "2.5 km", image: "../assets/images/restaurante.jpg" },
            { id: "234", name: "Comida Rápida Express", logo: "../assets/images/logoRestaurante2.webp", description: "Comida rápida para disfrutar en familia.", distance: "5.0 km", image: "../assets/images/restaurante.jpg" },
            { id: "345", name: "Comida tradicional", logo: "../assets/images/logoRestaurante3.webp", description: "Comida tradicional de la región.", distance: "5.0 km", image: "../assets/images/restaurante.jpg" },
            { id: "456", name: "Comida oriental", logo: "../assets/images/logoRestaurante4.webp", description: "Sabores auténticos del este asiático.", distance: "5.0 km", image: "../assets/images/restaurante.jpg" }
        ];

        const menus = [
            { id: "123", menu: [{ nombre: "Margarita", descripcion: "Pizza clásica con queso mozzarella y albahaca", precio: 8.99, tipo: "Vegetariano" }, { nombre: "Pepperoni", descripcion: "Pizza con rodajas de pepperoni y queso extra", precio: 10.99, tipo: "Carnes" }] },
            { id: "234", menu: [{ nombre: "Classic Burger", descripcion: "Hamburguesa con carne de res, lechuga, tomate y queso cheddar", precio: 9.99, tipo: "Carnes" }, { nombre: "Veggie Delight", descripcion: "Hamburguesa vegetariana con guacamole y queso suizo", precio: 8.49, tipo: "Vegetariano" }] },
            {
                id: "345",

                menu: [
                    { nombre: "California Roll", descripcion: "Rollo de sushi con aguacate, cangrejo y pepino", precio: 12.99, tipo: "Mariscos" },
                    { nombre: "Salmon Nigiri", descripcion: "Arroz de sushi cubierto con salmón fresco", precio: 10.99, tipo: "Mariscos" },
                    { nombre: "Veggie Roll", descripcion: "Rollo de sushi con zanahoria, pepino y aguacate", precio: 9.49, tipo: "Vegetariano" },
                    { nombre: "Dragon Roll", descripcion: "Rollo de sushi con camarón tempura y aguacate", precio: 14.99, tipo: "Mariscos" }
                ]
            },
            // Restaurante 4
            {
                id: "456",

                menu: [
                    { nombre: "Taco de Carnitas", descripcion: "Taco con cerdo desmenuzado y salsa verde", precio: 3.99, tipo: "Carnes" },
                    { nombre: "Taco de Pollo", descripcion: "Taco con pollo a la parrilla y salsa roja", precio: 3.49, tipo: "Aves" },
                    { nombre: "Taco Vegetariano", descripcion: "Taco con frijoles negros, aguacate y pico de gallo", precio: 3.29, tipo: "Vegetariano" },
                    { nombre: "Taco de Pescado", descripcion: "Taco con pescado empanizado y crema de chipotle", precio: 4.49, tipo: "Mariscos" }
                ]
            },
            // Restaurante 5
            {
                id: "567",

                menu: [
                    { nombre: "Spaghetti Bolognese", descripcion: "Espagueti con salsa de carne y tomate", precio: 13.99, tipo: "Carnes" },
                    { nombre: "Fettuccine Alfredo", descripcion: "Pasta con salsa cremosa de queso y mantequilla", precio: 12.49, tipo: "Vegetariano" },
                    { nombre: "Penne Arrabbiata", descripcion: "Pasta con salsa de tomate picante", precio: 11.49, tipo: "Vegetariano" },
                    { nombre: "Lasagna", descripcion: "Capas de pasta, carne molida y queso gratinado", precio: 14.99, tipo: "Carnes" }
                ]
            },
            // Restaurante 6
            {
                id: "678",

                menu: [
                    { nombre: "Acai Bowl", descripcion: "Tazón con acai, frutas frescas y granola", precio: 9.99, tipo: "Vegetariano" },
                    { nombre: "Quinoa Salad", descripcion: "Ensalada de quinoa con aguacate, pepino y limón", precio: 8.49, tipo: "Vegetariano" },
                    { nombre: "Chicken Bowl", descripcion: "Tazón con pollo a la parrilla, arroz integral y vegetales", precio: 10.99, tipo: "Aves" },
                    { nombre: "Shrimp Bowl", descripcion: "Tazón con camarones, espinaca y aderezo asiático", precio: 12.49, tipo: "Mariscos" }
                ]
            }
        ];

        const restaurant = restaurants.find((r) => r.id === restaurantId);
        const menu = menus.find((m) => m.id === restaurantId);
        if (!restaurant) {
            document.body.innerHTML = "<h1>Restaurante no encontrado</h1>";
            return;
        }

        const container = document.getElementById('menu-items');
        container.innerHTML = `
            <div class="restaurante-info">
                <h1>${restaurant.name}</h1>
                <img class="restaurant-logo" src="${restaurant.logo}" alt="logotipo de ${restaurant.name}">
                <p class="descripcion">${restaurant.description}</p>
            </div>
            <div class="menu">
                ${menu.menu.map(item => `
                    <div class="menu-item">
                        <img class="restaurant-logo" src="${item.img}" alt="imagen de ${item.nombre}">
                        <h2 class="menu-name">${item.nombre}</h2>
                        <p class="menu-description">${item.descripcion}</p>
                        <p class="menu-price">$${item.precio}</p>
                    </div>
                `).join('')}
            </div>
        `;

    }
};

// Llamar a la función para cargar los datos del restaurante
getRestaurantData();
