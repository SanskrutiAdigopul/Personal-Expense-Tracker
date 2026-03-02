import { useMemo } from 'react';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { useExpenses } from '../context/ExpenseContext';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, ArcElement, Tooltip, Legend, Filler
);

const chartColors = [
    '#14b8a6', '#f97316', '#8b5cf6', '#ec4899',
    '#06b6d4', '#84cc16', '#f59e0b', '#6366f1',
    '#22c55e', '#ef4444'
];

export default function Charts() {
    const { categoryTotals, expenses, selectedMonth } = useExpenses();
    const { theme } = useTheme();

    const isDark = theme === 'dark';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';

    // Pie Chart Data
    const pieData = useMemo(() => {
        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);

        if (labels.length === 0) {
            return {
                labels: ['No data yet'],
                datasets: [{
                    data: [1],
                    backgroundColor: ['#e2e8f0'],
                    borderWidth: 0,
                    hoverOffset: 0
                }]
            };
        }

        return {
            labels: labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
            datasets: [{
                data,
                backgroundColor: chartColors.slice(0, labels.length),
                borderWidth: 0,
                hoverOffset: 8
            }]
        };
    }, [categoryTotals]);

    const pieOptions = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    padding: 15,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    color: '#94a3b8'
                }
            },
            tooltip: {
                enabled: Object.keys(categoryTotals).length > 0,
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: (item) => `₹${item.raw.toLocaleString('en-IN')}`
                }
            }
        }
    }), [categoryTotals]);

    // Line Chart Data
    const lineData = useMemo(() => {
        const [year, month] = selectedMonth.split('-');
        const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
        const dayLabels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
        const dailyTotals = Array(daysInMonth).fill(0);

        expenses.forEach(expense => {
            const expenseDate = new Date(expense.date);
            const dayOfMonth = expenseDate.getDate();
            if (dayOfMonth >= 1 && dayOfMonth <= daysInMonth) {
                dailyTotals[dayOfMonth - 1] += expense.amount;
            }
        });

        const hasData = dailyTotals.some(d => d > 0);

        return {
            labels: dayLabels,
            datasets: [{
                label: 'Daily Spending',
                data: dailyTotals,
                fill: true,
                backgroundColor: hasData ? 'rgba(20, 184, 166, 0.1)' : 'rgba(20, 184, 166, 0.05)',
                borderColor: hasData ? '#14b8a6' : '#e2e8f0',
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 3,
                pointBackgroundColor: '#14b8a6',
                pointBorderColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 6
            }]
        };
    }, [expenses, selectedMonth]);

    const lineOptions = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: 'index' },
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    title: (items) => `Day ${items[0].label}`,
                    label: (item) => `₹${item.raw.toLocaleString('en-IN')}`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: gridColor },
                ticks: {
                    callback: (value) => `₹${value.toLocaleString('en-IN')}`,
                    color: '#94a3b8',
                    font: { size: 10 }
                }
            },
            x: {
                grid: { display: false },
                ticks: {
                    color: '#94a3b8',
                    font: { size: 10 },
                    maxRotation: 0,
                    callback: function (val, index) {
                        return (index + 1) % 5 === 0 || index === 0 ? this.getLabelForValue(val) : '';
                    }
                }
            }
        }
    }), [gridColor]);

    // Bar Chart Data
    const barData = useMemo(() => {
        if (expenses.length === 0) {
            return {
                labels: ['No expenses yet', '', '', '', ''],
                datasets: [{
                    label: 'Amount',
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: chartColors.slice(0, 5),
                    borderRadius: 6,
                    barThickness: 24
                }]
            };
        }

        const sortedExpenses = [...expenses]
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5);

        const labels = sortedExpenses.map(exp => {
            const category = exp.mainCategory.charAt(0).toUpperCase() + exp.mainCategory.slice(1);
            const note = exp.note ? ` - ${exp.note}` : '';
            const label = `${category}${note}`;
            return label.length > 25 ? label.substring(0, 22) + '...' : label;
        });

        return {
            labels,
            datasets: [{
                label: 'Amount',
                data: sortedExpenses.map(exp => exp.amount),
                backgroundColor: chartColors.slice(0, sortedExpenses.length),
                borderRadius: 6,
                barThickness: 24
            }]
        };
    }, [expenses]);

    const barOptions = useMemo(() => ({
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: (item) => `₹${item.raw.toLocaleString('en-IN')}`
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                grid: { color: gridColor },
                ticks: {
                    callback: (value) => `₹${value.toLocaleString('en-IN')}`,
                    color: '#94a3b8',
                    font: { size: 10 }
                }
            },
            y: {
                grid: { display: false },
                ticks: {
                    color: '#94a3b8',
                    font: { size: 11 }
                }
            }
        }
    }), [gridColor]);

    return (
        <section className="charts-section">
            <div className="charts-grid">
                <div className="chart-card">
                    <div className="chart-header">
                        <h3>Category Distribution</h3>
                        <span className="chart-period">This Month</span>
                    </div>
                    <div className="chart-body">
                        <Doughnut data={pieData} options={pieOptions} />
                    </div>
                </div>
                <div className="chart-card">
                    <div className="chart-header">
                        <h3>Daily Spending</h3>
                        <span className="chart-period">This Month</span>
                    </div>
                    <div className="chart-body">
                        <Line data={lineData} options={lineOptions} />
                    </div>
                </div>
                <div className="chart-card full-width">
                    <div className="chart-header">
                        <h3>Top Expenses</h3>
                        <span className="chart-period">This Month</span>
                    </div>
                    <div className="chart-body bar-chart-body">
                        <Bar data={barData} options={barOptions} />
                    </div>
                </div>
            </div>
        </section>
    );
}
