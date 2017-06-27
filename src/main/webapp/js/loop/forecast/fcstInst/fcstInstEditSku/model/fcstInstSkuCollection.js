var instanceSkuCollection;

var forecastSkuCollection = Backbone.Collection.extend({
	model: forecastSkuModel
});

forecastSkuCollection.getInstance = function (params) {
	if (!instanceSkuCollection || params.clean == true) {
		instanceSkuCollection = new forecastSkuCollection();
	}
	return instanceSkuCollection;
};