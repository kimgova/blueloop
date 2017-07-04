var createEditOrderSKUTableView = Backbone.View.extend({
    
	template: '/blueloop/static/js/loop/execution/order/create_edit/template/orderSKUTableTemplate.ejs',
       
    constructor : function (options) {
		_.extend(this, options);
	},

    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        this.collection.each(this.addRow, this);
        this.initDatatable();
        this.setEvents();
        return this;
    },
    
    addRow: function(model) {
        var rowView = new createEditOrderSKURowView( { model: model, parent:this.parent } );
 		this.$el.find('tbody').append(rowView.render().$el);
    },
    
    initDatatable: function(){
    	this.datatable = this.$el.find('#skus-neworder-table').DataTable( {
    		"autoWidth"		: false,
			"scrollCollapse": true,
			"paging"		: false,
			"processing"	: true,
			"destroy"		: true,
			"JQueryUI"		: false,
			"select"		: "single",
			"searching"		: false,
			"info"			: false,
			"columnDefs": [{ "orderable": false, "targets": [ 6 ] },
			               { "className": "center", "targets": [ 0,1,2,3,4,5,6 ] }],
			"language": {
		        "emptyTable": json.order.emptySKUTable
		    }
		});	
    },
    
    setEvents: function(){
    	this.$el.find("#skus-neworder-table thead th").click(function() {
    		if($(this).hasClass('sorting') || $(this).hasClass('sorting_asc') || $(this).hasClass('sorting_desc')){
	    		$('#addOderSku').removeAttr("disabled");
    		}
    	} );
    },
});