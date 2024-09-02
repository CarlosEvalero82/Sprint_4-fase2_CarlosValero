// stats.js

// Función para obtener los datos de la API
async function fetchData() {
    try {
      // Intentar hacer una solicitud a la API para obtener los datos
      const response = await fetch('https://aulamindhub.github.io/amazing-api/events.json');
      // Convertir la respuesta de la API en formato JSON
      const data = await response.json();
      // Devolver los datos obtenidos
      return data;
    } catch (error) {
      // Capturar y mostrar errores si ocurre algún problema durante la solicitud
      console.error('Error fetching data:', error);
      return null; // Si ocurre un error, devolver null
    }
  }
  
  // Función para calcular estadísticas basadas en los eventos
  function calculateStatistics(events) {
    // Objeto para almacenar las estadísticas
    const stats = {
      highestAttendance: { name: '', percentage: 0 }, // Evento con mayor porcentaje de asistencia
      lowestAttendance: { name: '', percentage: 100 }, // Evento con menor porcentaje de asistencia
      largestCapacity: { name: '', capacity: 0 }, // Evento con mayor capacidad
      upcomingByCategory: {}, // Estadísticas de eventos futuros por categoría
      pastByCategory: {} // Estadísticas de eventos pasados por categoría
    };
  
    // Obtener la fecha actual
    const currentDate = new Date();
  
    // Objetos para almacenar estadísticas por categoría para eventos futuros y pasados
    const upcomingCategories = {};
    const pastCategories = {};
  
    // Iterar sobre cada evento para calcular las estadísticas
    events.forEach(event => {
      // Calcular el porcentaje de asistencia basado en la capacidad
      const attendancePercentage = (event.assistance / event.capacity) * 100;
  
      // Actualizar el evento con mayor asistencia si el actual tiene mayor porcentaje
      if (attendancePercentage > stats.highestAttendance.percentage) {
        stats.highestAttendance = { name: event.name, percentage: attendancePercentage };
      }
      // Actualizar el evento con menor asistencia si el actual tiene menor porcentaje
      if (attendancePercentage < stats.lowestAttendance.percentage) {
        stats.lowestAttendance = { name: event.name, percentage: attendancePercentage };
      }
  
      // Actualizar el evento con mayor capacidad si el actual tiene mayor capacidad
      if (event.capacity > stats.largestCapacity.capacity) {
        stats.largestCapacity = { name: event.name, capacity: event.capacity };
      }
  
      // Determinar si el evento es futuro o pasado
      const category = event.category;
      if (event.date >= currentDate.toISOString().split('T')[0]) {
        // Evento futuro
        if (!upcomingCategories[category]) {
          // Si la categoría no existe, inicializar con valores predeterminados
          upcomingCategories[category] = { revenue: 0, totalAssistance: 0, count: 0, capacity: event.capacity };
        }
        // Acumulando ingresos y asistencia para la categoría
        upcomingCategories[category].revenue += event.price;
        upcomingCategories[category].totalAssistance += event.assistance || 0;
        upcomingCategories[category].count += 1;
      } else {
        // Evento pasado
        if (!pastCategories[category]) {
          // Si la categoría no existe, inicializar con valores predeterminados
          pastCategories[category] = { revenue: 0, totalAssistance: 0, count: 0, capacity: event.capacity };
        }
        // Acumulando ingresos y asistencia para la categoría
        pastCategories[category].revenue += event.price;
        pastCategories[category].totalAssistance += event.assistance || 0;
        pastCategories[category].count += 1;
      }
    });
  
    // Calcular porcentajes para eventos futuros por categoría
    for (const category in upcomingCategories) {
      const data = upcomingCategories[category];
      // Porcentaje de asistencia: total de asistencia dividido por el total posible
      data.percentage = (data.totalAssistance / (data.count * data.capacity)) * 100;
    }
    
    // Calcular porcentajes para eventos pasados por categoría
    for (const category in pastCategories) {
      const data = pastCategories[category];
      // Porcentaje de asistencia: total de asistencia dividido por el total posible
      data.percentage = (data.totalAssistance / (data.count * data.capacity)) * 100;
    }
  
    // Asignar las estadísticas calculadas a los objetos correspondientes
    stats.upcomingByCategory = upcomingCategories;
    stats.pastByCategory = pastCategories;
  
    // Devolver las estadísticas calculadas
    return stats;
  }
  
  // Función para llenar las tablas con los datos procesados
  function populateTables(stats) {
    // Llenar la primera tabla con estadísticas generales
    document.querySelector('.table-responsive').children[0].querySelector('tbody').innerHTML = `
      <tr>
        <td>${stats.highestAttendance.name} (${stats.highestAttendance.percentage.toFixed(2)}%)</td>
        <td>${stats.lowestAttendance.name} (${stats.lowestAttendance.percentage.toFixed(2)}%)</td>
        <td>${stats.largestCapacity.name} (${stats.largestCapacity.capacity})</td>
      </tr>
    `;
  
    // Llenar la segunda tabla con estadísticas de eventos futuros por categoría
    const upcomingCategoriesTable = document.querySelectorAll('.table-responsive')[1].querySelector('tbody');
    upcomingCategoriesTable.innerHTML = Object.entries(stats.upcomingByCategory).map(([category, data]) => `
      <tr>
        <td>${category}</td>
        <td>${data.revenue.toFixed(2)}</td>
        <td>${data.percentage.toFixed(2)}%</td>
      </tr>
    `).join('');
  
    // Llenar la tercera tabla con estadísticas de eventos pasados por categoría
    const pastCategoriesTable = document.querySelectorAll('.table-responsive')[2].querySelector('tbody');
    pastCategoriesTable.innerHTML = Object.entries(stats.pastByCategory).map(([category, data]) => `
      <tr>
        <td>${category}</td>
        <td>${data.revenue.toFixed(2)}</td>
        <td>${data.percentage.toFixed(2)}%</td>
      </tr>
    `).join('');
  }
  
  // Inicializar la aplicación
  async function init() {
    // Obtener los datos de la API
    const data = await fetchData();
    if (data) {
      // Calcular las estadísticas basadas en los datos obtenidos
      const stats = calculateStatistics(data.events);
      // Llenar las tablas con las estadísticas calculadas
      populateTables(stats);
    }
  }
  
  // Llamar a la función init para iniciar el proceso
  init();
  