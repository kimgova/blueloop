var createEditOrderSKUEditRowView = Backbone.View.extend({
    
	template: '/blueloop/static/js/loop/execution/order/create_edit/template/orderSKUEditRowTemplate.ejs',
        
	constructor : function (options) {
		_.extend(this, options);
	},
	
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.$el.find("#saveOrderSKU").click(this,this.saveOrderSKU);
        this.$el.find("#cancelOrderSKU").click(this,this.cancelOrderSKU);
        return this;
    },
    
    saveOrderSKU: function(e){
    	e.preventDefault();
    	if(e.data.validate(e.data.$el.find("#quantityOrderSKU").val())){
			e.data.model.set("quantity",e.data.$el.find("#quantityOrderSKU").val())
			e.data.parent.resetTable();
			toastr.success(json.order.skuAdded);
    	}
    },
    
     cancelOrderSKU: function(e) {
    	 e.data.parent.resetTable();
    },
    
    validate: function(quantity){
		var regexNum    = /^(\d|-)?(\d|,)*\.?\d*$/;		
        var regexBlank  = /^\s*$/;
        var regexNumPositive = /^([0-9])*[.]?[0-9]*$/;
		var valid = true;
	
		if(quantity.trim() == "" || regexBlank.test(quantity)){
			toastr.error(json.order.quantityBlank);
			valid = false;
		}else{
			if(!regexNum.test(quantity.trim())){
	            toastr.error(json.order.quantityNumeric);
	            valid = false;
	        }else{
	        	if(quantity.trim() <= 0){
	        		toastr.error(json.order.quantityGreater0);
	        		valid = false;
	        	}
	        }
		}		      
		return valid;
	},
});