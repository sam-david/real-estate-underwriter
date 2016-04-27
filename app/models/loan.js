var mongoose = require('mongoose');
var loanSchema = new mongoose.Schema({
  amount: Number,
  rate: Number,
  amortizationPeriod: Number, // Years
  property: {type: mongoose.Schema.Types.ObjectId, ref: 'Property'},
  createdAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Loan', loanSchema);

