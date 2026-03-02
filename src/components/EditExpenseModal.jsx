import { useState, useEffect } from 'react';
import { useExpenses, subcategories } from '../context/ExpenseContext';
import Modal from './Modal';

export default function EditExpenseModal({ isOpen, onClose, expense }) {
    const { updateExpense, showNotification } = useExpenses();

    const [date, setDate] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [note, setNote] = useState('');

    useEffect(() => {
        if (expense) {
            setDate(expense.date?.split('T')[0] || expense.date);
            setAmount(expense.amount);
            setCategory(expense.mainCategory);
            setSubcategory(expense.subCategory || '');
            setNote(expense.note || '');
        }
    }, [expense]);

    const handleSubmit = (e) => {
        e.preventDefault();

        updateExpense(expense._id, {
            date,
            amount: parseFloat(amount),
            mainCategory: category,
            subCategory: subcategory || '',
            note: note || ''
        });

        showNotification('Expense updated successfully!', 'success');
        onClose();
    };

    if (!expense) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Expense">
            <form className="expense-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="editExpenseDate">Date</label>
                        <input type="date" id="editExpenseDate" value={date} onChange={e => setDate(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="editExpenseAmount">Amount (₹)</label>
                        <input type="number" id="editExpenseAmount" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} required />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="editExpenseCategory">Category</label>
                        <select id="editExpenseCategory" value={category} onChange={e => { setCategory(e.target.value); setSubcategory(''); }} required>
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
                            <label htmlFor="editExpenseSubcategory">Subcategory</label>
                            <select id="editExpenseSubcategory" value={subcategory} onChange={e => setSubcategory(e.target.value)}>
                                <option value="">Select subcategory</option>
                                {subcategories[category].map(sub => (
                                    <option key={sub} value={sub.toLowerCase().replace(/[^a-z0-9]/g, '_')}>{sub}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="editExpenseNote">Note</label>
                    <textarea id="editExpenseNote" placeholder="Add a note..." value={note} onChange={e => setNote(e.target.value)}></textarea>
                </div>
                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
            </form>
        </Modal>
    );
}
