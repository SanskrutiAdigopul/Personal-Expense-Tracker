import { useState, useEffect } from 'react';
import { useExpenses } from '../context/ExpenseContext';

export default function Notification() {
    const { notification } = useExpenses();
    const [visible, setVisible] = useState(false);
    const [current, setCurrent] = useState(null);

    useEffect(() => {
        if (notification) {
            setCurrent(notification);
            setTimeout(() => setVisible(true), 10);

            const timer = setTimeout(() => {
                setVisible(false);
                setTimeout(() => setCurrent(null), 300);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [notification]);

    if (!current) return null;

    return (
        <div className={`notification ${current.type} ${visible ? 'show' : ''}`}>
            <span>{current.message}</span>
            <button
                className="notification-close"
                onClick={() => {
                    setVisible(false);
                    setTimeout(() => setCurrent(null), 300);
                }}
            >
                &times;
            </button>
        </div>
    );
}
