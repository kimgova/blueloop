var orderValveModalView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/execution/order/orderValve/template/orderValveModalTemplate.ejs',
    
    constructor : function (options) {
        _.extend(this, options);
    },

    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        this.setTable();
        return this;
    },
    
    setTable: function(){
        var tableView = new orderValveTableView({idFormLeft:this.idFormLeft, idFormRight:this.idFormRight, idValve:this.idValve});
        this.$el.find("#tableCbbOrders").html(tableView.render().$el);
    }
    
});