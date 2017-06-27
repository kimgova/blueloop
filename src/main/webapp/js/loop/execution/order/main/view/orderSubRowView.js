var orderSubRowView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/execution/order/main/template/orderSubRowTemplate.ejs',
        
    constructor : function (options) {
		_.extend(this, options);
	},
	
    render: function () {
        this.$el = $(new EJS({url: this.template }).render());
        this.$el.find(".sub-row-content").empty();
        if(this.type == 1){
        	var tableView = new orderSKUTableView({model:this.model});
        }else{
        	var tableView = new orderAttTableView({model:this.model,parentRow:this.parentRow});
        }
		this.$el.find(".sub-row-content").append(tableView.render().$el);
        return this;
    }
    
});