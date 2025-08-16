const mongoose = require('mongoose');

// DB Schema for Budget Table
// Budgets only require a Category and Amount
// Amount remaining is calculated live in the application rather than being held in the DB, to minimise operations.
const budgetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, enum: ['Groceries', 'Rent', 'Entertainment', 'Fuel', 'Bills', 'Other'], required: true },
    amount: { type: Number, required: true }
});

module.exports = mongoose.model('Budget', budgetSchema);