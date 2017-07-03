var orderTableView = Backbone.View.extend({
    
	template: '/blueloop/static/js/loop/execution/order/main/template/orderTableTemplate.ejs',
       
    constructor : function (options) {
		_.extend(this, options);
	},

    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        this.getOrders();
        this.collection.each(this.addRow, this);
        this.initDatatable();
        this.filter(['ONTIME', 'DELAYED', 'AHEAD']);
        return this;
    },
    
    getOrders: function() {
    	this.collection = new orderCollection([]);
    	var result = ajaxCall('GET', '/blueloop/orderChain/listOrder/', {id:this.idChain}, "text/json", "json", false);
    	_.each(result,function(item,i){
    		var order = new orderModel({
    			id:item.oc.id,
    			globalOrderId: item.oc.orderNumber,
    			orders: item.totalOrderDetail,
    			attachments: item.totalAttach,
    			pta: item.pta,
    			dta: item.oc.desiredTimeArrival,
    			status: item.status.name,
    			step: item.step,
    			isResponsible:this.isResponsible
    		});
    		this.collection.push(order);
	    },this); 
    },

    addRow: function(model) {
        var rowView = new orderRowView( { model: model, ordersCollection:this.collection,parentModal:this.parentModal, tableView:this } );
        this.$el.find('tbody').append(rowView.render().$el);
    },
    
    initDatatable: function(){
    	this.datatable = this.$el.find('#order-table').DataTable( {
    		"autoWidth"		: false,
			"scrollCollapse": true,
			"paging"		: false,
			"processing"	: true,
			"destroy"		: true,
			"jQueryUI"		: false,
			"select"		: "single",
			"columnDefs": [{ "orderable": false, "targets": [ 1,2,3,4,7 ] },
	              		   { "className": "center", "targets": [ 0,1,2,3,4,5,6,7 ] }],
		});	
    },
    

    filter : function(values) {
        $.fn.dataTableExt.afnFiltering.push(function(settings, data, dataIndex) {
            for (i = 0; i < values.length; i++) {
                if (data[6] == values[i]) {
                    return true;
                }
            }
            return false;
        });
        this.datatable.draw();
        $.fn.dataTableExt.afnFiltering.pop();
    }
    
});