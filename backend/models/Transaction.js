const mongoose = require('mongoose');

// DB Schema for Transaction table
// Net Flow is calculated live within the application
const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vendor: { type: String, required: true }, // The other person/vendor in the transaction
    date: { type: Date },
    type: { type: String, enum: ['Send', 'Receive'], required: true }, // Deposit / Withdraw
    category: { type: String, enum: ['Groceries', 'Rent', 'Entertainment', 'Fuel', 'Bills', 'Other'], required: true },    
    amount: { type: Number, required: true },
    description: { type: String } // Optional desc
});

module.exports = mongoose.model('Transaction', transactionSchema);