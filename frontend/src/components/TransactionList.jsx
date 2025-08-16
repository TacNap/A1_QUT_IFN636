import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { Toaster, toast } from 'sonner';

const TransactionList = ({ transactions, setTransactions, setEditingTransaction }) => {
  const { user } = useAuth();

  const handleDelete = async (transactionId) => {
    try {
      await axiosInstance.delete(`/api/transactions/${transactionId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTransactions(transactions.filter((transaction) => transaction._id !== transactionId));
      toast.success('Successfully deleted transaction.');
    } catch (error) {
      toast.warning('Failed to delete transaction.');
    }
  };

  

  return (
    <div className="">
      <Toaster />
      <table className="w-full border-collapse bg-white shadow-md rounded-lg mb-6 p-6">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-3 text-left font-bold">Vendor</th>
          <th className="border p-3 text-left font-bold">Category</th>
          <th className="border p-3 text-left font-bold">Amount</th>
          <th className="border p-3 text-left font-bold">Description</th>
          <th className="border p-3 text-left font-bold">Date</th>
          <th className="border "></th>
          <th className="border "></th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction) => (
          <tr key={transaction._id} className="hover:bg-gray-50">
            <td className="border p-3 font-bold">{transaction.vendor}</td>
            <td className="border p-3">{transaction.category}</td>
            <td className="border p-3 font-medium"><span className={`px-2 py-1 rounded  font-medium ${
                transaction.type === 'Send' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                ${transaction.amount}
              </span>
            </td>
            <td className="border p-3">{transaction.description}</td>
            <td className="border p-3 text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</td>
            <td className="border p-3">
              <button
                onClick={() => setEditingTransaction(transaction)}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
              >
                Edit
              </button>
            </td>
            <td className="border p-3">
              <button
                onClick={() => handleDelete(transaction._id)}
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

export default TransactionList;
