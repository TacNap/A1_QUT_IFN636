import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { Toaster, toast } from 'sonner';

const TransactionForm = ({ transactions, setTransactions, editingTransaction, setEditingTransaction }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ vendor: '', date: '', type: '', category: '', amount: '', description: ''});

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        vendor: editingTransaction.vendor,
        date: editingTransaction.date ? new Date(editingTransaction.date).toISOString().split('T')[0] : '',
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
      toast.success('Successfully saved transaction.');
    } catch (error) {
      toast.warning('Failed to save transaction.');
    }
  };


  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 shadow-md rounded mb-4 sm:mb-6">
      <Toaster />
      <h1 className="text-xl sm:text-2xl font-bold mb-4">{editingTransaction ? 'Update Transaction' : 'Create Transaction'}</h1>
      <input
        type="text"
        placeholder="Vendor"
        value={formData.vendor}
        onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <input
        type="date"
        placeholder="Date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <select 
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      >
        <option value="">Select a Transaction Type</option>
        <option value="Send">Send</option>
        <option value="Receive">Receive</option>
      </select>
      <select 
        placeholder="category"
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
        placeholder="Amount ($)"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || '' })}
        className="w-full mb-4 p-2 border rounded"
        min="0"
        step="0.01"
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingTransaction ? 'Update' : 'Submit'}
      </button>
    </form>
  );
}


export default TransactionForm;
