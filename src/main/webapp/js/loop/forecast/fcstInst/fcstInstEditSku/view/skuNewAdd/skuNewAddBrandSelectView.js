var skuNewAddBrandSelectView = Backbone.View.extend({
	
	template : '/blueloop-backend/static/js/loop/forecast/fcstInst/fcstInstEditSku/template/skuNewAdd/skuNewAddFamSelect.ejs',
	
	render : function() {
		this.$el = $(new EJS({url: this.template }).render({idSelect:this.idSelect,disabled:this.disabled}));
		this.collection.each(this.addModel, this);
		return this;
	},

	addModel : function(model) {
		model.attributes.selected = "";
		if(model.attributes.name == this.subCatSelected){
			model.attributes.selected = "selected"
		}
		var optionView = new skuNewAddFamOptionView({model : model});
		this.$el.append(optionView.render().$el);
	}
});