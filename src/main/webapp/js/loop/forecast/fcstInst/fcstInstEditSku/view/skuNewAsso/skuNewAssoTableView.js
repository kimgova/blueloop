var skuNewAssoTableView = Backbone.View.extend({

	template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstEditSku/template/skuNewAsso/skuNewAssoTable.ejs',
	
	constructor : function (options) {
		_.extend(this, options);
	},

	render: function() {
		this.$el = $(new EJS({url: this.template }).render());
		this.getSkuCollection();
		if(this.collection.length > 0){
			this.$el.find('tbody').empty();
		}

		this.collection.each(this.addModel, this);
		return this;
	},
	
	getSkuCollection: function(){
		this.collection = forecastSkuCollection.getInstance({}).clone();
		this.skuAssociateList.each(this.remove, this);
		this.collection.remove(this.view.data.model);
	},

	addModel: function(model) {
		var modelView = new skuNewAssoRowView({ model: model, viewModal:this.view });
		this.$el.find('tbody').append(modelView.render().$el);
	},

	remove: function(model) {
		this.collection.remove(model) 
	}
});