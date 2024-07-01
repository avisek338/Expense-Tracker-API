const express = require('express')
const router = express.Router()
const {
    getAllEpenses,
    createExpense,
    getExpense,
    deleteExpense,
    updateExpense
}    = require('../controllers/expense')   

router.route('/').get(getAllEpenses).post(createExpense)
router.route('/:id').get(getExpense).delete(deleteExpense).patch(updateExpense)

module.exports = router