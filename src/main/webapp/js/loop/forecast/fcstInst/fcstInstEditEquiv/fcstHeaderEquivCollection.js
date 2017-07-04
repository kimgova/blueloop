var instanceHeaderEquivCollection;

var forecastHeaderEquivCollection = Backbone.Collection.extend({

	model: forecastHeaderEquivModel

});

forecastHeaderEquivCollection.getInstance = function (params) {
	if (!instanceHeaderEquivCollection || params.clean == true) {
		instanceHeaderEquivCollection = new forecastHeaderEquivCollection();
	}
	return instanceHeaderEquivCollection;
};