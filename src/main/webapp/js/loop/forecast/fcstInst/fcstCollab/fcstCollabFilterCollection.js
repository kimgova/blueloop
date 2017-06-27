var instanceCollabFilterCollection;

var fcstCollabFilterCollection = Backbone.Collection.extend({
	
	model: fcstCollabFilterModel,
	
	comparator: function(item) {
        return item.get('step');
    }

});

fcstCollabFilterCollection.getInstance = function (params) {
    if (!instanceCollabFilterCollection || params.clean == true) {
    	instanceCollabFilterCollection = new fcstCollabFilterCollection();
    }
    return instanceCollabFilterCollection;
};