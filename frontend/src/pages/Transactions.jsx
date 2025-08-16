import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { useAuth } from '../context/AuthContext';
import { Toaster, toast } from 'sonner'; // Imported for popup messages after CRUD functions


const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const calculateNetFlow = () => {
    return transactions.reduce((total, transaction) => {
      if (transaction.type === 'Send') {
        return total - parseFloat(transaction.amount);
      } else if (transaction.type === 'Receive') {
        return total + parseFloat(transaction.amount);
      }
      return total;
    }, 0);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axiosInstance.get('/api/transactions', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTransactions(response.data);
      } catch (error) {
        toast.warning('Failed to fetch transactions');
      }
    };

    fetchTransactions();
  }, [user]);

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Toaster />
      <TransactionForm
        transactions={transactions}
        setTransactions={setTransactions}
        editingTransaction={editingTransaction}
        setEditingTransaction={setEditingTransaction}
      />
      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold mb-2">Net Flow</h2>
        <div className={`text-2xl sm:text-3xl font-bold ${calculateNetFlow() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          ${calculateNetFlow().toFixed(2)}
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Transactions</h1>
      <TransactionList transactions={transactions} setTransactions={setTransactions} setEditingTransaction={setEditingTransaction} />
      </div>
    </div>
  );
};

export default Transactions;
