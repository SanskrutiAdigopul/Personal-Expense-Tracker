import { useState, useEffect } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import Modal from './Modal';

export default function AddIncomeModal({ isOpen, onClose }) {
    const { setIncomeForMonth, showNotification, selectedMonth } = useExpenses();

    const [month, setMonth] = useState(selectedMonth);
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');

    // Sync month with the dashboard's selected month whenever the modal opens
    useEffect(() => {
        if (isOpen) {
            setMonth(selectedMonth);
        }
    }, [isOpen, selectedMonth]);

    const handleSubmit = (e) => {
        e.preventDefault();

        setIncomeForMonth(amount, month, note);
        showNotification('Income saved successfully!', 'success');

        setAmount('');
        setNote('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Monthly Income">
            <form className="expense-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="incomeMonth">Month</label>
                    <input type="month" id="incomeMonth" value={month} onChange={e => setMonth(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="incomeAmount">Total Income (₹)</label>
                    <input type="number" id="incomeAmount" placeholder="Enter your monthly income" value={amount} onChange={e => setAmount(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="incomeNote">Note (optional)</label>
                    <textarea id="incomeNote" placeholder="E.g., Salary, Freelance, etc." value={note} onChange={e => setNote(e.target.value)}></textarea>
                </div>
                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn btn-success">Save Income</button>
                </div>
            </form>
        </Modal>
    );
}
