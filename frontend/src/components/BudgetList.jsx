import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import BudgetProgressBar from './BudgetProgressBar';
import { toast } from 'sonner';

// This components renders budgets in a table or card view,
// depending on the screen size

const BudgetList = ({ budgets, setBudgets, setEditingBudget }) => {
  const { user } = useAuth();

  const handleDelete = async (budgetId) => {
    try {
      await axiosInstance.delete(`/api/budgets/${budgetId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setBudgets(budgets.filter((budget) => budget._id !== budgetId));
      toast.success('Successfully deleted budget.');
    } catch (error) {
      toast.warning('Failed to delete budget.');
    }
  };

  return (
    <div className="">
      
      {/* Large Screen View - Similar to Transactions.jsx */}
      <div className="hidden md:block">
        <table className="w-full border-collapse bg-white shadow-md rounded-lg mb-6 p-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 text-left font-bold">Category</th>
              <th className="border p-3 text-left font-bold">Amount</th>
              <th className="border "></th>
              <th className="border "></th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((budget) => (
              <tr key={budget._id} className="hover:bg-gray-50">
                <td className="border p-3 font-bold">{budget.category}</td>
                <td className="border p-3 font-medium">
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 font-medium">
                    ${budget.amount}
                  </span>
                </td>
                <td className="border p-3">
                  <button
                    onClick={() => setEditingBudget(budget)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                </td>
                <td className="border p-3">
                  <button
                    onClick={() => handleDelete(budget._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Small Screen View. Similar to Transactions.jsx */}
      <div className="md:hidden space-y-4 mb-6">
        {budgets.map((budget) => (
          <div key={budget._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg">{budget.category}</h3>
              <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-sm font-medium">
                ${budget.amount}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingBudget(budget)}
                className="flex-1 bg-blue-500 text-white py-2 px-3 rounded text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(budget._id)}
                className="flex-1 bg-red-500 text-white py-2 px-3 rounded text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    
    <div className="mt-4 sm:mt-6">
      <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">Budget Progress</h2>
      {budgets.map((budget) => (
        <BudgetProgressBar key={budget._id} budget={budget} />
      ))}
    </div>
    </div>
  );
};

export default BudgetList;