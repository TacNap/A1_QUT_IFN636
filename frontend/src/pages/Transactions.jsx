import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { useAuth } from '../context/AuthContext';

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axiosInstance.get('/api/transactions', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTransactions(response.data);
      } catch (error) {
        alert('Failed to fetch transactions.');
      }
    };

    fetchTransactions();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <TransactionForm
        transactions={transactions}
        setTransactions={setTransactions}
        editingTransaction={editingTransaction}
        setEditingTransaction={setEditingTransaction}
      />
      <TransactionList transactions={transactions} setTransactions={setTransactions} setEditingTransaction={setEditingTransaction} />
    </div>
  );
};

export default Transactions;
