import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const BudgetProgressBar = ({ budget }) => {
  const { user } = useAuth();
  const [spent, setSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/transactions', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        
        const categoryTransactions = response.data.filter(
          transaction => transaction.category === budget.category
        );
        
        const totalSpent = categoryTransactions.reduce((sum, transaction) => {
          return sum + transaction.amount;
        }, 0);
        
        setSpent(totalSpent);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        setSpent(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [budget.category, user.token]);

  const percentage = budget.amount > 0 ? Math.min((spent / budget.amount) * 100, 100) : 0;
  const isOverBudget = spent > budget.amount;

  if (loading) {
    return (
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-base font-medium text-gray-700">{budget.category}</span>
          <span className="text-sm font-medium text-gray-500">Loading...</span>
        </div>
        <div className="w-full h-6 bg-gray-200 rounded-full">
          <div className="h-6 bg-gray-300 rounded-full animate-pulse" style={{ width: "30%" }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-gray-700">{budget.category}</span>
        <span className={`text-sm font-medium ${isOverBudget ? 'text-red-600' : 'text-blue-700'}`}>
          ${spent.toFixed(2)} / ${budget.amount.toFixed(2)} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <div className="w-full h-6 bg-gray-200 rounded-full">
        <div 
          className={`h-6 rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-blue-600'}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default BudgetProgressBar;