var skuNewAddAssoRowView = Backbone.View.extend({
	
	template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstEditSku/template/skuNewAdd/skuNewAddAssoRow.ejs',
	
	constructor : function (options) {
		_.extend(this, options);
	},

	render: function () {
		this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
		this.setEvents();
		return this;
	},
	
	setEvents: function(){
		this.$el.find("#deleteAsso").click(this,this.deleteAsso); 
	},
	
	deleteAsso : function(e){
		e.data.viewModal.skuAssoCollection.remove(e.data.model);
		$(e.currentTarget).parents("tr").remove();
	}
});