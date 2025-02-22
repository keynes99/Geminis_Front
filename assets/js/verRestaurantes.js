document.addEventListener('DOMContentLoaded', async () => {
    const filterBar = document.querySelector('.filter-bar');
    const restaurantsList = document.querySelector('.restaurants-list');
    const itemsPerPage = 4;
    let currentPage = 1;
    let restaurants = [];

    const fetchRestaurants = async () => {
        try {
            const response = await fetch(`${configURL1.baseUrl}/api/sedes/all`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            return [];
        }
    };

    const renderPage = (page) => {
        restaurantsList.innerHTML = '';
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedRestaurants = restaurants.slice(start, end);

        paginatedRestaurants.forEach((restaurant) => {
            createRestaurantCard(restaurant);
        });

        document.getElementById('page-info').textContent = `Página ${page} de ${Math.ceil(restaurants.length / itemsPerPage)}`;
    };

    const createRestaurantCard = (restaurant) => {
        const card = document.createElement('div');
        card.className = 'restaurant-card';
        card.innerHTML = `
            <div class="restaurant-logo">
                <img src="${restaurant.UbicacionLogo}" alt="Logo de ${restaurant.EmpresaNombre}">
            </div>
            <img class="restaurant-img" src="${restaurant.Imagenes}" alt="${restaurant.EmpresaNombre}">
            <div class="restaurant-info">
                <h3>${restaurant.EmpresaNombre}</h3>
                <p>${restaurant.EmpresaDescripcion}</p>
                <p>Dirección: ${restaurant.Direccion}</p>
                <a href="restaurant.html?id=${restaurant.Rowid}" class="primary-btn">Ver Restaurante</a>
            </div>
        `;
        restaurantsList.appendChild(card);
    };

    const applyFilters = () => {
        const nameFilter = document.getElementById('filter-name').value.toLowerCase();
        const categoryFilter = document.getElementById('filter-category').value;
        const addressFilter = document.getElementById('filter-address').value.toLowerCase();

        const filteredRestaurants = restaurants.filter(restaurant => {
            const matchesName = nameFilter === '' || restaurant.EmpresaNombre.toLowerCase().includes(nameFilter);
            const matchesCategory = categoryFilter === '' || restaurant.EmpresaCategoria.toString() === categoryFilter;
            const matchesAddress = addressFilter === '' || restaurant.Direccion.toLowerCase().includes(addressFilter);

            return matchesName && matchesCategory && matchesAddress;
        });

        renderFilteredRestaurants(filteredRestaurants);
    };

    const renderFilteredRestaurants = (filteredRestaurants) => {
        restaurantsList.innerHTML = '';
        filteredRestaurants.forEach((restaurant) => {
            createRestaurantCard(restaurant);
        });
        document.getElementById('page-info').textContent = `Mostrando ${filteredRestaurants.length} restaurantes`;
    };

    const resetFilters = () => {
        document.getElementById('filter-name').value = '';
        document.getElementById('filter-category').value = '';
        document.getElementById('filter-address').value = '';
        renderPage(currentPage);
    };

    document.getElementById('apply-filters').addEventListener('click', applyFilters);
    document.getElementById('reset-filters').addEventListener('click', resetFilters);

    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        if (currentPage < Math.ceil(restaurants.length / itemsPerPage)) {
            currentPage++;
            renderPage(currentPage);
        }
    });

    restaurants = await fetchRestaurants();
    renderPage(currentPage);
});
