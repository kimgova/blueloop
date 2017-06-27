var forecastSkuModel = Backbone.Model.extend({
	
	defaults: {
		id: 0,
		identifier: "",
		description: "",
		type: "",
		unit: "",
		family: "",
		brand: "",
		promotion: "",
		skuAssociateList: [],
		fcstInst: '',
		skuChain:""
	}

});