import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const TransactionList = ({ transactions, setTransaction, setEditingTransaction }) => {
  const { user } = useAuth();

  const handleDelete = async (transactionId) => {
    try {
      await axiosInstance.delete(`/api/transactions/${transactionId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTransaction(transactions.filter((transaction) => transaction._id !== transactionId));
    } catch (error) {
      alert('Failed to delete transaction.');
    }
  };

  return (
    <div>
      {transactions.map((transaction) => (
        <div key={transaction._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">{transaction.title}</h2>
          <p>{transaction.description}</p>
          <p className="text-sm text-gray-500">Deadline: {new Date(transaction.deadline).toLocaleDateString()}</p>
          <div className="mt-2">
            <button
              onClick={() => setEditingTransaction(transaction)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(transaction._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
