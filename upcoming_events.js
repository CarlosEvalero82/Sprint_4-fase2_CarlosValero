// Fetch the event data from the API
async function fetchEventData() {
  try {
    const response = await fetch('https://aulamindhub.github.io/amazing-api/events.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch event data:', error);
    return { events: [] }; // Return empty events if there's an error
  }
}

// Store the data globally
let eventData = { currentDate: "2023-01-01", events: [] };

// Initialize the application
document.addEventListener("DOMContentLoaded", async () => {
  eventData = await fetchEventData();
  
  displayEvents(eventData.events.filter(event => new Date(event.date) >= new Date(eventData.currentDate)));

  document.getElementById('search-form').addEventListener('submit', event => {
    event.preventDefault();
    applyFilters();
  });

  document.querySelectorAll('#filters-container input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', applyFilters);
  });
});
function createEventCard(event) {
  return `
    <div class="card m-1" onclick="showEventDetails('${event._id}')">
      <img src="${event.image}" class="card-img-top" alt="${event.name}" />
      <div class="card-body">
        <h5 class="card-title">${event.name}</h5>
        <p class="card-text">${event.description}</p>
        <a href="javascript:void(0)" class="btn btn-primary">More Info</a>
      </div>
    </div>
  `;
}

function displayEvents(filteredEvents) {
  const eventsContainer = document.getElementById("events-container");
  eventsContainer.innerHTML = '';
  filteredEvents.forEach(event => {
    eventsContainer.innerHTML += createEventCard(event);
  });
}

function applyFilters() {
  const selectedCategories = Array.from(document.querySelectorAll('#filters-container input[type="checkbox"]:checked'))
    .map(checkbox => checkbox.dataset.category);

  const searchQuery = document.getElementById('search-input').value.toLowerCase();

  const filteredEvents = eventData.events.filter(event => {
    const eventDate = new Date(event.date);
    const isAfterDate = eventDate >= new Date(eventData.currentDate);
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(event.category);
    const matchesSearch = event.name.toLowerCase().includes(searchQuery) || event.description.toLowerCase().includes(searchQuery);

    return isAfterDate && matchesCategory && matchesSearch;
  });

  displayEvents(filteredEvents);
}

function showEventDetails(eventId) {
  const event = eventData.events.find(e => e._id === eventId);
  const eventDetailsContainer = document.getElementById('event-details');
  if (event) {
    eventDetailsContainer.innerHTML = `
      <div class="card">
        <img src="${event.image}" class="card-img-top" alt="${event.name}" />
        <div class="card-body">
          <h5 class="card-title">${event.name}</h5>
          <p class="card-text">${event.description}</p>
          <ul>
            <li>Date: ${event.date}</li>
            <li>Category: ${event.category}</li>
            <li>Place: ${event.place}</li>
            <li>Capacity: ${event.capacity}</li>
            <li>Price: $${event.price}</li>
          </ul>
          <button class="btn btn-secondary" onclick="hideEventDetails()">Back</button>
        </div>
      </div>
    `;
    eventDetailsContainer.style.display = 'block';
    document.getElementById('events-container').style.display = 'none';
  } else {
    eventDetailsContainer.innerHTML = '<p>Event not found.</p>';
  }
}

function hideEventDetails() {
  document.getElementById('event-details').style.display = 'none';
  document.getElementById('events-container').style.display = 'flex';
}
