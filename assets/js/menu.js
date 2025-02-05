const getRestaurantData = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get('id');

    if (!restaurantId) {
        document.body.innerHTML = "<h1>Restaurante no encontrado</h1>";
        return;
    } else {
        const restaurants = [
            { id: "1", name: "Restaurante El Buen Sabor", logo: "../assets/images/logoRestaurante1.webp", description: "Un lugar perfecto para disfrutar de comida casera.", distance: "2.5 km", image: "../assets/images/restaurante.jpg" },
            { id: "2", name: "Comida Rápida Express", logo: "../assets/images/logoRestaurante2.webp", description: "Comida rápida para disfrutar en familia.", distance: "5.0 km", image: "../assets/images/restaurante2.jpg" },
            { id: "3", name: "Comida tradicional", logo: "../assets/images/logoRestaurante3.webp", description: "Comida tradicional de la región.", distance: "5.0 km", image: "../assets/images/restaurante3.jpg" },
            { id: "4", name: "Comida oriental", logo: "../assets/images/logoRestaurante4.webp", description: "Sabores auténticos del este asiático.", distance: "5.0 km", image: "../assets/images/restaurante4.jpg" }
        ];

        const menus = [
            { id: "1", menu: [{ img:"../assets/images/img-pizza1.webp", nombre: "Margarita", descripcion: "Pizza clásica con queso mozzarella y albahaca", precio: 39000, tipo: "Vegetariano" }, { img:"../assets/images/img-pizza1.webp", nombre: "Pepperoni", descripcion: "Pizza con rodajas de pepperoni y queso extra", precio: 39000, tipo: "Carnes" }] },
            { id: "2", menu: [{ img:"../assets/images/img-pizza1.webp", nombre: "Classic Burger", descripcion: "Hamburguesa con carne de res, lechuga, tomate y queso cheddar", precio: 25000, tipo: "Carnes" }, { img:"../assets/images/img-pizza1.webp", nombre: "Veggie Delight", descripcion: "Hamburguesa vegetariana con guacamole y queso suizo", precio: 28000, tipo: "Vegetariano" }] },
            {
                id: "3",

                menu: [
                    {img:"../assets/images/img-pizza1.webp", nombre: "Taco de Carnitas", descripcion: "Taco con cerdo desmenuzado y salsa verde", precio: 18900, tipo: "Carnes" },
                    {img:"../assets/images/img-pizza1.webp", nombre: "Taco de Pollo", descripcion: "Taco con pollo a la parrilla y salsa roja", precio: 20000, tipo: "Aves" },
                    {img:"../assets/images/img-pizza1.webp", nombre: "Taco Vegetariano", descripcion: "Taco con frijoles negros, aguacate y pico de gallo", precio: 18000, tipo: "Vegetariano" },
                    {img:"../assets/images/img-pizza1.webp", nombre: "Taco de Pescado", descripcion: "Taco con pescado empanizado y crema de chipotle", precio: 20900, tipo: "Mariscos" }
                ]
            },
            // Restaurante 4
            {
                id: "4",

                menu: [
                    {img:"../assets/images/img-pizza1.webp", nombre: "California Roll", descripcion: "Rollo de sushi con aguacate, cangrejo y pepino", precio: 32990, tipo: "Mariscos" },
                    {img:"../assets/images/img-pizza1.webp", nombre: "Salmon Nigiri", descripcion: "Arroz de sushi cubierto con salmón fresco", precio: 29900, tipo: "Mariscos" },
                    {img:"../assets/images/img-pizza1.webp", nombre: "Veggie Roll", descripcion: "Rollo de sushi con zanahoria, pepino y aguacate", precio: 20000, tipo: "Vegetariano" },
                    {img:"../assets/images/img-pizza1.webp", nombre: "Dragon Roll", descripcion: "Rollo de sushi con camarón tempura y aguacate", precio: 28900, tipo: "Mariscos" }
                ]
            },          
            // Restaurante 5
            {
                id: "5",

                menu: [
                    {img:"../assets/images/img-pizza1.webp", nombre: "Spaghetti Bolognese", descripcion: "Espagueti con salsa de carne y tomate", precio: 49900, tipo: "Carnes" },
                    {img:"../assets/images/img-pizza1.webp", nombre: "Fettuccine Alfredo", descripcion: "Pasta con salsa cremosa de queso y mantequilla", precio: 44900, tipo: "Vegetariano" },
                    {img:"../assets/images/img-pizza1.webp", nombre: "Penne Arrabbiata", descripcion: "Pasta con salsa de tomate picante", precio: 41900, tipo: "Vegetariano" },
                    {img:"../assets/images/img-pizza1.webp", nombre: "Lasagna", descripcion: "Capas de pasta, carne molida y queso gratinado", precio: 52900, tipo: "Carnes" }
                ]
            },
            // Restaurante 6
            {
                id: "6",

                menu: [
                    {img:"../assets/images/img-pizza1.webp", nombre: "Acai Bowl", descripcion: "Tazón con acai, frutas frescas y granola", precio: 35900, tipo: "Vegetariano" },
                    {img:"../assets/images/img-pizza1.webp", nombre: "Quinoa Salad", descripcion: "Ensalada de quinoa con aguacate, pepino y limón", precio: 30900, tipo: "Vegetariano" },
                    {img:"../assets/images/img-pizza1.webp", nombre: "Chicken Bowl", descripcion: "Tazón con pollo a la parrilla, arroz integral y vegetales", precio: 39900, tipo: "Aves" },
                    {img:"../assets/images/img-pizza1.webp", nombre: "Shrimp Bowl", descripcion: "Tazón con camarones, espinaca y aderezo asiático", precio: 44900, tipo: "Mariscos" }
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

            </div>
            <div class="menu">
                ${menu.menu.map(item => `
                    <div class="card">
                        <div class="menu-item">
                            <img class="item-img" src="${item.img}" alt="imagen de ${item.nombre}">
                            <h2 class="menu-name">${item.nombre}</h2>
                            <p class="menu-description">${item.descripcion}</p>
                            <p class="menu-price">$${item.precio}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

    }
};

// Llamar a la función para cargar los datos del restaurante
getRestaurantData();
