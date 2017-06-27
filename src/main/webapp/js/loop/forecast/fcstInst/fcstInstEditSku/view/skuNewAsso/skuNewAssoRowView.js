var skuNewAssoRowView = Backbone.View.extend({
	
	template: '/blueloop-backend/static/js/loop/forecast/fcstInst/fcstInstEditSku/template/skuNewAsso/skuNewAssoRow.ejs',
	
	constructor : function (options) {
		_.extend(this, options);
	},
	
	render: function() {
		this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
		this.setEvents();
		return this;
	},
	
	setEvents: function(){
		this.$el.find("#addAssoSkuM").click(this,this.addAssoSkuM); 
	},

	addAssoSkuM : function(context){
		var modelView = new skuNewAddAssoRowView({model: context.data.model, viewModal:context.data.viewModal.data.view});
		context.data.viewModal.data.$el.find('tbody#tbodyAssoSku').append(modelView.render().$el);
		context.data.viewModal.data.$el.find('#noData').remove();
		context.data.viewModal.data.collection.add(context.data.model);
		
		$("#newSkuAssoModal").remove();
	}

});