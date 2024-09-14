// Fetch data from the server
fetch('/location-data')
  .then(response => response.json())
  .then(mockData => {
    // Extract labels and data for the chart
    const labels = mockData.map(entry => entry.city);
    const data = mockData.map(entry => entry.count);

    // Initialize Chart.js with the data
    const ctx = document.getElementById('locationGraph').getContext('2d');
    const locationChart = new Chart(ctx, {
      type: 'bar', // Chart type
      data: {
        labels: labels,
        datasets: [{
          label: 'Number of Submissions',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  });