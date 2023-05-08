const { addExpense, getExpense, deleteExpense } = require('../controllers/expense');
const { addIncome, getIncomes, deleteIncome } = require('../controllers/income');
const {login, register, authenticate, updatePassword} = require('../controllers/user')

const router = require('express').Router();

router.post('/add-income',authenticate , addIncome)
      .get('/get-incomes',authenticate, getIncomes)
      .delete('/delete-income/:id',authenticate , deleteIncome)
      .post('/add-expense',authenticate , addExpense)
      .get('/get-expenses',authenticate , getExpense)
      .delete('/delete-expense/:id',authenticate, deleteExpense)
      .post('/login', login)
      .post('/register', register)
      .put('/reset-password',authenticate , updatePassword)

module.exports = router