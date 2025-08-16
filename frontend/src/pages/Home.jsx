const Home = () => {
  return (
    <div className="container mx-auto p-4 sm:p-6 flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
          Welcome to Budget Tracker
        </h1>
        <p className="text-lg text-gray-600">
          Login or go to Transactions to start.
        </p>
      </div>
    </div>
  );
};

export default Home;