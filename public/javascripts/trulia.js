var Trulia = {
  getZipCodeInfo: function(zipCode) {
    $.get( "/trulia/location", { zipCode: zipCode } )
      .done(function( data ) {
        property.truliaInfo = data; // dependency
        console.log(property.truliaInfo)
        // $('#zillow-year-nbuilt').text(data.yearBuilt)
      });
  }
}
