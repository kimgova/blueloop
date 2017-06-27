var forecastInstActModel = Backbone.Model.extend({

	defaults: {
		id:0,
		name: "",
		imgUrl: "",
		status: 0,
		step: 0,
		dependencies:[],
		responsible:""
	}

});