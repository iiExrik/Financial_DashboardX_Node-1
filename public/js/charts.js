// charts.js - renders all charts on the homepage
async function createChart(ctxId, label, data, isPercent) {
  const ctx = document.getElementById(ctxId).getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(d => d.date),
      datasets: [{
        label,
        data: data.map(d => d.amount),
        tension: 0.2,
        borderWidth: 2,
        fill: true
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return isPercent ? value + '%' : value;
            }
          }
        }
      }
    }
  });
}

async function loadAllCharts() {
  try {
    const [sales, expenses, profit_loss, profit_margin, purchases] = await Promise.all([
      fetchMetric('sales'),
      fetchMetric('expenses'),
      fetchMetric('profit_loss'),
      fetchMetric('profit_margin'),
      fetchMetric('purchases')
    ]);

    createChart('salesChart', 'Sales', sales, false);
    createChart('expensesChart', 'Expenses', expenses, false);
    createChart('profitChart', 'Profit / Loss', profit_loss, false);
    createChart('marginChart', 'Profit Margin (%)', profit_margin, true);
    createChart('purchasesChart', 'Purchases', purchases, false);
  } catch (err) {
    console.error(err);
    // show minimal UI error
    document.body.insertAdjacentHTML('afterbegin', '<div style="background:#ffeedd;padding:10px;border-radius:6px;margin-bottom:12px;">Failed to load charts. Make sure the server is running and firebase.json is configured.</div>');
  }
}

window.addEventListener('load', loadAllCharts);
