var orderCBBModalView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/execution/order/orderCBB/template/orderCBBModalTemplate.ejs',
    
    constructor : function (options) {
        _.extend(this, options);
    },

    render: function() {
    	this.$el = $(new EJS({url: this.template }).render({}));
    	this.setTable();
        return this;
    },   
    
    setTable: function(){
    	var tableView = new orderCBBTableView({idFormCBB:this.idFormCBB});
		this.$el.find("#order-content").html(tableView.render().$el);
    }
    
});