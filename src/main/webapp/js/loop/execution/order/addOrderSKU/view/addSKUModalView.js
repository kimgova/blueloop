var addSKUModalView = Backbone.View.extend({

	template: '/blueloop/static/js/loop/execution/order/addOrderSKU/template/addSKUModal.ejs',

	constructor : function (options) {
		_.extend(this, options);
	},

	render: function() {
		this.$el = $(new EJS({url: this.template }).render());
		var modelView = new addSKUTableView({skuAddedList: this.skuAddedList, parent: this.parent, idSequence:this.idSequence});
		this.$el.find('#skuTable').html(modelView.render().$el);
		this.setEvents();
		return this;
	},
	
	setEvents: function(view){
		this.$el.find("#btnCancel").click(this,this.cancel);
		this.$el.find(".close").click(this,this.cancel);		
	},
	
	cancel : function(e){
		$("#add-SKU-order-modal").remove();
	},
});