document.addEventListener('DOMContentLoaded', async () => {
    const userDocument = localStorage.getItem('documento');
    const reservasList = document.querySelector('.reservas-list');
    const itemsPerPage = 4;
    let currentPage = 1;
    let reservations = [];

    const renderPage = (page) => {
        reservasList.innerHTML = '';
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedReservations = reservations.slice().reverse().slice(start, end);

        paginatedReservations.forEach(async (reservation) => {
            await createReservationCard(reservation);
        });

        document.getElementById('page-info').textContent = `Página ${page} de ${Math.ceil(reservations.length / itemsPerPage)}`;
    };

    const fetchReservations = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/reservas/usuario/${userDocument}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching reservations:', error);
            return [];
        }
    };

    const fetchRestaurantById = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/sedes/all/sedeid/${id}`);
            const item = await response.json();
            return {
                id: item.Rowid.toString(),
                name: item.EmpresaNombre,
                logo: item.UbicacionLogo,
                description: item.EmpresaDescripcion,
                distance: `${Math.floor(Math.random() * 10) + 1} km`, // Random distance
                image: item.Imagenes,
                direccion: item.Direccion,
                mesasDisponibles: item.MesasDisponibles,
                cantidadDePersonasPorMesa: item.CantidadDePersonasPorMesa,
                telefono: item.Telefono,
                horario: item.Horario,
                categoria: parseInt(item.EmpresaCategoria)
            };
        } catch (error) {
            console.error('Error fetching restaurant:', error);
            return null;
        }
    };

    const cancelReservation = async (reservationId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/reservas/cancelar/${reservationId}`, {
                method: 'PUT'
            });
            if (response.ok) {
                alert('La reserva ha sido cancelada satisfactoriamente');
                location.reload(); // Reload the page to reflect changes
            } else {
                alert('Error al cancelar la reserva');
            }
        } catch (error) {
            console.error('Error cancelling reservation:', error);
            alert('Error al cancelar la reserva');
        }
    };

    const createReservationCard = async (reservation) => {
        const restaurant = await fetchRestaurantById(reservation.Sede);
        const occasionMap = {
            1: 'Casual',
            2: 'Cumpleaños',
            3: 'Grado',
            4: 'Aniversario',
            5: 'Otro'
        };
        const statusMap = {
            1: 'Esperando confirmación del restaurante',
            2: 'Confirmada por el restaurante',
            3: 'Cancelada',
            4: 'Completada',
            5: 'El cliente nunca llegó'
        };

        const card = document.createElement('div');
        card.className = 'reservation-card';
        card.setAttribute('data-status', reservation.Estado); // Add data-status attribute
        card.innerHTML = `
            <h2>${restaurant.name}</h2>
            <img src="${restaurant.logo}" alt="Logo de ${restaurant.name}">
            <div class="card-content">
                <p><strong>Número de confirmación:</strong> ${reservation.NumeroDeConfirmacion}</p>
                <p><strong>Fecha:</strong> ${new Date(reservation.Fecha).toLocaleDateString()}</p>
                <p><strong>Hora:</strong> ${new Date('1970-01-01T' + reservation.Hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                <p><strong>Personas:</strong> ${reservation.Personas}</p>
                <p><strong>Ocasion:</strong> ${occasionMap[reservation.Ocasion]}</p>
                <p><strong>Estado:</strong> ${statusMap[reservation.Estado]}</p>
                <p><strong>Teléfono del cliente:</strong> ${reservation.Telefono}</p>
                <p><strong>Dirección del restaurante:</strong> ${restaurant.direccion}</p>
                <p><strong>Telefono del restaurante:</strong> ${restaurant.telefono}</p>
            </div>
        `;

        if (reservation.Estado === 1 || reservation.Estado === 2) {
            const cancelButton = document.createElement('button');
            cancelButton.className = 'cancel-button';
            cancelButton.textContent = 'Cancelar Reserva';
            cancelButton.addEventListener('click', async () => {
                const reservationTime = new Date(`${reservation.Fecha}T${reservation.Hora}`);
                const currentTime = new Date();
                const timeDifference = (reservationTime - currentTime) / (1000 * 60); // Difference in minutes

                if (timeDifference < 20) {
                    alert('Ya no es posible cancelar la reserva');
                } else {
                    const confirmCancel = confirm('¿Está seguro que desea cancelar esta reserva?');
                    if (confirmCancel) {
                        cancelReservation(reservation.Rowid);
                        // Decrease the number of available tables
                        try {
                            await fetch(`http://localhost:3000/api/sedes/${restaurant.id}/increaseMesas`, {
                                method: 'PUT'
                            });
                        } catch (error) {
                            console.error('Error increasing available tables:', error);
                            alert('Error al actualizar las mesas disponibles');
                        }
                    }
                }
            });

            card.appendChild(cancelButton);
        }
        reservasList.appendChild(card);
    };

    const applyFilters = () => {
        const confirmationFilter = document.getElementById('filter-confirmation').value.toLowerCase();
        const statusFilter = document.getElementById('filter-status').value;
        const occasionFilter = document.getElementById('filter-occasion').value;
        const dateFilter = document.getElementById('filter-date').value;

        const filteredReservations = reservations.filter(reservation => {
            const matchesConfirmation = confirmationFilter === '' || reservation.NumeroDeConfirmacion.toLowerCase().includes(confirmationFilter);
            const matchesStatus = statusFilter === '' || reservation.Estado.toString() === statusFilter;
            const matchesOccasion = occasionFilter === '' || reservation.Ocasion.toString() === occasionFilter;
            const matchesDate = dateFilter === '' || new Date(reservation.Fecha).toISOString().split('T')[0] === dateFilter;

            return matchesConfirmation && matchesStatus && matchesOccasion && matchesDate;
        });

        renderFilteredReservations(filteredReservations);
    };

    const renderFilteredReservations = (filteredReservations) => {
        reservasList.innerHTML = '';
        filteredReservations.slice().reverse().forEach(async (reservation) => {
            await createReservationCard(reservation);
        });
        document.getElementById('page-info').textContent = `Mostrando ${filteredReservations.length} reservas`;
    };

    const resetFilters = () => {
        document.getElementById('filter-confirmation').value = '';
        document.getElementById('filter-status').value = '';
        document.getElementById('filter-occasion').value = '';
        document.getElementById('filter-date').value = '';
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
        if (currentPage < Math.ceil(reservations.length / itemsPerPage)) {
            currentPage++;
            renderPage(currentPage);
        }
    });

    reservations = await fetchReservations();
    renderPage(currentPage);
});
