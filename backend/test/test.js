
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Transaction = require('../models/Transaction');
const { addTransaction } = require('../controllers/transactionController'); // Will later require editTransaction, getTransaction & deleteTransaction
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