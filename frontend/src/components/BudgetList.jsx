import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const BudgetList = ({ budgets, setBudgets, setEditingBudget }) => {
  const { user } = useAuth();

  const handleDelete = async (budgetId) => {
    try {
      await axiosInstance.delete(`/api/budgets/${budgetId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setBudgets(budgets.filter((budget) => budget._id !== budgetId));
      alert('Success!');
    } catch (error) {
      alert('Failed to delete budget.');
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
    </div>
  );
};

export default BudgetList;