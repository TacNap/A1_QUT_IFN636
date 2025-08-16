import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import BudgetProgressBar from './BudgetProgressBar';
import { toast } from 'sonner';

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
    
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Budget Progress</h2>
      {budgets.map((budget) => (
        <BudgetProgressBar key={budget._id} budget={budget} />
      ))}
    </div>
    </div>
  );
};

export default BudgetList;