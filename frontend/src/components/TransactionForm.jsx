import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const TransactionForm = ({ transactions, setTransactions, editingTransaction, setEditingTransaction }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ vendor: '', date: '', type: '', category: '', amount: '', description: ''});

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        vendor: editingTransaction.vendor,
        date: editingTransaction.date,
        type: editingTransaction.type,
        category: editingTransaction.category,
        amount: editingTransaction.amount,
        description: editingTransaction.description,
      });
    } else {
      setFormData({ vendor: '', date: '', type: '', category: '', amount: '', description: ''});
    }
  }, [editingTransaction]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTransaction) {
        const response = await axiosInstance.put(`/api/transactions/${editingTransaction._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTransactions(transactions.map((transaction) => (transaction._id === response.data._id ? response.data : transaction)));
      } else {
        const response = await axiosInstance.post('/api/transactions', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTransactions([...transactions, response.data]);
      }
      setEditingTransaction(null);
      setFormData({ vendor: '', date: '', type: '', category: '', amount: '', description: '' });
    } catch (error) {
      alert('Failed to save transaction.');
    }
  };


  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingTransaction ? 'Transaction' : 'Your Form Name: Create Operation'}</h1>
      <input
        type="text"
        placeholder="Vendor"
        value={formData.vendor}
        onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="Type"
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="Category"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="Amount"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingTransaction ? 'Update Button' : 'Create Button'}
      </button>
    </form>
  );
}


export default TransactionForm;
