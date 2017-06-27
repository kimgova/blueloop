var instanceCatCollection;

var forecastCatCollection = Backbone.Collection.extend({

  model: forecastCatModel

});

forecastCatCollection.getInstance = function (params) {
    if (!instanceCatCollection || params.clean == true) {
    	instanceCatCollection = new forecastCatCollection();
    }
    return instanceCatCollection;
};