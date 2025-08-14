const express = require('express');
const { addTransaction } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

//router.route('/').post(protect, addTransaction);
router.post('/', protect, addTransaction);
// router.route('/').get(protect, getTransaction).post(protect, addTransaction);
// router.route('/:id').put(protect, updateTransaction).delete(protect, deleteTransaction);

module.exports = router;