import { useState, useCallback } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import DashboardHeader from './DashboardHeader';
import KPICards from './KPICards';
import Charts from './Charts';
import ExpenseTable from './ExpenseTable';
import AddExpenseModal from './AddExpenseModal';
import AddIncomeModal from './AddIncomeModal';
import EditExpenseModal from './EditExpenseModal';
import EditIncomeModal from './EditIncomeModal';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Dashboard() {
    const {
        selectedMonth, income, totalSpent, expenses,
        categoryTotals, incomeData, showNotification
    } = useExpenses();

    const [addExpenseOpen, setAddExpenseOpen] = useState(false);
    const [addIncomeOpen, setAddIncomeOpen] = useState(false);
    const [editIncomeOpen, setEditIncomeOpen] = useState(false);
    const [editExpenseOpen, setEditExpenseOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);

    const handleEditExpense = useCallback((expense) => {
        setEditingExpense(expense);
        setEditExpenseOpen(true);
    }, []);

    const handleEditIncome = useCallback(() => {
        if (income > 0) {
            setEditIncomeOpen(true);
        } else {
            setAddIncomeOpen(true);
        }
    }, [income]);

    const generatePDFReport = useCallback(() => {
        try {
            showNotification('Generating report...', 'success');

            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.width;

            const [year, month] = selectedMonth.split('-');
            const selectedMonthName = `${monthNames[parseInt(month) - 1]} ${year}`;

            // Title
            doc.setFontSize(22);
            doc.setTextColor(20, 184, 166);
            doc.text('ExpenseTracker Monthly Report', 14, 20);

            // Month info
            doc.setFontSize(12);
            doc.setTextColor(100);
            doc.text(`Period: ${selectedMonthName}`, 14, 30);

            // Report Date
            const today = new Date().toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric'
            });
            doc.setFontSize(10);
            doc.text(`Generated on: ${today}`, 14, 36);

            // Financial Summary
            doc.setFillColor(248, 250, 252);
            doc.rect(14, 45, pageWidth - 28, 35, 'F');

            const balance = income - totalSpent;

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text('Total Income', 20, 55);
            doc.text('Total Spent', 80, 55);
            doc.text('Remaining Balance', 140, 55);

            doc.setFontSize(14);
            doc.setTextColor(34, 197, 94);
            doc.text(`Rs. ${income.toLocaleString('en-IN')}`, 20, 65);

            doc.setTextColor(239, 68, 68);
            doc.text(`Rs. ${totalSpent.toLocaleString('en-IN')}`, 80, 65);

            doc.setTextColor(balance >= 0 ? 34 : 239, balance >= 0 ? 197 : 68, balance >= 0 ? 94 : 68);
            doc.text(`Rs. ${Math.abs(balance).toLocaleString('en-IN')}`, 140, 65);

            // Category Table
            doc.setFontSize(14);
            doc.setTextColor(15, 23, 42);
            doc.text('Spending by Category', 14, 95);

            const categoryData = Object.entries(categoryTotals)
                .map(([cat, amount]) => [
                    cat.charAt(0).toUpperCase() + cat.slice(1),
                    `Rs. ${amount.toLocaleString('en-IN')}`
                ]);

            if (categoryData.length > 0) {
                autoTable(doc, {
                    startY: 100,
                    head: [['Category', 'Amount']],
                    body: categoryData,
                    theme: 'striped',
                    headStyles: { fillColor: [20, 184, 166] },
                    margin: { left: 14, right: 14 }
                });
            } else {
                doc.setFontSize(10);
                doc.setTextColor(100);
                doc.text('No spending data for this month.', 14, 105);
            }

            // Detailed Expenses
            let detailY = (doc.lastAutoTable || doc.previousAutoTable) ? (doc.lastAutoTable || doc.previousAutoTable).finalY + 15 : 120;
            doc.setFontSize(14);
            doc.setTextColor(15, 23, 42);
            doc.text('Detailed Transaction History', 14, detailY);

            const expenseRows = expenses.map(exp => [
                new Date(exp.date).toLocaleDateString('en-IN'),
                exp.mainCategory.charAt(0).toUpperCase() + exp.mainCategory.slice(1),
                exp.note || '-',
                `Rs. ${exp.amount.toLocaleString('en-IN')}`
            ]);

            if (expenseRows.length > 0) {
                autoTable(doc, {
                    startY: detailY + 5,
                    head: [['Date', 'Category', 'Note', 'Amount']],
                    body: expenseRows,
                    theme: 'grid',
                    headStyles: { fillColor: [51, 65, 85] },
                    styles: { fontSize: 9 },
                    columnStyles: {
                        0: { cellWidth: 30 },
                        1: { cellWidth: 35 },
                        2: { cellWidth: 'auto' },
                        3: { cellWidth: 35, halign: 'right' }
                    }
                });
            }

            // Footer
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(150);
                doc.text('Generated by ExpenseTracker Finance Manager', pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
            }

            doc.save(`ExpenseTracker_Report_${selectedMonth}.pdf`);
            showNotification('Report downloaded!', 'success');
        } catch (error) {
            console.error('PDF Generation Error:', error);
            showNotification('Failed to generate PDF report', 'error');
        }
    }, [selectedMonth, income, totalSpent, expenses, categoryTotals, showNotification]);

    return (
        <main className="dashboard-main">
            <div className="dashboard-container">
                <DashboardHeader
                    onAddExpense={() => setAddExpenseOpen(true)}
                    onAddIncome={() => setAddIncomeOpen(true)}
                    onEditIncome={handleEditIncome}
                    onDownloadReport={generatePDFReport}
                />
                <KPICards onEditIncome={handleEditIncome} />
                <Charts />
                <ExpenseTable onEditExpense={handleEditExpense} />

                <AddExpenseModal
                    isOpen={addExpenseOpen}
                    onClose={() => setAddExpenseOpen(false)}
                />
                <AddIncomeModal
                    isOpen={addIncomeOpen}
                    onClose={() => setAddIncomeOpen(false)}
                />
                <EditExpenseModal
                    isOpen={editExpenseOpen}
                    onClose={() => { setEditExpenseOpen(false); setEditingExpense(null); }}
                    expense={editingExpense}
                />
                <EditIncomeModal
                    isOpen={editIncomeOpen}
                    onClose={() => setEditIncomeOpen(false)}
                />
            </div>
        </main>
    );
}
