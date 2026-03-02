import { useMemo } from 'react';
import { useExpenses } from '../context/ExpenseContext';

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

function generateMonthOptions(count) {
    const months = [];
    const today = new Date();
    for (let i = 0; i < count; i++) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const monthStr = String(month).padStart(2, '0');
        months.push({
            value: `${year}-${monthStr}`,
            label: `${monthNames[month - 1]} ${year}`
        });
    }
    return months;
}

export default function DashboardHeader({ onAddExpense, onAddIncome, onEditIncome, onDownloadReport }) {
    const { selectedMonth, setSelectedMonth, income } = useExpenses();

    const monthOptions = useMemo(() => generateMonthOptions(12), []);

    const [year, month] = selectedMonth.split('-');
    const selectedMonthName = `${monthNames[parseInt(month) - 1]} ${year}`;

    return (
        <div className="dashboard-header">
            <div className="header-content">
                <h1>Welcome back, <span className="user-greeting">User</span>!</h1>
                <p>Here's your financial overview for <span>{selectedMonthName}</span></p>
            </div>
            <div className="month-selector-wrapper">
                <div className="month-selector">
                    <img src="/assets/icon-chart.png" alt="" className="month-icon" />
                    <select
                        className="month-dropdown"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                        {monthOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="header-actions">
                <button className="btn btn-secondary" onClick={onDownloadReport} title="Download Monthly Report">
                    <img src="/assets/icon-document.png" alt="" className="btn-icon-left" />
                    <span>Download Report</span>
                </button>
                <button className="btn btn-success" onClick={onAddIncome}>
                    <img src="/assets/icon-wallet.png" alt="" className="btn-icon-left" />
                    <span>Add Income</span>
                </button>
                {income > 0 && (
                    <button className="btn btn-outline-success" onClick={onEditIncome}>
                        <img src="/assets/icon-document.png" alt="" className="btn-icon-left" />
                        <span>Edit Income</span>
                    </button>
                )}
                <button className="btn btn-primary" onClick={onAddExpense}>
                    <img src="/assets/icon-money.png" alt="" className="btn-icon-left" />
                    <span>Add Expense</span>
                </button>
            </div>
        </div>
    );
}
