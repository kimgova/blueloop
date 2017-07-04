var instanceLinearRoleCollection;

var forecastLinearRoleCollection = Backbone.Collection.extend({

	model: forecastLinearRoleModel

});

forecastLinearRoleCollection.getInstance = function (params) {
    if (!instanceLinearRoleCollection || params.clean == true) {
    	instanceLinearRoleCollection = new forecastLinearRoleCollection();
    }
    return instanceLinearRoleCollection;
};