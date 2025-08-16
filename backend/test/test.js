
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const { addTransaction, getTransactions, updateTransaction, deleteTransaction  } = require('../controllers/transactionController'); 
const { addBudget, getBudgets, updateBudget, deleteBudget  } = require('../controllers/budgetController'); 
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;


describe('addTransaction Function Test', () => {

  it('should create a new transaction successfully', async () => {
    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { vendor: "Test Vendor", date: "2025-08-14", type: "Send", category: "Groceries", amount: 50.99, description: "Test transaction" }
    };

    // Mock transaction that would be created
    const createdTransaction = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };

    // Stub Transaction.create to return the createdTransaction
    const createStub = sinon.stub(Transaction, 'create').resolves(createdTransaction);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addTransaction(req, res);

    // Assertions
    expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdTransaction)).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Transaction.create to throw an error
    const createStub = sinon.stub(Transaction, 'create').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { vendor: "Test Vendor", date: "2025-08-14", type: "Send", category: "Groceries", amount: 50.99, description: "Test transaction" }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addTransaction(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

});

describe('getTransactions Function Test', () => {

  it('should retrieve all transactions for a user successfully', async () => {
    const userId = new mongoose.Types.ObjectId();
    
    // Mock request data
    const req = {
      user: { id: userId }
    };

    // Mock transactions that would be found
    const mockTransactions = [
      { _id: new mongoose.Types.ObjectId(), userId, vendor: "Store A", date: "2025-08-14", type: "Send", category: "Groceries", amount: 50.99, description: "Groceries" },
      { _id: new mongoose.Types.ObjectId(), userId, vendor: "Store B", date: "2025-08-13", type: "Receive", category: "Salary", amount: 1000, description: "Monthly salary" }
    ];

    // Stub Transaction.find to return mock transactions
    const findStub = sinon.stub(Transaction, 'find').resolves(mockTransactions);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await getTransactions(req, res);

    // Assertions
    expect(findStub.calledOnceWith({ userId })).to.be.true;
    expect(res.json.calledWith(mockTransactions)).to.be.true;

    // Restore stubbed methods
    findStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Transaction.find to throw an error
    const findStub = sinon.stub(Transaction, 'find').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await getTransactions(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findStub.restore();
  });

});

describe('updateTransaction Function Test', () => {

  it('should update a transaction successfully', async () => {
    const transactionId = new mongoose.Types.ObjectId();
    const userId = new mongoose.Types.ObjectId();
    
    // Mock request data
    const req = {
      params: { id: transactionId },
      body: { vendor: "Updated Vendor", date: "2025-08-15", type: "Receive", category: "Income", amount: 75.50, description: "Updated transaction" }
    };

    // Mock existing transaction
    const existingTransaction = {
      _id: transactionId,
      userId,
      vendor: "Old Vendor",
      date: "2025-08-14",
      type: "Send",
      category: "Groceries",
      amount: 50.99,
      description: "Old transaction",
      save: sinon.stub().resolves()
    };

    // Update the transaction properties
    existingTransaction.vendor = req.body.vendor;
    existingTransaction.date = req.body.date;
    existingTransaction.type = req.body.type;
    existingTransaction.category = req.body.category;
    existingTransaction.amount = req.body.amount;
    existingTransaction.description = req.body.description;

    existingTransaction.save.resolves(existingTransaction);

    // Stub Transaction.findById to return existing transaction
    const findByIdStub = sinon.stub(Transaction, 'findById').resolves(existingTransaction);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await updateTransaction(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(transactionId)).to.be.true;
    expect(existingTransaction.save.calledOnce).to.be.true;
    expect(res.json.calledWith(existingTransaction)).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if transaction not found', async () => {
    const transactionId = new mongoose.Types.ObjectId();
    
    // Mock request data
    const req = {
      params: { id: transactionId },
      body: { vendor: "Updated Vendor", amount: 75.50 }
    };

    // Stub Transaction.findById to return null
    const findByIdStub = sinon.stub(Transaction, 'findById').resolves(null);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await updateTransaction(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(transactionId)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Transaction not found' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Transaction.findById to throw an error
    const findByIdStub = sinon.stub(Transaction, 'findById').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      params: { id: new mongoose.Types.ObjectId() },
      body: { vendor: "Updated Vendor", amount: 75.50 }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await updateTransaction(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

});

describe('deleteTransaction Function Test', () => {

  it('should delete a transaction successfully', async () => {
    const transactionId = new mongoose.Types.ObjectId();
    
    // Mock request data
    const req = {
      params: { id: transactionId }
    };

    // Mock existing transaction
    const existingTransaction = {
      _id: transactionId,
      vendor: "Test Vendor",
      remove: sinon.stub().resolves()
    };

    // Stub Transaction.findById to return existing transaction
    const findByIdStub = sinon.stub(Transaction, 'findById').resolves(existingTransaction);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteTransaction(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(transactionId)).to.be.true;
    expect(existingTransaction.remove.calledOnce).to.be.true;
    expect(res.json.calledWithMatch({ message: "Transaction deleted" })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if transaction not found', async () => {
    const transactionId = new mongoose.Types.ObjectId();
    
    // Mock request data
    const req = {
      params: { id: transactionId }
    };

    // Stub Transaction.findById to return null
    const findByIdStub = sinon.stub(Transaction, 'findById').resolves(null);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteTransaction(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(transactionId)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWithMatch({ message: "Transaction not found" })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Transaction.findById to throw an error
    const findByIdStub = sinon.stub(Transaction, 'findById').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      params: { id: new mongoose.Types.ObjectId() }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteTransaction(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

});

describe('addBudget Function Test', () => {

  it('should create a new budget successfully', async () => {
    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { category: "Groceries", amount: 500 }
    };

    // Mock budget that would be created
    const createdBudget = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };

    // Stub Budget.create to return the createdBudget
    const createStub = sinon.stub(Budget, 'create').resolves(createdBudget);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addBudget(req, res);

    // Assertions
    expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdBudget)).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Budget.create to throw an error
    const createStub = sinon.stub(Budget, 'create').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { category: "Groceries", amount: 500 }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addBudget(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

});

describe('getBudgets Function Test', () => {

  it('should retrieve all budgets for a user successfully', async () => {
    const userId = new mongoose.Types.ObjectId();
    
    // Mock request data
    const req = {
      user: { id: userId }
    };

    // Mock budgets that would be found
    const mockBudgets = [
      { _id: new mongoose.Types.ObjectId(), userId, category: "Groceries", amount: 500 },
      { _id: new mongoose.Types.ObjectId(), userId, category: "Entertainment", amount: 200 }
    ];

    // Stub Budget.find to return mock budgets
    const findStub = sinon.stub(Budget, 'find').resolves(mockBudgets);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await getBudgets(req, res);

    // Assertions
    expect(findStub.calledOnceWith({ userId })).to.be.true;
    expect(res.json.calledWith(mockBudgets)).to.be.true;

    // Restore stubbed methods
    findStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Budget.find to throw an error
    const findStub = sinon.stub(Budget, 'find').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await getBudgets(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findStub.restore();
  });

});

describe('updateBudget Function Test', () => {

  it('should update a budget successfully', async () => {
    const budgetId = new mongoose.Types.ObjectId();
    const userId = new mongoose.Types.ObjectId();
    
    // Mock request data
    const req = {
      params: { id: budgetId },
      body: { category: "Updated Category", amount: 750 }
    };

    // Mock existing budget
    const existingBudget = {
      _id: budgetId,
      userId,
      category: "Old Category",
      amount: 500,
      save: sinon.stub().resolves()
    };

    // Update the budget properties
    existingBudget.category = req.body.category;
    existingBudget.amount = req.body.amount;

    existingBudget.save.resolves(existingBudget);

    // Stub Budget.findById to return existing budget
    const findByIdStub = sinon.stub(Budget, 'findById').resolves(existingBudget);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await updateBudget(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(budgetId)).to.be.true;
    expect(existingBudget.save.calledOnce).to.be.true;
    expect(res.json.calledWith(existingBudget)).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if budget not found', async () => {
    const budgetId = new mongoose.Types.ObjectId();
    
    // Mock request data
    const req = {
      params: { id: budgetId },
      body: { category: "Updated Category", amount: 750 }
    };

    // Stub Budget.findById to return null
    const findByIdStub = sinon.stub(Budget, 'findById').resolves(null);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await updateBudget(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(budgetId)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Budget not found' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Budget.findById to throw an error
    const findByIdStub = sinon.stub(Budget, 'findById').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      params: { id: new mongoose.Types.ObjectId() },
      body: { category: "Updated Category", amount: 750 }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await updateBudget(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

});

describe('deleteBudget Function Test', () => {

  it('should delete a budget successfully', async () => {
    const budgetId = new mongoose.Types.ObjectId();
    
    // Mock request data
    const req = {
      params: { id: budgetId }
    };

    // Mock existing budget
    const existingBudget = {
      _id: budgetId,
      category: "Test Category",
      remove: sinon.stub().resolves()
    };

    // Stub Budget.findById to return existing budget
    const findByIdStub = sinon.stub(Budget, 'findById').resolves(existingBudget);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteBudget(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(budgetId)).to.be.true;
    expect(existingBudget.remove.calledOnce).to.be.true;
    expect(res.json.calledWithMatch({ message: "Budget deleted" })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if budget not found', async () => {
    const budgetId = new mongoose.Types.ObjectId();
    
    // Mock request data
    const req = {
      params: { id: budgetId }
    };

    // Stub Budget.findById to return null
    const findByIdStub = sinon.stub(Budget, 'findById').resolves(null);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteBudget(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(budgetId)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWithMatch({ message: "Budget not found" })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Budget.findById to throw an error
    const findByIdStub = sinon.stub(Budget, 'findById').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      params: { id: new mongoose.Types.ObjectId() }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteBudget(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

});