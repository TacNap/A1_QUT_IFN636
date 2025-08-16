import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import BudgetForm from '../components/BudgetForm';
import BudgetList from '../components/BudgetList';
import { useAuth } from '../context/AuthContext';
import { Toaster, toast } from 'sonner';

const Budgets = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [editingBudget, setEditingBudget] = useState(null);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await axiosInstance.get('/api/budgets', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBudgets(response.data);
      } catch (error) {
        toast.warning('Failed to fetch budgets.');
      }
    };

    fetchBudgets();
  }, [user]);



  return (
    <div className="container mx-auto p-6">
      <Toaster />
      <BudgetForm
        budgets={budgets}
        setBudgets={setBudgets}
        editingBudget={editingBudget}
        setEditingBudget={setEditingBudget}
      />

    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h1 className="text-2xl font-bold mb-4">Budgets</h1>
      <BudgetList budgets={budgets} setBudgets={setBudgets} setEditingBudget={setEditingBudget} /> 
      </div>
    </div>
  );
};

export default Budgets;