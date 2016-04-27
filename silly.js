
// *************** INCOME ITEMS ***************

var incomeItems = [
  {
    amount: 69000,
    type: 'rubs'
  },
  {
    amount: 10000,
    type: 'parking'
  },
  {
    amount: 69000,
    type: 'rubs'
  }
]

function bulkAddIncomeItems(expenseItems) {

}

// *************** EXPENSES ***************

var expenseItems = [
  {
    amount: 10000,
    type: 'Payroll'
  },
  {
    amount: 30344,
    type: 'General Administrative'
  },
  {
    amount: 23045,
    type: 'Marketing'
  },
  {
    amount: 44406,
    type: 'Maintenance and Repair'
  },
]

function bulkAddExpenseItems(expenseItems) {
  for (var i=0;i<expenseItems.length;i++) {
    netIncome.addExpenseItem(new ExpenseItem(expenseItems[i]))
  }
}

// netIncome.addExpenseItem(new ExpenseItem(payroll))

bulkAddExpenseItems(expenseItems)
console.log(netIncome.operatingExpenses)
console.log(netIncome.totalOperatingExpenses())


