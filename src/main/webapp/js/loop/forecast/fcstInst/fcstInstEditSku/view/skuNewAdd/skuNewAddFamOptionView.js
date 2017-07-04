var skuNewAddFamOptionView = Backbone.View.extend({
	
	template : '/blueloop/static/js/loop/forecast/fcstInst/fcstInstEditSku/template/skuNewAdd/skuNewAddFamOption.ejs',

	render : function() {
		this.$el = $(new EJS({url : this.template}).render(this.model.toJSON()));
		return this;
	}

});