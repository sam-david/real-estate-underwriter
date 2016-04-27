var mongoose = require('mongoose');
var rentAssumptionSchema = new mongoose.Schema({
  badDebt: Number,
  concessions: Number,
  rentGrowth: Number,
  vacancy: Number,
  property: {type: mongoose.Schema.Types.ObjectId, ref: 'Property'},
  createdAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model('RentAssumption', rentAssumptionSchema);
