// chart_price_trend.js — Reusable price trend chart with side lighting

function renderPriceTrendChart(canvasId = 'priceChart') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  if (canvas.chart) {
    canvas.chart.destroy();
  }

  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded yet');
    return;
  }

  const ctx = canvas.getContext('2d');

  canvas.chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Day -5', 'Day -4', 'Day -3', 'Day -2', 'Yesterday', 'Today'],
      datasets: [{
        label: 'Closing Price',
        data: [20, 22, 24, 25, 23, 26],
        borderColor: '#4BC0C0',
        backgroundColor: 'rgba(75, 192, 192, 0.25)',
        tension: 0.2,
        fill: true,  // Fill under line
        pointBackgroundColor: ['#666', '#666', '#666', '#666', '#FF6384', '#36A2EB'],
        pointRadius: [4, 4, 4, 4, 8, 8],
        pointHoverRadius: 10
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Stock Closing Prices (Last 6 Days)'
        },
        tooltip: {
          callbacks: {
            afterLabel: function(context) {
              if (context.dataIndex === 4) return '← Included in 5-day SMA';
              if (context.dataIndex === 5) return '← Today\'s price (not in SMA)';
              return '';
            }
          }
        },
        legend: { position: 'top' }
      },
      scales: {
        y: { title: { display: true, text: 'Price' } },
        x: { title: { display: true, text: 'Day' } }
      }
    },
    plugins: [{
      id: 'side_lighting',
      beforeDraw: (chart) => {
        const ctx = chart.ctx;
        const chartArea = chart.chartArea;
        const width = chartArea.width;
        const height = chartArea.height;
        const left = chartArea.left;
        const top = chartArea.top;

        // Left side soft light (teal glow)
        const leftGradient = ctx.createLinearGradient(left, 0, left + width * 0.15, 0);
        leftGradient.addColorStop(0, 'rgba(75, 192, 192, 0.15)');
        leftGradient.addColorStop(1, 'rgba(75, 192, 192, 0)');

        ctx.fillStyle = leftGradient;
        ctx.fillRect(left, top, width * 0.15, height);

        // Right side soft light (blue glow)
        const rightGradient = ctx.createLinearGradient(left + width - width * 0.15, 0, left + width, 0);
        rightGradient.addColorStop(0, 'rgba(75, 192, 192, 0)');
        rightGradient.addColorStop(1, 'rgba(75, 192, 192, 0.15)');

        ctx.fillStyle = rightGradient;
        ctx.fillRect(left + width - width * 0.15, top, width * 0.15, height);
      }
    }]
  });
}

// Make it global
window.renderPriceTrendChart = renderPriceTrendChart;