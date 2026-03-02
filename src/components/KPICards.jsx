import { useExpenses } from '../context/ExpenseContext';

export default function KPICards({ onEditIncome }) {
    const { income, totalSpent, remainingBalance, biggestCategory, avgDailySpend } = useExpenses();

    const balancePositive = remainingBalance >= 0;

    return (
        <section className="kpi-section">
            <div className="kpi-grid">
                {/* Total Income Card */}
                <div
                    className="kpi-card income-card clickable"
                    title="Click to edit income"
                    onClick={onEditIncome}
                >
                    <div className="kpi-icon-wrapper success">
                        <img src="/assets/icon-wallet.png" alt="" className="kpi-icon" />
                    </div>
                    <div className="kpi-content">
                        <span className="kpi-label">Total Income</span>
                        <span className="kpi-value success">₹{income.toLocaleString('en-IN')}</span>
                        <span className="kpi-sub">
                            {income > 0 ? 'Monthly budget set' : 'Set your monthly income'}
                        </span>
                    </div>
                    <div className="kpi-edit-hint">
                        <img src="/assets/icon-document.png" alt="" className="edit-hint-icon" />
                        <span>Edit</span>
                    </div>
                </div>

                {/* Total Spent Card */}
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper">
                        <img src="/assets/icon-money.png" alt="" className="kpi-icon" />
                    </div>
                    <div className="kpi-content">
                        <span className="kpi-label">Total Spent</span>
                        <span className="kpi-value">₹{totalSpent.toLocaleString('en-IN')}</span>
                    </div>
                </div>

                {/* Remaining Balance Card */}
                <div className={`kpi-card balance-card ${balancePositive ? 'positive' : 'negative'}`}>
                    <div className="kpi-icon-wrapper">
                        <img src="/assets/icon-trending-up.png" alt="" className="kpi-icon" />
                    </div>
                    <div className="kpi-content">
                        <span className="kpi-label">Remaining Balance</span>
                        <span className="kpi-value">
                            {balancePositive
                                ? `₹${remainingBalance.toLocaleString('en-IN')}`
                                : `-₹${Math.abs(remainingBalance).toLocaleString('en-IN')}`
                            }
                        </span>
                        <span className="kpi-sub">
                            {!balancePositive
                                ? 'Over budget!'
                                : remainingBalance > 0
                                    ? 'Available to spend'
                                    : ''
                            }
                        </span>
                    </div>
                </div>

                {/* Biggest Category */}
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper warning">
                        <img src="/assets/icon-chart.png" alt="" className="kpi-icon" />
                    </div>
                    <div className="kpi-content">
                        <span className="kpi-label">Biggest Category</span>
                        <span className="kpi-value">
                            {biggestCategory.name === '--'
                                ? '--'
                                : biggestCategory.name.charAt(0).toUpperCase() + biggestCategory.name.slice(1)
                            }
                        </span>
                        <span className="kpi-sub">
                            {biggestCategory.amount > 0 ? `₹${biggestCategory.amount.toLocaleString('en-IN')} spent` : ''}
                        </span>
                    </div>
                </div>

                {/* Avg Daily Spend */}
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper accent">
                        <img src="/assets/icon-trending-up.png" alt="" className="kpi-icon" />
                    </div>
                    <div className="kpi-content">
                        <span className="kpi-label">Avg Daily Spend</span>
                        <span className="kpi-value">₹{avgDailySpend.toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
