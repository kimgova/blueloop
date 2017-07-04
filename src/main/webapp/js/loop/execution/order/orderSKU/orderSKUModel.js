var orderSKUModel = Backbone.Model.extend({

  defaults: {
	  id:0,
	  skuNumber:"",
	  skuDescription:"",
      quantity:0,
      unit: "",
      type: "",
      dta: "",
      pta: "",
      sequence: 0
  }

});