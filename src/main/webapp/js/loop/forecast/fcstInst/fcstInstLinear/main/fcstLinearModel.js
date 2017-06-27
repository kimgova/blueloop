var forecastLinearModel = Backbone.Model.extend({

	defaults : {
		id: null,
		description: "",
		category: "",
		subcategory: "",
		suggested: 0,
		variations: [],
		finalTrade: 0
	}
});