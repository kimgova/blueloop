var createEditOrderSKURowView = Backbone.View.extend({
    
	template: '/blueloop-backend/static/js/loop/execution/order/create_edit/template/orderSKURowTemplate.ejs',
        
    constructor : function (options) {
		_.extend(this, options);
	},
	
    render: function () {
        this.$el = $(new EJS({url: this.template}).render(this.model.toJSON()));
        this.setEvents();
        return this;
    },
    
    setEvents: function(){
        this.$el.find("#editOrderSKU").click(this,this.editOrderSKU);
        this.$el.find("#deleteOrderSKU").click(this,this.deleteOrderSKU);
    },
    
    editOrderSKU: function(e) {
    	e.preventDefault();
    	var editRowView = new createEditOrderSKUEditRowView({model:e.data.model, parent:e.data.parent});
    	e.data.$el.after(editRowView.render().$el);
    	e.data.remove();
    },
    
    deleteOrderSKU: function(e) {
    	e.preventDefault();
    	bootbox.confirm(json.order.removeSKU, function (event) {
    		if(event){
    			e.data.parent.removeSKU(e.data.model);
    			toastr.success(json.order.skuRemoved);
    		}
    	});
    },    
});