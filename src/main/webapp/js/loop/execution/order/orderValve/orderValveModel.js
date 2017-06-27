var orderValveModel = Backbone.Model.extend({

  defaults: {
      idOrder:0,
      orderNumber: 0,
      status:"",
      readyToProceed:false,
      nextValve:"",
      actualValve:"",
      disabled:"",
      isOrderResponsible:false
  }

});