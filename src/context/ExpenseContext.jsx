import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ExpenseContext = createContext();

// Subcategory mappings
export const subcategories = {
    food: ['Groceries', 'Restaurants', 'Food Delivery', 'Cafes', 'Street Food', 'Snacks'],
    transportation: ['Fuel', 'Cab / Taxi', 'Auto / Rickshaw', 'Bus', 'Train', 'Metro', 'Parking'],
    shopping: ['Clothing', 'Electronics', 'Home Items', 'Online Shopping', 'Gifts', 'Accessories'],
    bills: ['Electricity', 'Water', 'Gas', 'Mobile Recharge', 'Internet', 'Rent'],
    entertainment: ['Movies', 'OTT Subscriptions', 'Games', 'Events', 'Partying', 'Music'],
    health: ['Doctor', 'Medicines', 'Gym', 'Hospital', 'Health Checkups', 'Supplements'],
    education: ['Course Fees', 'Books', 'Online Courses', 'Coaching', 'Stationery', 'Certifications'],
    travel: ['Hotels', 'Flights', 'Local Travel', 'Food While Traveling', 'Tour Packages'],
    subscriptions: ['Netflix', 'Spotify', 'Amazon Prime', 'YouTube Premium', 'Software', 'Cloud Storage'],
    other: ['Emergency', 'One-time Payments', 'Miscellaneous', 'Adjustments']
};

function getCurrentMonth() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function getStoredExpenses() {
    try {
        return JSON.parse(localStorage.getItem('expenses') || '[]');
    } catch { return []; }
}

function getStoredIncomes() {
    try {
        return JSON.parse(localStorage.getItem('incomes') || '{}');
    } catch { return {}; }
}

export function ExpenseProvider({ children }) {
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);
    const [allExpenses, setAllExpenses] = useState(getStoredExpenses);
    const [allIncomes, setAllIncomes] = useState(getStoredIncomes);
    const [notification, setNotification] = useState(null);

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem('expenses', JSON.stringify(allExpenses));
    }, [allExpenses]);

    useEffect(() => {
        localStorage.setItem('incomes', JSON.stringify(allIncomes));
    }, [allIncomes]);

    // Filter expenses for selected month
    const expenses = allExpenses.filter(exp => {
        const expMonth = exp.date.substring(0, 7);
        return expMonth === selectedMonth;
    });

    // Income for selected month
    const income = Number(allIncomes[selectedMonth]?.amount) || 0;
    const incomeData = allIncomes[selectedMonth] || null;

    // Derived values
    const totalSpent = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
    const remainingBalance = income - totalSpent;

    const categoryTotals = expenses.reduce((acc, exp) => {
        acc[exp.mainCategory] = (acc[exp.mainCategory] || 0) + (Number(exp.amount) || 0);
        return acc;
    }, {});

    const biggestCategory = Object.entries(categoryTotals).reduce(
        (max, [cat, amount]) => (amount > (max.amount || 0) ? { name: cat, amount } : max),
        { name: '--', amount: 0 }
    );

    const avgDailySpend = (() => {
        if (expenses.length === 0) return 0;
        const [year, month] = selectedMonth.split('-');
        const today = new Date();
        const selectedYear = parseInt(year);
        const selectedMonthNum = parseInt(month);
        let daysToCount;
        if (selectedYear === today.getFullYear() && selectedMonthNum === today.getMonth() + 1) {
            daysToCount = today.getDate();
        } else {
            daysToCount = new Date(selectedYear, selectedMonthNum, 0).getDate();
        }
        return Math.round(totalSpent / daysToCount);
    })();

    // CRUD operations
    const addExpense = useCallback((expenseData) => {
        const newExpense = {
            _id: generateId(),
            date: expenseData.date,
            amount: parseFloat(expenseData.amount) || 0,
            mainCategory: expenseData.category,
            subCategory: expenseData.subcategory || '',
            note: expenseData.note || '',
            source: 'manual',
        };
        setAllExpenses(prev => [...prev, newExpense]);
        return newExpense;
    }, []);

    const updateExpense = useCallback((expenseId, data) => {
        setAllExpenses(prev =>
            prev.map(exp =>
                exp._id === expenseId
                    ? { ...exp, ...data, amount: parseFloat(data.amount) || 0 }
                    : exp
            )
        );
    }, []);

    const deleteExpense = useCallback((expenseId) => {
        setAllExpenses(prev => prev.filter(exp => exp._id !== expenseId));
    }, []);

    const setIncomeForMonth = useCallback((amount, month, note = '') => {
        const targetMonth = month || selectedMonth;
        setAllIncomes(prev => ({
            ...prev,
            [targetMonth]: {
                _id: prev[targetMonth]?._id || generateId(),
                amount: parseFloat(amount) || 0,
                month: targetMonth,
                note: note || '',
            }
        }));
    }, [selectedMonth]);

    const updateIncome = useCallback((month, amount, note = '') => {
        setAllIncomes(prev => ({
            ...prev,
            [month]: {
                ...prev[month],
                amount: parseFloat(amount) || 0,
                note: note || '',
            }
        }));
    }, []);

    const deleteIncome = useCallback((month) => {
        setAllIncomes(prev => {
            const next = { ...prev };
            delete next[month];
            return next;
        });
    }, []);

    const canAddExpense = useCallback((amount) => {
        if (income === 0) {
            showNotification('Please set your monthly income first!', 'error');
            return false;
        }
        const newTotal = totalSpent + parseFloat(amount);
        if (newTotal > income) {
            const remaining = income - totalSpent;
            showNotification(`Expense exceeds your budget! You have ₹${remaining.toLocaleString('en-IN')} remaining.`, 'error');
            return false;
        }
        return true;
    }, [income, totalSpent]);

    const showNotification = useCallback((message, type = 'success') => {
        setNotification({ message, type, id: Date.now() });
    }, []);

    const getExpenseById = useCallback((id) => {
        return allExpenses.find(exp => exp._id === id);
    }, [allExpenses]);

    const value = {
        selectedMonth,
        setSelectedMonth,
        expenses,
        allExpenses,
        income,
        incomeData,
        totalSpent,
        remainingBalance,
        categoryTotals,
        biggestCategory,
        avgDailySpend,
        addExpense,
        updateExpense,
        deleteExpense,
        setIncomeForMonth,
        updateIncome,
        deleteIncome,
        canAddExpense,
        notification,
        showNotification,
        getExpenseById,
    };

    return (
        <ExpenseContext.Provider value={value}>
            {children}
        </ExpenseContext.Provider>
    );
}

export function useExpenses() {
    const context = useContext(ExpenseContext);
    if (!context) throw new Error('useExpenses must be used within ExpenseProvider');
    return context;
}
