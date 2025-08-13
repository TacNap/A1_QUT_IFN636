const Transaction = require('../models/Transaction');

const addTransaction = async(req, res) => {
    const { vendor, date, type, category, amount, description } = req.body;
    try {
        const transaction = await Transaction.create({ userId: req.user.id, vendor, date, type, category, amount, description });
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
} 

module.exports = { addTransaction };