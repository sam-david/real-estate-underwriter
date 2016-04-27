function parseGoogleAddress(address) {
  function findComponent(typeName, longShort) {
    var component = address.address_components.find(function(item) {
      return item.types[0] === typeName
    })
    if (component != undefined) {
      if (longShort == 'long') {
        return component.long_name;
      } else if (longShort == 'short'){
        return component.short_name;
      } else {
        return component.long_name;
      }
    } else {
      return null;
    }
  }

  return {
    googleId: address.id,
    formmattedAddress: address.formatted_address,
    lat: address.geometry.location.lat(),
    lng: address.geometry.location.lng(),
    streetNumber: findComponent('street_number','long'),
    streetName: findComponent('route','long'),
    neighborhood: findComponent('neighborhood','long'),
    city: findComponent('locality','long'),
    county: findComponent("administrative_area_level_2",'long'),
    state: findComponent("administrative_area_level_1",'short'),
    zipCode: findComponent('postal_code','long'),
    country: findComponent('country','long')
  }
}
