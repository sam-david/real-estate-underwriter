var request = require("request");
var parseXML = require('xml2js').parseString;
var secretKey = require('../../secret');

exports.getZipCodeStats = function(zipCode, callback) {
  var truliaUrl = "http://api.trulia.com/webservices.php?library=TruliaStats"

  var properties = {
    apikey: secretKey.truliaApiKey,
    function: 'getZipCodeStats',
    zipCode: zipCode
  }

  request({url:truliaUrl, qs:properties}, function(error, response, body) {
    parseXML(body, function (err, result) {
      callback(result);
    });
  });
};
