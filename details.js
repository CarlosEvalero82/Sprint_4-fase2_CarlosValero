// URL de la API de eventos
const apiURL = 'https://aulamindhub.github.io/amazing-api/events.json';

// Función para obtener los detalles del evento basado en el ID
async function fetchEventDetails(eventId) {
    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        const event = data.events.find(event => event._id == eventId); // Filtra el evento por ID
        if (event) {
            displayEventDetails(event);
        } else {
            console.error('Event not found');
            document.getElementById('event-details-container').innerHTML = '<p>Event not found.</p>';
        }
    } catch (error) {
        console.error('Error fetching event details:', error);
        document.getElementById('event-details-container').innerHTML = '<p>Error loading event details.</p>';
    }
}

// Muestra los detalles del evento en la página
function displayEventDetails(event) {
    document.getElementById('event-image').src = event.image || 'default-image.jpg';
    document.getElementById('event-title').textContent = event.name || 'No title available';
    document.getElementById('event-date').textContent = `Date: ${event.date || 'N/A'}`;
    document.getElementById('event-description').textContent = `Description: ${event.description || 'No description available'}`;
    document.getElementById('event-category').textContent = `Category: ${event.category || 'N/A'}`;
    document.getElementById('event-place').textContent = `Place: ${event.place || 'N/A'}`;
    document.getElementById('event-capacity').textContent = `Capacity: ${event.capacity || 'N/A'}`;
    document.getElementById('event-assistance').textContent = `Assistance: ${event.assistance || 'N/A'}`;
    document.getElementById('event-price').textContent = `Price: ${event.price || 'N/A'}`;
}

// Configura el comportamiento inicial de la página
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    if (eventId) {
        fetchEventDetails(eventId);
    } else {
        console.error('No event ID found in URL');
        document.getElementById('event-details-container').innerHTML = '<p>No event ID found in URL.</p>';
    }
});

// Función para volver a la página anterior
function goBack() {
    window.history.back();
}
