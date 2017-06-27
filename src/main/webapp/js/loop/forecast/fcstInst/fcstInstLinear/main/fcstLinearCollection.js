var instanceLinearCollection;

var forecastLinearCollection = Backbone.Collection.extend({

	model: forecastLinearModel

});

forecastLinearCollection.getInstance = function (params) {
    if (!instanceLinearCollection || params.clean == true) {
    	instanceLinearCollection = new forecastLinearCollection();
    }
    return instanceLinearCollection;
};