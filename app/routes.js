var Property = require('../app/models/property');
var User = require('../app/models/user');
var Unit = require('../app/models/unit');
var RentAssumption = require('../app/models/rentAssumptions');
var Loan = require('../app/models/loan');
var zillow = require('../app/models/zillow');
var trulia = require('../app/models/trulia');


module.exports = function(app, passport) {

  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  // access req.query for params
  app.get('/zillow/rates', function(req, res) {
    var state = req.query.state || 'CA'

    zillow.getCurrentRates(state, function(body) {
      res.send(body);
    });
  });

  app.get('/zillow/property', function(req, res) {
    zillow.getPropertyInfo(req.query.address, function(body) {
      res.send(body);
    });
  });

  app.get('/trulia/location', function(req, res) {
    console.log('getting truilia property')
    trulia.getZipCodeStats(req.query.zipCode, function(body) {
      res.send(body);
    });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
      successRedirect : '/', // redirect to the secure profile section
      failureRedirect : '/#/login', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
    }));

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
      successRedirect : '/', // redirect to the secure profile section
      failureRedirect : '/#/signup', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
    }));

  app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/#/profile',
    failureRedirect: '/'
  }));

  app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email']}));

  app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/#/profile',
    failureRedirect: '/'
  }));

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/users/:user_id', function(req, res, next){
    var user_id = req.params.user_id;
    var query = User.findById(user_id)
    query.exec(function(err, user){
      if(err){return next(err);}
      user.populate('properties', function(err, user){
        if(err){return next(err);}
        res.json(user.properties);
      })
    })
  });

  app.post('/users/:user_id/properties', function(req, res, next) {
    // create new Property
    var requestBody = req.body.property
    console.log(requestBody)
    var property = new Property({
      address: {
        string: requestBody.address.string,
        streetNumber: requestBody.address.streetNumber,
        streetName: requestBody.address.streetName,
        neighborhood: requestBody.address.neighborhood,
        city: requestBody.address.city,
        county: requestBody.address.country,
        state: requestBody.address.state,
        zipCode: requestBody.address.zipCode,
        lat: requestBody.address.lat,
        lng: requestBody.address.lng
      },
      closingCostRate: requestBody.closingCostRate,
      currentVacancy: requestBody.currentVacancy,
      currentBadDebt: requestBody.currentBadDebt,
      currentConcessions: requestBody.currentConcessions,
      expenseInflation: requestBody.expenseInflation,
      googleId:  requestBody.googleId,
      image: requestBody.image,
      incomeInflation:  requestBody.incomeInflation,
      name:  requestBody.name,
      parcelSize:  requestBody.parcelSize,
      parking:  requestBody.parking,
      purchasePrice: requestBody.purchasePrice,
      taxRate:  requestBody.taxRate,
      yearBuilt:  requestBody.yearBuilt
    });

    // add units
    for (var u=0;u<requestBody.units.length;u++) {
      var currentUnit = new Unit({
        baseRent: requestBody.units[u].baseRent,
        bathroom: requestBody.units[u].bathroom,
        bedroom: requestBody.units[u].bedroom,
        count: requestBody.units[u].count,
        squareFeet: requestBody.units[u].squareFeet
      })
      property.units.push(currentUnit)
      currentUnit.save()
    }

    // add rentalassumptions
    for (var a=0;a<requestBody.annualRentalAssumptions.length;a++) {
      var currentAssumption = new RentAssumption({
        badDebt: requestBody.annualRentalAssumptions[a].badDebt,
        concessions: requestBody.annualRentalAssumptions[a].concessions,
        rentGrowth: requestBody.annualRentalAssumptions[a].rentGrowth,
        vacancy: requestBody.annualRentalAssumptions[a].vacancy
      })
      property.annualRentalAssumptions.push(currentAssumption)
      currentAssumption.save()
    }

    // add loan
    var currentLoan = new Loan({
      amount: requestBody.loan.amount,
      rate: requestBody.loan.rate,
      amortizationPeriod: requestBody.loan.amortizationPeriod
    })
    property.loan = currentLoan
    currentLoan.save()

    var user_id = req.params.user_id;
    var query = User.findById(user_id);
    query.exec(function(err, user){
      if(err){return next(err);}
      property.user = user;
      user.properties.push(property);
      user.save(function(err, user){
        if(err){return next(err);}
        res.json(property);
      });
      property.save();
    });
  });

  app.get('/currentuser', function(req, res) {
    if (!req.user) {
      res.json(req.user)
    } else {
      var user_id = req.user._id;
      // User.findById().populate({ path: 'properties' })
      // .exec(function(err, user) {

      //   var opts = [
      //       { path: 'units', model: 'Unit' }
      //     , { path: 'annualRentalAssumptions', model: 'RentAssumption' }
      //     , { path: 'loan', model: 'Loan' }
      //   ]

      //   if (err) return res.json(500);
      //   User.populate(user, opts, function (err, user) {
      //     console.log(user)
      //     res.json(user);
      //   });
      // })


      User.findById(user_id).populate({
        path: 'properties',
        populate: [{
          path: 'units',
          model: 'Unit'
        },
        {
          path: 'annualRentalAssumptions',
          model: 'RentAssumption'
        },
        {
          path: 'loan',
          model: 'Loan'
        }]
      }).exec(function(err, user) {
        if(err){return next(err);}
        res.json(user);
      });

      // var query = User.findById(user_id)
      // query.exec(function(err, user){
      //   if(err){return next(err);}
      //   user.populate('properties', function(err, user){
      //     if(err){return next(err);}
      //     user.properties.populate('units', function(err, property) {
      //       if(err){return next(err);}
      //       res.json(user);
      //     })
      //   })
      // })
    };
  });

  app.get('*', function(req, res){
    res.redirect('/#/<error></error>')
  })

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
      return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
  }
