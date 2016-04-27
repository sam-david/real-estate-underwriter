function Property(args) {
  this.address = {
    string: "",
    streetNumber: '',
    streetName: '',
    neighborhood: '',
    city: '',
    county: '',
    state: '',
    zipCode: '',
    lat: 37.7749,
    lng: -122.4194
  }
  this.annualRentalAssumptions = args.annualRentalAssumptions;
  this.closingCostRate = 2
  this.currentVacancy = 5;
  this.currentBadDebt = .5;
  this.currentConcessions = 1;
  this.exitCapRate = 5.5;
  this.expenseInflation = .02;
  this.googleAddress = {}
  this.googleId = "";
  this.image = 'images/stock-apartment.jpg';
  this.incomeInflation = .02;
  this.name = "";
  this.loan = args.loan;
  this.parcelSize = ""; // acres
  this.parking = {};
  this.purchasePrice = 1000000;
  this.taxRate = 1.27; // CA tax rate
  this.units = typeof args.units !== 'undefined' ?  args.units : [];
  this.yearBuilt = "";

}

Property.prototype.updateAddress = function() {

  if (this.googleAddress.hasOwnProperty('id')) {
    var parsedAddress = parseGoogleAddress(this.googleAddress) // dependency
    this.googleId = parsedAddress.googleId
    this.address.string = parsedAddress.formmattedAddress
    this.address.lat = parsedAddress.lat
    this.address.lng = parsedAddress.lng
    this.address.streetNumber = parsedAddress.streetNumber
    this.address.streetName = parsedAddress.streetName
    this.address.neighborhood = parsedAddress.neighborhood
    this.address.city = parsedAddress.city
    this.address.county = parsedAddress.county
    this.address.state = parsedAddress.state
    this.address.zipCode = parsedAddress.zipCode
    this.address.country = parsedAddress.country
    // Search Zillow and truilia with valid address
    Zillow.getProperty(this.address);
    Zillow.getRates(this.address.state);
    Trulia.getZipCodeInfo(this.address.zipCode);
  }
}

Property.prototype.save = function() {
  if (!user_id) {
    console.log('no user');
  } else {
    console.log('starting property save')
    var that = this;
    $.post( "/users/" + user_id + "/properties", { property: that.saveData() } )
    .done(function( data ) {
      console.log('property saved!', data)
    });
  }
}

Property.prototype.saveData = function() {
  return {
    address: {
      string: this.address.string,
      streetNumber: this.address.streetNumber,
      streetName: this.address.streetName,
      neighborhood: this.address.neighborhood,
      city: this.address.city,
      county: this.address.country,
      state: this.address.state,
      zipCode: this.address.zipCode,
      lat: this.address.lat,
      lng: this.address.lng
    },
    annualRentalAssumptions: this.annualRentalAssumptions,
    closingCostRate: this.closingCostRate,
    currentVacancy: this.currentVacancy,
    currentBadDebt: this.currentBadDebt,
    currentConcessions: this.currentConcessions,
    expenseInflation: this.expenseInflation,
    googleId:  this.googleId,
    image: this.image, // update this with aws
    incomeInflation:  this.incomeInflation,
    name:  this.name,
    loan: {
      amount: this.loan.amount, // check
      rate: this.loan.rate,
      amortizationPeriod: this.loan.amortizationPeriod
    },
    parcelSize:  this.parcelSize,
    parking:  this.parking,
    purchasePrice: this.purchasePrice,
    taxRate:  this.taxRate,
    units: this.units,
    yearBuilt:  this.yearBuilt
  }
}

Property.prototype.leveredIRR = function() {
  return IRR(this.IRRinput());
}

Property.prototype.IRRinput = function() {
  return [this.acquisitionTotal() + netIncomeStatement.netIncomeYear(1), netIncomeStatement.netIncomeYear(2), netIncomeStatement.netIncomeYear(3), netIncomeStatement.netIncomeYear(4), this.saleTotal()]
}

Property.prototype.projectReturn = function() {
  return this.acquisitionTotal() + netIncomeStatement.netIncomeYear(1) + netIncomeStatement.netIncomeYear(2) + netIncomeStatement.netIncomeYear(3) + netIncomeStatement.netIncomeYear(4) + this.saleTotal();
}

Property.prototype.saleTotal = function() {
  return netIncomeStatement.netIncomeYear(5) + this.salePrice() + -(this.saleClosingCosts()) + -(this.loan.presentValueInYear(5));
}

Property.prototype.acquisitionTotal = function() {
  return -(this.purchasePrice) + -(this.acquisitionClosingCosts()) + this.loan.amount ;
}


Property.prototype.saleClosingCosts = function() {
  return this.salePrice() * this.closingCostPercentage();
}

Property.prototype.acquisitionClosingCosts = function() {
  return this.purchasePrice * this.closingCostPercentage();
}

Property.prototype.closingCostPercentage = function() {
  return this.closingCostRate / 100
}

Property.prototype.salePrice = function() {
  return netIncomeStatement.netIncomeYear(5) / this.exitCapPercentage();
}

Property.prototype.exitCapPercentage = function() {
  return this.exitCapRate / 100;
}

Property.prototype.propertyTaxRatePercentage = function() {
  return this.taxRate / 100;
}

Property.prototype.currentPropertyTax = function() {
  return this.purchasePrice * this.propertyTaxRatePercentage();
}

Property.prototype.propertyTaxInYear = function(year) {
  // dependency
  return netIncomeStatement.expenseInYear(this.currentPropertyTax(), year);
}

Property.prototype.currentVacancyAmount = function() {
  return -(this.grossRent() * this.currentVacancyPercent());
}

Property.prototype.currentVacancyPercent = function() {
  return this.currentVacancy / 100;
}

Property.prototype.vacancyInYear = function(year) {
  return -(this.grossRentInYear(year) * this.vacancyInYearPercent(year - 1));
}

Property.prototype.vacancyInYearPercent = function(year) {
  return this.annualRentalAssumptions[year].vacancy / 100;
}

Property.prototype.currentConcessionsAmount = function() {
  return -(this.grossRent() * this.currentConcessionsPercent());
}

Property.prototype.currentConcessionsPercent = function() {
  return this.currentConcessions / 100;
}

Property.prototype.concessionsInYear = function(year) {
  return -(this.grossRentInYear(year) * this.concessionsInYearPercent(year - 1));
}

Property.prototype.concessionsInYearPercent = function(year) {
  return this.annualRentalAssumptions[year].vacancy / 100;
}


Property.prototype.currentBadDebtAmount = function() {
  return -(this.grossRent() * this.currentBadDebt);
}

Property.prototype.badDebtInYear = function(year) {
  return -(this.grossRentInYear(year) * this.badDebtInYearPercent(year - 1));
}

Property.prototype.badDebtInYearPercent = function(year) {
  return this.annualRentalAssumptions[year].badDebt / 100;
}

Property.prototype.capRate = function() {
  // dependency on netIncome
  return netIncomeStatement.netOperatingIncome()/ this.purchasePrice
}

Property.prototype.pricePerUnit = function() {
  return (this.purchasePrice / this.unitCount()).toFixed(2);
}

Property.prototype.pricePerSquareFeet = function() {
  return this.purchasePrice / this.rentableSquareFeet()
}

Property.prototype.unitCount = function() {
  var total = 0;
  for (var i=0;i<this.units.length;i++) {
    total += this.units[i].count
  }
  return total;
}

Property.prototype.grossRent = function() {
  return this.monthlyRent() * 12;
}

Property.prototype.grossRentInYear = function(year) {
  var total = this.grossRent();
  for (var i=0;i<year;i++) {
    total = total * (1 + this.grossRentInYearPercent(year - 1))
  }
  return Math.round(total);
}

Property.prototype.grossRentInYearPercent = function(year) {
  return this.annualRentalAssumptions[year].rentGrowth / 100;
}



Property.prototype.monthlyRent = function() {
  var monthlyTotal = 0;
  for (var i=0;i<this.units.length;i++) {
    monthlyTotal += (this.units[i].baseRent * this.units[i].count)
  }
  return monthlyTotal;
}

Property.prototype.rentableSquareFeet = function() {
  var total = 0;
  for (var i=0;i<this.units.length;i++) {
    total += (this.units[i].squareFeet * this.units[i].count)
  }
  return total;
}

Property.prototype.bedroomCount = function() {
  var total = 0;
  for (var i=0;i<this.units.length;i++) {
    total += (this.units[i].bedroom * this.units[i].count)
  }
  return total;
}

Property.prototype.bathroomCount = function() {
  var total = 0;
  for (var i=0;i<this.units.length;i++) {
    total += (this.units[i].bathroom * this.units[i].count)
  }
  return total;
}

// *************** RENTAL ASSUMPTIONS ***************

var defaultRentalAssumptionArgs = {
  rentGrowth: 3,
  vacancy: 5,
  concessions: 2,
  badDebt: .5
}

function defaultRentalAssumptions() {
  var final = []
  for (var i=0;i<5;i++) {
    final.push(new AnnualRentalAssumption(defaultRentalAssumptionArgs))
  }
  return final;
}

function AnnualRentalAssumption(args) {
  // all properties are percentage
  this.badDebt = args.badDebt;
  this.concessions = args.concessions;
  this.rentGrowth = args.rentGrowth;
  this.vacancy = args.vacancy;
}

// *************** UNITS ***************

function UnitType(args) {
  this.baseRent = args.baseRent;
  this.bathroom = args.bathroom;
  this.bedroom = args.bedroom;
  this.count = args.count;
  this.squareFeet = args.squareFeet;
}

UnitType.prototype.grossRent = function() {
  return (this.baseRent * this.count) * 12;
}

UnitType.prototype.pricePerSF = function() {
  return this.baseRent / this.squareFeet;
}

var unitA = {
  squareFeet: 441,
  baseRent: 905,
  bedroom: 1,
  bathroom: 1,
  count: 10
}

var unitB = {
  squareFeet: 482,
  baseRent: 975,
  bedroom: 1,
  bathroom: 1,
  count: 10
}

var units = [
  new UnitType(unitA),
  new UnitType(unitB)
]

// *************** LOAN ***************

var defaultLoanArgs = {
  amount: 700000,
  rate: 5.45,
  amortizationPeriod: 30
}

function AmortizedLoan(args) {
  this.amount = args.amount;
  this.rate = args.rate;
  this.amortizationPeriod = 30;
}

AmortizedLoan.prototype.monthlyRate = function() {
  return this.ratePercentage() / 12;
}

AmortizedLoan.prototype.ratePercentage = function() {
  return this.rate / 100;
}

AmortizedLoan.prototype.monthlyPeriods = function() {
  return this.amortizationPeriod * 12;
}

AmortizedLoan.prototype.monthlyDebtServicePayment = function() {
  return (this.monthlyRate() * this.amount) / (1 - Math.pow(1 + this.monthlyRate(), -(this.monthlyPeriods())))
}

AmortizedLoan.prototype.annualDebtServicePayment = function() {
  return this.monthlyDebtServicePayment() * 12;
}

AmortizedLoan.prototype.presentValueInYear = function(year) {
  return PV(this.monthlyRate(),300,this.monthlyDebtServicePayment())
}

var loan = new AmortizedLoan(defaultLoanArgs);

var propertyStats = {
  purchasePrice: 10000000,
  units: units,
  name: 'Sorrento',
  yearBuilt: 1992,
  parcelSize: 2.5,
  parking: {
    garages: 48,
    openSpaces: 110
  },
  annualRentalAssumptions: defaultRentalAssumptions(),
  image: 'images/modern-apartment.jpg',
  loan: loan
}
var property = new Property(propertyStats)


