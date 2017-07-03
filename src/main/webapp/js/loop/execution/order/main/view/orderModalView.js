var orderModalView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/execution/order/main/template/orderModalTemplate.ejs',
    
    constructor : function (options) {
        _.extend(this, options);
    },

    render: function() {
    	this.$el = $(new EJS({url: this.template }).render({isResponsible:this.isResponsible}));
    	this.setTable();
		this.setEvents();
        return this;
    },
    
    setEvents: function(){
        this.$el.find("#newOrderChain").click(this,this.showNewOrderModal);
        this.$el.find('#filter li').click(this,this.filter);
    },
    
    showNewOrderModal: function(e) {
    	$("#new-order-modal").remove();	
    	var modalView = new createEditOrderModalView({idSequence:0,parentModal:e.data,idOrderChain:0});
    	modalView.render().$el.modal({backdrop: 'static',keyboard: false});
    },    
    
    setTable: function(){
       this.tableView = new orderTableView({idChain:this.idChain,isResponsible:this.isResponsible,parentModal:this});
       this.$el.find("#order-content").html(this.tableView.render().$el);
    },
    
    filter: function(e){
        e.data.$el.find(".selectedFilter").html($(e.target).html());
        if(e.target.id === 'filter-transit'){
            e.data.tableView.filter(['ONTIME', 'DELAYED', 'AHEAD']);
        }else if(e.target.id === 'filter-orderFinished'){
            e.data.tableView.filter(['EXECUTED']);
        }else if(e.target.id === 'filter-orderCanceled'){
            e.data.tableView.filter(['ANNULLED']);
        }else if(e.target.id === 'filter-all'){
            e.data.tableView.filter(['ONTIME', 'DELAYED', 'AHEAD','EXECUTED','ANNULLED']);
        }
    }
    
});