var addSKUTableView = Backbone.View.extend({

	template: '/blueloop-backend/static/js/loop/execution/order/addOrderSKU/template/addSKUTable.ejs',
	
	constructor : function (options) {
		_.extend(this, options);
	},

	render: function() {
		this.$el = $(new EJS({url: this.template }).render());
		this.getSkuCollection();
		this.collection.each(this.addRow, this);
	    this.initDatatable();
		return this;
	},
	
	getSkuCollection: function(){
		this.collection = new orderSKUCollection([]);
		var idChain = $("#idChain").text().trim();
				
		var result = ajaxCall('GET', '/blueloop-backend/orderChain/getSkusByChainOrSequence/', {chainId:idChain, sequenceId:this.idSequence}, "text/json", "json", false);
	    _.each(result,function(item,i){
	    	if(!this.validateSkuAlreadyAdded(item.id)){
	    		var sku = new orderSKUModel({
	    			id:item.id,
	    			skuNumber: item.skuNumber,
	    			skuDescription: item.skuDescription,
	    			quantity: item.quantity,
	    			unit: item.unit,
	    			type: item.type,
	    			sequence: item.sequence
	    		});
	    		this.collection.push(sku);
	    	}
	    },this); 
	},
	
	validateSkuAlreadyAdded: function(id){
		var alreadyAdded = false;
		_.each(this.skuAddedList.models,function(sku,j){
			if(sku != undefined){
				if(sku.id == id)
					alreadyAdded = true; 
			}    			 
		},this); 
		return alreadyAdded;
	},

	addRow: function(model) {
		var modelView = new addSKURowView({ model: model, parent:this.parent });
		this.$el.find('#tableAddSku').append(modelView.render().$el);
	},
	
	initDatatable: function(){
    	this.datatable = this.$el.find('#tableAddSku').DataTable({
    		"autoWidth"		: false,
			"scrollCollapse": true,
			"paging"		: true,
			"processing"	: true,
			"destroy"		: true,
			"jQueryUI"		: false,
			"select"		: "single",
			"columnDefs": [{ "orderable": false, "targets": [ 3 ] },
	              		   { "className": "center", "targets": [ 0,1,2,3 ] }]
		});	
    },
});