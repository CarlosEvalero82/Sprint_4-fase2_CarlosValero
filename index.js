document.addEventListener('DOMContentLoaded', () => {
    const apiURL = 'https://aulamindhub.github.io/amazing-api/events.json';
    const eventsContainer = document.getElementById('events-container');
    const searchInput = document.getElementById('search-input');
    const filtersContainer = document.getElementById('filters-container');

    let eventsData = [];
    let categories = new Set();

    // Función para obtener eventos desde la API
    function fetchEvents() {
        fetch(apiURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                eventsData = data.events;
                
                // Extraer categorías únicas
                eventsData.forEach(event => {
                    if (event.category) {
                        categories.add(event.category);
                    }
                });

                displayCategoryFilters();
                displayEvents(eventsData);
            })
            .catch(error => {
                console.error('Error fetching events:', error);
                eventsContainer.innerHTML = '<p>Error cargando los eventos.</p>';
            });
    }

    // Crea una tarjeta de evento HTML para mostrar en la página
    function createEventCard(event) {
        return `
          <div class="card m-1" style="width: 18rem;">
            <img src="${event.image}" class="card-img-top" alt="${event.name}" />
            <div class="card-body">
              <h5 class="card-title">${event.name}</h5>
              <p class="card-text">${event.description}</p>
              <a href="details.html?id=${event._id}" class="btn btn-primary">View Details</a>
            </div>
          </div>
        `;
    }

    // Muestra una lista de eventos en la página
    function displayEvents(events) {
        if (eventsContainer) {
            eventsContainer.innerHTML = ''; // Limpiar contenedor antes de mostrar eventos
            const eventsHtml = events.map(createEventCard).join('');
            eventsContainer.innerHTML = eventsHtml;
        }
    }

    // Genera los filtros de categoría para mostrar en la página
    function displayCategoryFilters() {
        if (filtersContainer) {
            const filtersHtml = Array.from(categories).map(category => `
              <div class="form-check form-check-inline">
                <input class="form-check-input filter-checkbox" type="checkbox" id="category-${category}" value="${category}" />
                <label class="form-check-label" for="category-${category}">${category}</label>
              </div>
            `).join('');
            filtersContainer.innerHTML = filtersHtml;
        }
    }

    // Filtra los eventos basándose en la búsqueda y las categorías seleccionadas
    function filterEvents() {
        const searchInputValue = searchInput.value.toLowerCase();
        const selectedCategories = Array.from(document.querySelectorAll('#filters-container input:checked')).map(input => input.value.toLowerCase());

        const filteredEvents = eventsData.filter(event => {
            const matchesSearch = event.name.toLowerCase().includes(searchInputValue) || event.description.toLowerCase().includes(searchInputValue);
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(event.category.toLowerCase());
            return matchesSearch && matchesCategory;
        });

        displayEvents(filteredEvents);
    }

    // Configura el comportamiento inicial de la página
    fetchEvents();

    if (searchInput) {
        searchInput.addEventListener('input', filterEvents);
    }

    if (filtersContainer) {
        filtersContainer.addEventListener('change', filterEvents);
    }
});