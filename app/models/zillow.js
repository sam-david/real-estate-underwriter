var request = require("request");
var parseXML = require('xml2js').parseString;
var secretKey = require('../../secret');

function returnProperty(response,firstProp,secondProp,thirdProp) {
  console.log('firstProp',firstProp,'secondProp',secondProp)
  if (thirdProp != undefined) {
    if (response[firstProp][0][secondProp][0][thirdProp] == undefined) {
      return null;
    } else {
      return response[firstProp][0][secondProp][0][thirdProp];
    }
  }
  if (secondProp != undefined) {
    if (response[firstProp][0][secondProp] == undefined) {
      return null;
    } else {
      return response[firstProp][0][secondProp][0];
    }
  } else {
    if (response[firstProp] == undefined) {
      return null;
    } else {
      return response[firstProp][0];
    }
  }
  return null;
}

function parseProperties(response) {
  console.log('resy', response["SearchResults:searchresults"]["response"])
  console.log('resy', typeof response["SearchResults:searchresults"]["response"])
  if (response["SearchResults:searchresults"]["response"] == undefined) {
    console.log('return dat')
    return {};
  } else {
    var firstResult = response["SearchResults:searchresults"]["response"][0]['results'][0]['result'][0]
    console.log('zillowResponse', firstResult)

    var propertyInfo = {
      zillowId: returnProperty(firstResult, 'zpid'),
      yearBuilt: returnProperty(firstResult, 'yearBuilt'),
      homeDetails: returnProperty(firstResult, 'links','homedetails'),
      comparables: returnProperty(firstResult, 'links','comparables'),
      address: {
        street: returnProperty(firstResult, 'address','street'),
        zipCode: returnProperty(firstResult, 'address','zipcode'),
        city: returnProperty(firstResult, 'address','city'),
        state: returnProperty(firstResult, 'address','state'),
        latitude: returnProperty(firstResult, 'address','latitude'),
        longitude: returnProperty(firstResult, 'address','longitude')
      },
      bedrooms: returnProperty(firstResult, 'bedrooms'),
      bathrooms: returnProperty(firstResult, 'bathrooms'),
      taxAssessmentYear: returnProperty(firstResult, 'taxAssessmentYear'),
      taxAssessment: returnProperty(firstResult, 'taxAssessment'),
      lotSizeSqFt: returnProperty(firstResult, 'lotSizeSqFt'),
      finishedSqFt: returnProperty(firstResult, 'finishedSqFt'),
      totalRooms: returnProperty(firstResult, 'totalRooms'),
      lastSoldDate: returnProperty(firstResult, 'lastSoldDate'),
      lastSoldPrice: returnProperty(firstResult, 'lastSoldPrice','_'),
      zestimate: {
        amount: returnProperty(firstResult, 'zestimate','amount','_')
      }
    }
    console.log('propertyInfo', propertyInfo);
    return propertyInfo;
  }
}

function parseRates(request) {
  console.log('par rate', JSON.parse(request))
  return JSON.parse(request).response.today;
}

exports.getCurrentRates = function(state, callback) {
  var zillowUrl = "http://www.zillow.com/webservice/GetRateSummary.htm"

  var properties = {
    state: state,
    output: 'json',
    'zws-id': secretKey.zillowID
  }

  request({url:zillowUrl, qs:properties}, function(error, response, body) {
    callback(parseRates(body));
  });
};

exports.getPropertyInfo = function(address, callback) {
  var cityStateZip = "";
  if (address.zipCode != "") {
    cityStateZip = address.zipCode;
  } else {
    cityStateZip = address.city + "+" + address.state;
  }
  var streetAddress = address.streetNumber + "+" + address.streetName;

  var zillowUrl = "http://www.zillow.com/webservice/GetDeepSearchResults.htm"

  var properties = {
    'zws-id': secretKey.zillowID,
    address: streetAddress,
    citystatezip: cityStateZip
  }

  request({url:zillowUrl, qs:properties}, function(error, response, body) {
    parseXML(body, function (err, result) {
      callback(parseProperties(result));
    });
  });
}

