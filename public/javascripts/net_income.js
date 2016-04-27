function NetIncomeStatement(args) {
  this.incomeItems = {
    otherIncome: 39000
  };
  this.operatingExpenses = {
    generalAdministrative: 25000,
    marketing: 10000,
    maintenance: 30000
  };
}

NetIncomeStatement.prototype.addExpenseItem = function(item) {
  this.operatingExpenses.push(item);
}

NetIncomeStatement.prototype.addIncomeItem = function(item) {
  this.incomeItems.push(item);
}

NetIncomeStatement.prototype.incomeItemInYear = function(value, year) {
  var total = value;
  for (var i=0;i<year;i++) {
    total = total * (1 + property.incomeInflation);
  }
  return Math.round(total);
}

NetIncomeStatement.prototype.incomeItemsInYear = function(year) {
  var total = 0;
  for (var key in this.incomeItems) {
    total += this.incomeItemInYear(this.incomeItems[key], year)
  }
  return total;
}

NetIncomeStatement.prototype.totalIncomeYear = function(year) {
  return property.grossRentInYear(year) + this.incomeItemsInYear(year) + property.vacancyInYear(year) + property.concessionsInYear(year) + property.badDebtInYear(year);
}

NetIncomeStatement.prototype.expenseInYear = function(value, year) {
  var total = value;
  for (var i=0;i<year;i++) {
    total = total * (1 + property.expenseInflation);
  }
  return Math.round(total);
}

NetIncomeStatement.prototype.totalOperatingExpensesYear = function(year) {
  var total = 0;
  for (var key in this.operatingExpenses) {
    total += this.expenseInYear(this.operatingExpenses[key], year)
  }
  return total + property.propertyTaxInYear(year);
}

NetIncomeStatement.prototype.totalOperatingExpenses = function() {
  var total = 0;
  for (var key in this.operatingExpenses) {
    total += this.operatingExpenses[key]
  }
  return total + property.currentPropertyTax(); // depenency
}

NetIncomeStatement.prototype.currentTotalIncome = function() {
  // dependencies
  return this.totalIncomeItems() + property.grossRent() + property.currentVacancyAmount() + property.currentConcessionsAmount() + property.currentBadDebtAmount();
}

NetIncomeStatement.prototype.totalIncomeItems = function() {
  var total = 0;
  for (var key in this.incomeItems) {
    total += this.incomeItems[key]
  }
  return total;
}

NetIncomeStatement.prototype.netOperatingIncome = function() {
  return this.currentTotalIncome() - this.totalOperatingExpenses();
}

NetIncomeStatement.prototype.netOperatingIncomeYear = function(year) {
  return this.totalIncomeYear(year) - this.totalOperatingExpensesYear(year);
}

NetIncomeStatement.prototype.netIncomeYear = function(year) {
  // dependency
  return this.netOperatingIncomeYear(year) - property.loan.annualDebtServicePayment();
}


var netIncomeStatement = new NetIncomeStatement();
