var inventoryTableView = Backbone.View.extend({
    
	template: '/blueloop-backend/static/js/buildingBlock/edit/inventory/main/template/inventoryTableTemplate.ejs',
       
    constructor : function (options) {
		_.extend(this, options);
	},

    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        this.getInventory();
        this.collection.each(this.addRow, this);
        this.initDatatable();
        return this;
    },
    
    getInventory: function() {
    	this.collection = new inventoryCollection([]);
    	var result = ajaxCall('GET', '/blueloop-backend/loadFile/getBBInventory/', {idBB:this.idBB}, "text/json", "json", false);
    	_.each(result,function(sku,i){
    		var inventory = new inventoryModel({
    			identifier : sku.skuIdentifier,
                description : sku.skuDescription,
                inventoryBL : sku.inventoryBL,
			    units : sku.skuUnit,
			   	warehouse : sku.warehouse,
			   	center : sku.center
    		});
    		this.collection.push(inventory);
	    },this); 
    },

    addRow: function(model) {
        var rowView = new inventoryRowView( { model: model } );
        this.$el.find('tbody').append(rowView.render().$el);
    },
    
    initDatatable: function(){
    	this.datatable = this.$el.find('#inventory-table').DataTable( {
    		"autoWidth"		: false,
			"scrollCollapse": true,
			"paging"		: false,
			"processing"	: true,
			"destroy"		: true,
			"jQueryUI"		: false,
			"select"		: "single",
			"columnDefs": [{ "orderable": false, "targets": [ 1,2,3,4 ] },
	              		   { "className": "center", "targets": [ 0,1,2,3,4,5 ] }],
		});	
    }
    
});