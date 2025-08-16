// Houses the CRUD functions for Transactions
const Transaction = require('../models/Transaction');

// Add Transaction
const addTransaction = async(req, res) => {
    const { vendor, date, type, category, amount, description } = req.body;
    try {
        const transaction = await Transaction.create({ userId: req.user.id, vendor, date, type, category, amount, description });
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 

// Get Transactions
const getTransactions = async(req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Transaction
const updateTransaction = async(req, res) => {
    const { vendor, date, type, category, amount, description} = req.body;
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) return res.status(404).json({ message: 'Transaction not found'});

        transaction.vendor = vendor || transaction.vendor;
        transaction.date = date || transaction.date;
        transaction.type = type || transaction.type;
        transaction.category = category || transaction.category;
        transaction.amount = amount || transaction.amount;
        transaction.description = description || transaction.description;

        const updatedTransaction = await transaction.save();
        res.json(updatedTransaction);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Transaction
const deleteTransaction = async(req,res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if(!transaction) return res.status(404).json({ message: "Transaction not found" });

        await transaction.remove();
        res.json({ message: "Transaction deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addTransaction, getTransactions, updateTransaction, deleteTransaction };