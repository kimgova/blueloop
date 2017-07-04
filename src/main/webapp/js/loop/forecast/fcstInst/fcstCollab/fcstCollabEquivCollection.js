var instanceCollabEquivCollection;

var fcstCollabEquivCollection = Backbone.Collection.extend({
	model: fcstCollabDataModel
});

fcstCollabEquivCollection.getInstance = function (params) {
	if (!instanceCollabEquivCollection || params.clean == true) {
		instanceCollabEquivCollection = new fcstCollabEquivCollection();
	}
	return instanceCollabEquivCollection;
};