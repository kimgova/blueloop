var addSKURowView = Backbone.View.extend({

	template: '/blueloop-backend/static/js/loop/execution/order/addOrderSKU/template/addSKURow.ejs',
	
	constructor : function (options) {
		_.extend(this, options);
	},
	
	render: function() {
		this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
		this.setEvents();
		return this;
	},
	
	setEvents: function(){
		this.$el.find("#addSKUToOrder").click(this,this.addSKUToOrder); 
	},

	addSKUToOrder : function(e){
		var newRowView = new createEditOrderSKUNewRowView({parent:e.data.parent,model:e.data.model});		
		if($('#skus-neworder-table tbody').find(".dataTables_empty").length > 0){
			$('#skus-neworder-table tbody').empty();
		}
		$('#skus-neworder-table tbody').prepend(newRowView.render().$el);
		$('#addOderSku').attr("disabled","disabled");
		$("#add-SKU-order-modal").remove();	
	}
});