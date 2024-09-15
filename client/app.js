
document.addEventListener('DOMContentLoaded', () => {
  // Modal related code
  const modal = document.getElementById('concertModal');
  const openModal = document.getElementById('openModal');
  const closeModal = document.querySelector('.close-btn');
  const stateSelect = document.getElementById('state');
  const citySelect = document.getElementById('city');

  // Modal: Open modal when the user clicks the link
  openModal.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent the default link behavior
    modal.style.display = 'block'; // Show the modal

    // Add a slight delay to ensure the modal is visible before focusing
    setTimeout(() => {
      stateSelect.focus(); // Focus on the state dropdown
    }, 100); // 100ms delay to ensure smooth rendering
  });

  // Modal: Close modal when the "x" button is clicked
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none'; // Hide the modal
  });

  // Modal: Close modal if the user clicks outside the modal content
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none'; // Hide the modal if clicking outside content
    }
  });

  // Load the JSON file with city/state data for the dropdowns
  fetch('citiesByStateWithMetro.json')
    .then(response => response.json())
    .then(data => {
      // Populate the state dropdown
      for (const state in data) {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
      }

      // Populate cities based on the selected state
      stateSelect.addEventListener('change', function () {
        const selectedState = this.value;
        const cities = data[selectedState] || [];

        // Clear out existing cities
        citySelect.innerHTML = '<option value="">--Select City--</option>';

        // Populate city dropdown
        cities.forEach(city => {
          const option = document.createElement('option');
          option.value = city;
          option.textContent = city;
          citySelect.appendChild(option);
        });
      });
    })
    .catch(error => console.error('Error loading city/state data:', error));
});
// Fetch updated data from the server for the chart
fetch('/location-data')
  .then(response => response.json())
  .then(mockData => {
    // Sort the data by the count property in ascending order
    mockData.sort((a, b) => a.count - b.count);

    // Extract labels (cityAndState) and data (counts)
    const labels = mockData.map(entry => entry.cityAndState); // Corrected field name
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
            beginAtZero: true,
            ticks: {
              color: 'rgba(54, 162, 235, 1)', // Set the color of the numbers on the Y-axis
              font: {
                size: 16, // Increase font size of the Y-axis labels
                weight: 'bold' // Make the numbers bold
              },
              padding: 15 // Add padding to the left of the numbers
            },
            grid: {
              color: 'rgba(94, 28, 51, 0.2)', // Color for the dashed grid lines with transparency
              borderDash: [5, 5], // Creates a dashed line [length of dash, length of gap]
              lineWidth: 2, // Thickness of the dashed grid lines
              drawBorder: true, // Keep the border of the Y-axis
              drawOnChartArea: true, // Keep the grid lines visible (dashed)
              drawTicks: true, // Keep the small ticks on the axis
            }
          },
          x: {
            grid: {
              drawOnChartArea: false, // Hide grid lines for X-axis as well
            }
          }
        }
      }
    });
  });