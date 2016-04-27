var mongoose = require('mongoose');
var propertySchema = new mongoose.Schema({
  address: {
    string: String,
    streetName: String,
    neighborhood: String,
    city: String,
    county: String,
    state: String,
    zipCode: String,
    lat: Number,
    lng: Number
  },
  annualRentalAssumptions: [{type: mongoose.Schema.Types.ObjectId, ref: 'RentAssumption'}],
  closingCostRate: Number,
  currentVacancy: Number,
  currentBadDebt: Number,
  currentConcessions: Number,
  expenseInflation: Number,
  googleId:  String,
  image: 'string', // update this with aws
  incomeInflation:  Number,
  name:  String,
  loan: {type: mongoose.Schema.Types.ObjectId, ref: 'Loan'},
  parcelSize:  Number, // acres
  parking:  {

  },
  purchasePrice: Number,
  taxRate:  Number,
  units: [{type: mongoose.Schema.Types.ObjectId, ref: 'Unit'}],
  uploadImage:  String,
  yearBuilt:  Number,
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  createdAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Property', propertySchema);
