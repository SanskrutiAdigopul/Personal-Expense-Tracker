import { ThemeProvider } from './context/ThemeContext';
import { ExpenseProvider } from './context/ExpenseContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Notification from './components/Notification';

function App() {
  return (
    <ThemeProvider>
      <ExpenseProvider>
        <div className="dashboard-page">
          <Navbar />
          <Dashboard />
          <Notification />
        </div>
      </ExpenseProvider>
    </ThemeProvider>
  );
}

export default App;
