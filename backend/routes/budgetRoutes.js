const express = require('express');
const { addBudget, getBudgets, updateBudget, deleteBudget } = require('../controllers/BudgetController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, addBudget);
//router.get('/', protect, getBudgets);
//router.put('/:id', protect, updateBudget);
//router.delete('/:id', protect, deleteBudget);

module.exports = router;