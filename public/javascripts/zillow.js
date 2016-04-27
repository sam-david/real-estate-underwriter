Zillow = {
  getProperty: function(address) {
    console.log('Zillow.getProperty')
    $.get( "/zillow/property", { address: address } )
      .done(function( data ) {
        property.zillowInfo = data; // awful dependency here
        console.log('zillow data', data)
        if (isEmpty(data) == false) {
          $('#zillow-year-built').text(data.yearBuilt)
          $('#zillow-sold-price').text(data.lastSoldPrice)
          $('#zillow-sold-date').text(data.lastSoldDate)
          $('#zillow-lot-sqft').text(data.lotSizeSqFt)
          $('#zillow-finished-sqft').text(data.finishedSqFt)
          $('#zillow-zestimate').text("$" + data.zestimate.amount)
        }
      });
  },
  getRates: function(state) {
    console.log('Zillow.getRates')
    $.get( "/zillow/rates", { state: state } )
      .done(function( data ) {
        property.zillowRates = data; // awful dependency here
        console.log('zillow rates', data)
        if (isEmpty(data) == false) {
          $('#zillow-thirty-fixed').text(data.thirtyYearFixed)
          $('#zillow-fifteen-fixed').text(data.fifteenYearFixed)
        }
      });
  }
}
