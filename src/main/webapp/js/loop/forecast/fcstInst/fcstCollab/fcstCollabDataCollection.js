var instanceCollaborativeAdjustCollection;

var fcstCollabDataCollection = Backbone.Collection.extend({
	model: fcstCollabDataModel
});

fcstCollabDataCollection.getInstance = function (params) {
    if (!instanceCollaborativeAdjustCollection || params.clean == true) {
    	instanceCollaborativeAdjustCollection = new fcstCollabDataCollection();
    }
    return instanceCollaborativeAdjustCollection;
};