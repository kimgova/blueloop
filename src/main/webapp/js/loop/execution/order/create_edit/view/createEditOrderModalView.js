var createEditOrderModalView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/execution/order/create_edit/template/orderModalTemplate.ejs',
    
    constructor : function (options) {
        _.extend(this, options);
    },

    render: function() {
    	if(this.idOrderChain != 0){
    		this.setEditForm();
    	}else{
    		this.setAddForm();
    	}    	
    	this.$el = $(new EJS({url: this.template }).render({orderNumber:this.orderNumber, dta:this.dta, disabled:this.disabledField}));  
    	if(this.pta > this.dta && this.dta != ""){
    		this.$el.find("#observationPTA").css("display","block");
    	}   	
    	this.resetTable();
    	this.setComponents();
    	this.setEvents();
        return this;
    },
    
    setAddForm: function(){
    	this.orderNumber='';
    	this.dta = "";
    	this.pta = "";
    	this.disabledField = '';
    	this.idSequence = 0;
    	this.skusCollection = new orderSKUCollection([]);
    },
    
    setEditForm: function(){
    	var result = ajaxCall('GET', '/blueloop/orderChain/getOrderChain/', {orderId:this.idOrderChain}, "text/json", "json", false);
	    
	    this.orderNumber = result.order.orderNumber;
    	this.dta = result.order.desiredTimeArrival;
    	this.pta = result.pta;
    	this.disabledField = 'disabled';
    	this.idSequence = result.order.sequence.id;
    	this.skusCollection = new orderSKUCollection([]);

	    _.each(result.skuList,function(item,i){
	    	var sku = new orderSKUModel({
				id:item.id,
				skuNumber: item.skuNumber,
				skuDescription: item.skuDescription,
				quantity: item.quantity,
				unit: item.unit,
				type: item.type,
				dta:result.order.desiredTimeArrival,
				pta:result.pta,
				sequence: item.sequence
			});
			this.skusCollection.push(sku);
	    },this); 
	},
	
    setEvents: function(){
        this.$el.find("#addOderSku").click(this,this.addSKU);
        this.$el.find("#saveNewOrder").click(this,this.saveOrder);
        this.$el.find("#orderDta").change(this,this.changeDTA);
    },
    
    addSKU: function(e) {
    	e.preventDefault();
    	e.data.$el.find('#skusError').css('display','none');
    	$("#add-SKU-order-modal").remove();		
    	var modalView = new addSKUModalView({idSequence:e.data.idSequence, skuAddedList:e.data.skusCollection, parent:e.data});
    	modalView.render().$el.modal("show");
    }, 
    
    changeDTA: function(e) {
    	var dta = $(e.target).val();
    	e.data.dta = dta;

    	_.each(e.data.skusCollection.models,function(model,j){
    		model.set("dta",dta)    			 
		},this); 

    	if(e.data.pta > e.data.dta){
    		e.data.$el.find('#observationPTA').css('display','block');
    	}else{
    		e.data.$el.find('#observationPTA').css('display','none');
    	}    		
    	e.data.resetTable();
    }, 
    
    addNewSKU: function(model){
    	this.skusCollection.push(model);
    	this.idSequence = model.get("sequence");
    	this.resetTable();
    },
    
    removeSKU: function(model){
    	this.skusCollection.remove(model);
    	this.resetTable();
    	if(this.skusCollection.models.length == 0){
    		this.idSequence = 0;
    		this.$el.find("#observationPTA").css("display","none");
    	}
    },
    
    resetTable: function(){
    	var tableView = new createEditOrderSKUTableView({collection:this.skusCollection, parent:this});
    	this.$el.find("#addedSkusTable").html(tableView.render().$el);   	
    },
    
    saveOrder: function(e){
    	if(e.data.skusCollection.models.length == 0){
    		e.data.$el.find('#skusError').css('display','block');
    	}
    	
    	$("#formNewOrder").validate({
			debug: true,
		 	rules: { orderId : 'required', 
		 			 orderDta: 'required' },
			success: "valid",
			submitHandler: function(form) {
				if(e.data.skusCollection.models.length > 0){
					e.data.$el.find('#skusError').css('display','none');
					e.data.save();
		    	}
			}
		});
    },
    
    save: function(){
    	var that = this;
    	var idChain = $("#idChain").text().trim();
    	var order = {orderId:this.idOrderChain,orderNumber:this.$el.find("#orderId").val(),orderDta:this.$el.find("#orderDta").val(), skus:this.skusCollection.models, idChain:idChain};
		var dataReturned = $.ajax({
			type: 'POST',
			url: '/blueloop/orderChain/saveOrderChain/',
			data: JSON.stringify(order),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			success: function(data, textStatus) {
				orderPopoverController.increaseOrderCounter(data.currentBB);
				toastr.success(json.order.saved);
				that.parentModal.setTable();
				$("#new-order-modal").remove();		
			},
			error: function(httpRequest, textStatus, errorThrown) { 
				toastr.error(httpRequest.responseJSON.error);
		 	}
		});
    },
    
    setComponents: function(){ 
    	$(this.$el).find('.dpYears').datepicker({format: 'dd/mm/yyyy', autoclose: true, startDate: new Date(),});
    },
});