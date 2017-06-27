var instanceEquivCollection;

var forecastEquivCollection = Backbone.Collection.extend({

	model: forecastSKUEquivModel

});

forecastEquivCollection.getInstance = function (params) {
	if (!instanceEquivCollection || params.clean == true) {
		instanceEquivCollection = new forecastEquivCollection();
	}
	return instanceEquivCollection;
};