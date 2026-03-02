import { useState, useEffect } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import Modal from './Modal';

export default function EditIncomeModal({ isOpen, onClose }) {
    const { incomeData, selectedMonth, updateIncome, deleteIncome, showNotification } = useExpenses();

    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');

    useEffect(() => {
        if (incomeData) {
            setAmount(incomeData.amount);
            setNote(incomeData.note || '');
        }
    }, [incomeData]);

    const handleSubmit = (e) => {
        e.preventDefault();

        updateIncome(selectedMonth, amount, note);
        showNotification('Income updated successfully!', 'success');
        onClose();
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this income record? This action cannot be undone.')) {
            deleteIncome(selectedMonth);
            showNotification('Income deleted successfully!', 'success');
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Income">
            <form className="expense-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="editIncomeMonth">Month</label>
                    <input type="month" id="editIncomeMonth" value={selectedMonth} disabled required />
                    <small className="form-hint">Month cannot be changed</small>
                </div>
                <div className="form-group">
                    <label htmlFor="editIncomeAmount">Total Income (₹)</label>
                    <input type="number" id="editIncomeAmount" placeholder="Enter your monthly income" value={amount} onChange={e => setAmount(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="editIncomeNote">Note (optional)</label>
                    <textarea id="editIncomeNote" placeholder="E.g., Salary, Freelance, etc." value={note} onChange={e => setNote(e.target.value)}></textarea>
                </div>
                <div className="form-actions">
                    <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete Income</button>
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn btn-success">Save Changes</button>
                </div>
            </form>
        </Modal>
    );
}
