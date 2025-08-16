import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { Toaster, toast } from 'sonner';

const BudgetForm = ({ budgets, setBudgets, editingBudget, setEditingBudget }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ category: '', amount: '' });

  useEffect(() => {
    if (editingBudget) {
      setFormData({
        category: editingBudget.category,
        amount: editingBudget.amount,
      });
    } else {
      setFormData({ category: '', amount: '' });
    }
  }, [editingBudget]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBudget) {
        const response = await axiosInstance.put(`/api/budgets/${editingBudget._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBudgets(budgets.map((budget) => (budget._id === response.data._id ? response.data : budget)));
      } else {
        const response = await axiosInstance.post('/api/budgets', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBudgets([...budgets, response.data]);
      }
      setEditingBudget(null);
      setFormData({ category: '', amount: '' });
      toast.success('Success!');
    } catch (error) {
      toast.warning('Failed to save budget.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingBudget ? 'Update Budget' : 'Create Budget'}</h1>
      <select 
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      >
        <option value="">Select a Category</option>
        <option value="Groceries">Groceries</option>
        <option value="Rent">Rent</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Fuel">Fuel</option>
        <option value="Bills">Bills</option>
        <option value="Other">Other</option>
      </select>
      
      <input
        type="number"
        placeholder="Budget Amount ($)"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || '' })}
        className="w-full mb-4 p-2 border rounded"
        min="0"
        step="0.01"
        required
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingBudget ? 'Update' : 'Submit'}
      </button>
    </form>
  );
}

export default BudgetForm;