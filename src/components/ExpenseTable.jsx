import { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';

export default function ExpenseTable({ onEditExpense }) {
    const { expenses, deleteExpense, showNotification } = useExpenses();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredExpenses = expenses.filter(exp => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            exp.mainCategory.toLowerCase().includes(query) ||
            (exp.note || '').toLowerCase().includes(query) ||
            exp.amount.toString().includes(query) ||
            new Date(exp.date).toLocaleDateString('en-IN').includes(query)
        );
    });

    const handleDelete = (expenseId) => {
        if (confirm('Are you sure you want to delete this expense?')) {
            deleteExpense(expenseId);
            showNotification('Expense deleted successfully!', 'success');
        }
    };

    return (
        <section className="expenses-section">
            <div className="section-header-row">
                <h2>Recent Expenses</h2>
                <div className="table-actions">
                    <div className="search-box">
                        <img src="/assets/icon-search.png" alt="" className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search expenses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="table-container">
                <table className="expense-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Category</th>
                            <th>Note</th>
                            <th>Source</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.length === 0 ? (
                            <tr className="empty-row">
                                <td colSpan="6">
                                    <div className="table-empty-state">
                                        <img src="/assets/icon-document.png" alt="" className="empty-icon" />
                                        <p>
                                            {searchQuery
                                                ? 'No expenses match your search.'
                                                : 'No expenses for this month. Click "Add Expense" to get started!'}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredExpenses.map(expense => {
                                const date = new Date(expense.date);
                                const formattedDate = date.toLocaleDateString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                });
                                const categoryLabel = expense.mainCategory.charAt(0).toUpperCase() + expense.mainCategory.slice(1);
                                const sourceLabel = (expense.source || 'manual').toUpperCase();

                                return (
                                    <tr key={expense._id}>
                                        <td>{formattedDate}</td>
                                        <td className="amount">₹{expense.amount.toLocaleString('en-IN')}</td>
                                        <td>
                                            <span className={`category-badge ${expense.mainCategory}`}>{categoryLabel}</span>
                                        </td>
                                        <td>{expense.note || '-'}</td>
                                        <td>
                                            <span className={`source-badge ${expense.source || 'manual'}`}>{sourceLabel}</span>
                                        </td>
                                        <td>
                                            <div className="actions-cell">
                                                <button
                                                    className="action-btn edit"
                                                    onClick={() => onEditExpense(expense)}
                                                    title="Edit"
                                                >
                                                    <img src="/assets/icon-document.png" alt="Edit" />
                                                </button>
                                                <button
                                                    className="action-btn delete"
                                                    onClick={() => handleDelete(expense._id)}
                                                    title="Delete"
                                                >
                                                    <img src="/assets/icon-trending-down.png" alt="Delete" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
            <div className="table-footer">
                <span className="showing-info">
                    {filteredExpenses.length === 0
                        ? 'No expenses yet'
                        : `Showing ${filteredExpenses.length} expense${filteredExpenses.length !== 1 ? 's' : ''}`
                    }
                </span>
            </div>
        </section>
    );
}
