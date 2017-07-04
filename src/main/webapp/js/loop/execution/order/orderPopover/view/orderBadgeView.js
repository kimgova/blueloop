var orderBadgeView = Backbone.View.extend({
    
	template: '/blueloop/static/js/loop/execution/order/orderPopover/template/badgeTemplate.ejs',
	templatePopoverContent: '/blueloop/static/js/loop/execution/order/orderPopover/template/popoverContentTemplate.ejs',
       
    constructor : function (options) {
		_.extend(this, options);
	},

    render: function() {
        this.$el =  $(new EJS({url: this.template}).render({id:this.id,totalOrders:this.totalOrders}));;
        return this;
    },
    
    initPopover: function(){
    	this.popover = $('div#bbOrderAlert'+ this.id).popover({
			title:json.execution.orderAlerts, 
			content: "",
			container:"body", 
			html:"true", 
			placement:"right", 
			trigger:"hover"
		});	
    	
    	this.setEvents();
    },
    
    setEvents: function(){
    	var that = this;
    	this.popover.on('show.bs.popover', function(){
            that.updateContent(that);
        });
    },
    
    updateContent: function(e){
    	var orders = ajaxCall('GET', '/blueloop/orderChain/getOrdersAndStatusByCBB/', {idCBB:e.id}, "text/json", "json", false);
    	var content = new EJS({url: this.templatePopoverContent}).render({dataOrders:orders})
    	e.popover.data('bs.popover').options.content = content;    
    },
});