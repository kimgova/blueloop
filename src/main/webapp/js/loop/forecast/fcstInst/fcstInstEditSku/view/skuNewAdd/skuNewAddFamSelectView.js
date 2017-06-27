var skuNewAddFamSelectView = Backbone.View.extend({
	template : '/blueloop-backend/static/js/loop/forecast/fcstInst/fcstInstEditSku/template/skuNewAdd/skuNewAddFamSelect.ejs',
	
	subCatList:null,
	subCatSelected:null,
	subCollection:null,
	
	render : function() {
		this.$el = $(new EJS({url: this.template }).render({idSelect:this.idSelect,disabled:this.disabled}));
		
		_.each(this.collection.models,function(item,i){
			item.attributes.selected = "";
			if(this.skuCollection){
				var sku = this.skuCollection.first().attributes;
				if(item.attributes.name == sku.family){
					item.attributes.selected = "selected";
					this.subCatList = item.attributes.subCatList;
					this.subCatSelected = sku.brand;
				}
				this.addModel(item);
			}else{
				if(i == 0){
					this.subCatList = item.attributes.subCatList;
				}
				this.addModel(item);
			}
		},this);
		
		return this;
	},

	addModel : function(model) {
		var optionView = new skuNewAddFamOptionView({model : model});
		this.$el.append(optionView.render().$el);
	}
});