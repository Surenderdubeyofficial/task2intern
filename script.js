// Select DOM Elements
const form = document.getElementById('budget-form');
const typeInput = document.getElementById('type');
const categoryInput = document.getElementById('category');
const amountInput = document.getElementById('amount');
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const balanceEl = document.getElementById('balance');

// Chart Containers
const expenseChartCtx = document.getElementById('expense-chart').getContext('2d');
const trendChartCtx = document.getElementById('trend-chart').getContext('2d');

// Data Storage
let income = 0;
let expenses = 0;
let expenseData = {};
let trendData = { income: [], expenses: [], labels: [] };

// Initialize Expense Chart
const expenseChart = new Chart(expenseChartCtx, {
  type: 'pie',
  data: {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF'],
        borderWidth: 1,
      },
    ],
  },
});

// Initialize Trend Chart
const trendChart = new Chart(trendChartCtx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Income',
        data: [],
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      },
      {
        label: 'Expenses',
        data: [],
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
    ],
  },
});

// Form Submit Event
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const type = typeInput.value;
  const category = categoryInput.value.trim();
  const amount = parseFloat(amountInput.value);

  // Validate Input
  if (!category || isNaN(amount) || amount <= 0) {
    alert('Please enter valid details!');
    return;
  }

  // Update Income/Expense and Trends
  if (type === 'income') {
    income += amount;
    trendData.income.push(income);
    trendData.expenses.push(expenses);
  } else {
    expenses += amount;
    expenseData[category] = (expenseData[category] || 0) + amount;
    trendData.income.push(income);
    trendData.expenses.push(expenses);
  }

  trendData.labels.push(new Date().toLocaleDateString());

  // Update UI
  updateUI();
  updateCharts();
  form.reset();
});

// Update Summary
function updateUI() {
  totalIncomeEl.textContent = `$${income.toFixed(2)}`;
  totalExpenseEl.textContent = `$${expenses.toFixed(2)}`;
  balanceEl.textContent = `$${(income - expenses).toFixed(2)}`;
}

// Update Charts
function updateCharts() {
  // Update Expense Chart
  expenseChart.data.labels = Object.keys(expenseData);
  expenseChart.data.datasets[0].data = Object.values(expenseData);
  expenseChart.update();

  // Update Trend Chart
  trendChart.data.labels = trendData.labels;
  trendChart.data.datasets[0].data = trendData.income;
  trendChart.data.datasets[1].data = trendData.expenses;
  trendChart.update();
}
