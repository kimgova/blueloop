var instance3SCollection;

var fcstInst3SCollection = Backbone.Collection.extend({

	model: fcstInst3SModel

});

fcstInst3SCollection.getInstance = function (params) {
	if (!instance3SCollection || params.clean == true) {
		instance3SCollection = new fcstInst3SCollection();
	}
	return instance3SCollection;
};