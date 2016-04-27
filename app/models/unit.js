var mongoose = require('mongoose');
var unitSchema = new mongoose.Schema({
  baseRent: Number,
  bathroom: Number,
  bedroom: Number,
  count: Number,
  squareFeet: Number,
  property: {type: mongoose.Schema.Types.ObjectId, ref: 'Property'},
  createdAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Unit', unitSchema);
