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
      
      {/* Large Screen View */}
      {/* This section is not visible when the screen is small */}
      <div className="hidden md:block">
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

      {/* Small Screen View */}
      {/* This section is only visible when the screen is small enough. */}
      <div className="md:hidden space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">{transaction.vendor}</h3>
              <span className={`px-2 py-1 rounded text-sm font-medium ${
                transaction.type === 'Send' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                ${transaction.amount}
              </span>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              <div className="mb-1"><span className="font-medium">Category:</span> {transaction.category}</div>
              <div className="mb-1"><span className="font-medium">Date:</span> {new Date(transaction.date).toLocaleDateString()}</div>
              {transaction.description && (
                <div><span className="font-medium">Description:</span> {transaction.description}</div>
              )}
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setEditingTransaction(transaction)}
                className="flex-1 bg-blue-500 text-white py-2 px-3 rounded text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(transaction._id)}
                className="flex-1 bg-red-500 text-white py-2 px-3 rounded text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
