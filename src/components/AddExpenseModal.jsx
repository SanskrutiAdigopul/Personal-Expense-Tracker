import { useState, useEffect } from 'react';
import { useExpenses, subcategories } from '../context/ExpenseContext';
import Modal from './Modal';

export default function AddExpenseModal({ isOpen, onClose }) {
    const { addExpense, canAddExpense, showNotification, selectedMonth } = useExpenses();

    // Default date to the 1st of the selected month, or today if it's the current month
    function getDefaultDate() {
        const today = new Date();
        const [selYear, selMonth] = selectedMonth.split('-');
        if (parseInt(selYear) === today.getFullYear() && parseInt(selMonth) === today.getMonth() + 1) {
            return today.toISOString().split('T')[0];
        }
        // For a past month, default to the 1st of that month
        return `${selectedMonth}-01`;
    }

    const [date, setDate] = useState(getDefaultDate);
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [note, setNote] = useState('');

    // Reset date whenever modal opens or selected month changes
    useEffect(() => {
        if (isOpen) {
            setDate(getDefaultDate());
        }
    }, [isOpen, selectedMonth]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!canAddExpense(amount)) return;

        addExpense({ date, amount, category, subcategory, note });
        showNotification('Expense added successfully!', 'success');

        // Reset form
        setAmount('');
        setCategory('');
        setSubcategory('');
        setNote('');
        onClose();
    };

    const handleCategoryChange = (val) => {
        setCategory(val);
        setSubcategory('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Expense">
            <form className="expense-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="expenseDate">Date</label>
                        <input type="date" id="expenseDate" value={date} onChange={e => setDate(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="expenseAmount">Amount (₹)</label>
                        <input type="number" id="expenseAmount" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} required />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="expenseCategory">Category</label>
                        <select id="expenseCategory" value={category} onChange={e => handleCategoryChange(e.target.value)} required>
                            <option value="">Select category</option>
                            <option value="food">Food & Dining</option>
                            <option value="transportation">Transportation</option>
                            <option value="shopping">Shopping</option>
                            <option value="bills">Bills & Utilities</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="health">Health & Fitness</option>
                            <option value="education">Education</option>
                            <option value="travel">Travel</option>
                            <option value="subscriptions">Subscriptions</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    {category && subcategories[category] && (
                        <div className="form-group">
                            <label htmlFor="expenseSubcategory">Subcategory</label>
                            <select id="expenseSubcategory" value={subcategory} onChange={e => setSubcategory(e.target.value)}>
                                <option value="">Select subcategory</option>
                                {subcategories[category].map(sub => (
                                    <option key={sub} value={sub.toLowerCase().replace(/[^a-z0-9]/g, '_')}>{sub}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="expenseNote">Note</label>
                    <textarea id="expenseNote" placeholder="Add a note..." value={note} onChange={e => setNote(e.target.value)}></textarea>
                </div>
                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Add Expense</button>
                </div>
            </form>
        </Modal>
    );
}
