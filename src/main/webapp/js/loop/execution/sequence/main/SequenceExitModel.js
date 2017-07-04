var instanceSequenceExitModel;

var SequenceExitModel = Backbone.Model.extend({
	  defaults: {
		  cbbTabView: null,
	      cbbPendingChanges: false,
	      skuTabView: null,
	      skuPendingChanges: false
	  },
});

SequenceExitModel.getInstance = function (params) {
	if (!instanceSequenceExitModel || params.clean == true) {
		instanceSequenceExitModel = new SequenceExitModel();
	}
	return instanceSequenceExitModel;
};