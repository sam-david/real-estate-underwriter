var app = angular.module('realEstateUnderwriter', ['ui.router', 'ui.gravatar','uiGmapgoogle-maps','google.places']);

angular.module('realEstateUnderwriter')
.filter('percentage', ['$filter', function($filter) {
    return function(input, decimals) {
        return $filter('number')(input*100, decimals)+'%';
    };
}]);

angular.module('realEstateUnderwriter')
.filter('convertCamelCase', ['$filter', function($filter) {
    return function(string) {
      var result = string.replace( /([A-Z])/g, " $1" );
      return result.charAt(0).toUpperCase() + result.slice(1);
    };
}]);

angular.module('realEstateUnderwriter')
.filter('nfcurrency', [ '$filter', '$locale', function ($filter, $locale) {
    var currency = $filter('currency'), formats = $locale.NUMBER_FORMATS;
    return function (amount, symbol) {
        var value = currency(amount, symbol);
        return value.replace(new RegExp('\\' + formats.DECIMAL_SEP + '\\d{2}'), '')
    }
}])

app.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);

// app.config(function(uiGmapGoogleMapApiProvider) {
//     uiGmapGoogleMapApiProvider.configure({
//       key: 'AIzaSyBw3oX-agCA402rmR1bdD0i89Ep6_jws2E'
//     });
// })

app.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('error');
  $urlRouterProvider.when('','start');

  $stateProvider.state('start', {
    url: '/start',
    templateUrl: 'templates/start.html',
    controller: 'DashboardCtrl'
  });

  $stateProvider.state('dashboard', {
    url: '/dashboard',
    templateUrl: 'templates/dashboard.html',
    controller: 'DashboardCtrl'
  });

  $stateProvider.state('units', {
    url: '/units',
    templateUrl: 'templates/units.html',
    controller: 'DashboardCtrl'
  });

  $stateProvider.state('net_income', {
    url: '/net_income',
    templateUrl: 'templates/net_income.html',
    controller: 'DashboardCtrl'
  });

  $stateProvider.state('cash_flow', {
    url: '/cash_flow',
    templateUrl: 'templates/cash_flow.html',
    controller: 'DashboardCtrl'
  });

  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'DashboardCtrl'
  });

  $stateProvider.state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'DashboardCtrl'
  });

  $stateProvider.state('error', {
    url: '/error',
    templateUrl: 'templates/error.html'
  });
});

app.controller('DashboardCtrl', ['$scope', '$log','$http', '$window', function($scope, $log, $http, $window){
  (function(){
    return $http.get('/currentuser').success(function(data){
      $scope.user = data;
      $window.user_id = data._id;
      console.log($scope.user)
    });
  })();
  $scope.property = property;
  $scope.map = { center: { latitude: $scope.property.address.lat, longitude: $scope.property.address.lng }, zoom: 12 };

  $scope.marker = {
    coords: { latitude: $scope.property.address.lat, longitude: $scope.property.address.lng }
  }
  // $scope.map.newAddress = function() {
  //   if (newMap ==)
  // }
 //  setInterval(function(){
 //    console.log('moving')
 //   $scope.map.center.latitude = 47;
 // }, 3000);
  $scope.showAddExpense = false;
  $scope.unitCount = $scope.property.unitCount();
  $scope.rentableSquareFeet = $scope.property.rentableSquareFeet();
  $scope.parcelSize = $scope.property.parcelSize;
  $scope.parking = $scope.property.parking;
  $scope.annualRentalAssumptions = $scope.property.annualRentalAssumptions;

  // $scope.unit = {count: 10}

  $scope.updateAddress = function() {
    $scope.property.updateAddress();
  }

  $scope.updateProperty = function(property) {
    $scope.property = property;
  }

  $scope.saveProperty = function() {
    // check user
    // validations
    console.log('saving', $scope.property, property)
    alertify.prompt("Save property name (If blank, address will be used)", $scope.property.name,
    function(evt, value ){
      // alertify.success('Ok: ' + value);
      $scope.property.save();
      $window.location.reload();
    },
    function(){
      alertify.error('Cancel');
    })
  }

  $scope.propertyAddressExists = function(address) {
    // var
    // $scope.user.properties
  }

  $scope.loadProperty = function(propertyId) {
    for (var p=0;p<$scope.user.properties.length;p++) {
      if ($scope.user.properties[p]._id == propertyId) {
        console.log('Loading', $scope.user.properties[p])
        console.log('a', $scope.property)
        $scope.property.annualRentalAssumptions = $scope.user.properties[p].annualRentalAssumptions;
        $scope.property.address = $scope.user.properties[p].address;
        $scope.property.closingCostRate = $scope.user.properties[p].closingCostRate;
        $scope.property.currentVacancy = $scope.user.properties[p].currentVacancy;
        $scope.property.currentBadDebt = $scope.user.properties[p].currentBadDebt;
        $scope.property.currentConcessions = $scope.user.properties[p].currentConcessions;
        $scope.property.expenseInflation = $scope.user.properties[p].expenseInflation;
        $scope.property.googleId =  $scope.user.properties[p].googleId;
        $scope.property.image = $scope.user.properties[p].image;
        $scope.property.incomeInflation =  $scope.user.properties[p].incomeInflation;
        $scope.property.name =  $scope.user.properties[p].name;
        $scope.property.loan.amount = $scope.user.properties[p].loan.amount;
        $scope.property.loan.rate = $scope.user.properties[p].loan.rate;
        $scope.property.loan.amortizationPeriod = $scope.user.properties[p].loan.amortizationPeriod;
        $scope.property.parcelSize =  $scope.user.properties[p].parcelSize;
        $scope.property.parking =  $scope.user.properties[p].parking
        $scope.property.purchasePrice = $scope.user.properties[p].purchasePrice
        $scope.property.taxRate =  $scope.user.properties[p].taxRate
        $scope.property.units = $scope.user.properties[p].units
        $scope.property.yearBuilt =  $scope.user.properties[p].yearBuilt
        $scope.property.user = $scope.user.properties[p].user
        $scope.property.createdAt = $scope.user.properties[p].createdAt;

        console.log('b', $scope.property)
        $('#property-address').val($scope.user.properties[p].address.string)
      }
    }
  }

  $scope.removeUnit = function(unit) {
    $scope.property.units.splice($scope.property.units.indexOf(unit), 1);
    alertify.message('Removed units');
  }

  $scope.submitUnit = function(unit) {
    if (unit == undefined){
      alertify.message('Please fill out unit details');
    } else if ($scope.unitMissingProperties(unit).length == 0) {
      $scope.property.units.push(unit)
      alertify.message('Added units');
      this.unit = {};
    } else {
      alertify.message('Missing: ' + $scope.unitMissingProperties(unit).map(function(obj) {
          return obj.capitalizeFirstLetter();
        }).join());
    }
  }

  $scope.addExpense = function(expense) {
    netIncomeStatement.operatingExpenses[expense.name] = expense.amount
    alertify.message('Added Expense');
    this.expense = {};
    $scope.toggleAddExpense();
  }

  $scope.removeExpense = function(expenseName) {
    delete netIncomeStatement.operatingExpenses[expenseName]
    alertify.message('Removed Expense');
  }

  $scope.toggleAddExpense = function() {
    $scope.showAddExpense = !$scope.showAddExpense;
  }

  $scope.unitMissingProperties = function(unit) {
    var missingProps = []
    function hasProperty(property) {
      if (unit.hasOwnProperty(property) == false) {
        missingProps.push(property)
      }
    }
    hasProperty('count')
    hasProperty('bedroom')
    hasProperty('bathroom')
    hasProperty('squareFeet')
    hasProperty('baseRent')
    return missingProps;
  }

  $scope.netIncomeStatement = netIncomeStatement;
}]);

