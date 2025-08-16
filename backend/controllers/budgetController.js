// Houses the CRUD functions for Budgets.
const Budget = require('../models/Budget');

// Add Budget
const addBudget = async(req, res) => {
    const { category, amount } = req.body;
    try {
        const budget = await Budget.create({ userId: req.user.id, category, amount });
        res.status(201).json(budget);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 

// Get Budgets
const getBudgets = async(req, res) => {
    try {
        const budgets = await Budget.find({ userId: req.user.id });
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Budget
const updateBudget = async(req, res) => {
    const { category, amount } = req.body;
    try {
        const budget = await Budget.findById(req.params.id);
        if (!budget) return res.status(404).json({ message: 'Budget not found'});

        budget.category = category || budget.category;
        budget.amount = amount || budget.amount;

        const updatedBudget = await budget.save();
        res.json(updatedBudget);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Budget
const deleteBudget = async(req,res) => {
    try {
        const budget = await Budget.findById(req.params.id);
        if(!budget) return res.status(404).json({ message: "Budget not found" });

        await budget.remove();
        res.json({ message: "Budget deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addBudget, getBudgets, updateBudget, deleteBudget };