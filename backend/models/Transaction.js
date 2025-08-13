const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vendor: { type: String, required: true },
    description: { type: String}, 
    date: { type: Date },
    type: { type: String, enum: ['Send', 'Receive'], required: true },
    category: { type: String, enum: ['Groceries', 'Rent', 'Entertainment', 'Fuel', 'Bills', 'Other'], required: true }    
});

module.exports = mongoose.model('Transaction', transactionSchema);