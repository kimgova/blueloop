var createEditOrderSKUNewRowView = Backbone.View.extend({
	
	template: '/blueloop-backend/static/js/loop/execution/order/create_edit/template/orderSKUEditRowTemplate.ejs',
		
	constructor : function (options) {
		_.extend(this, options);
	},
	
	render: function () {
		this.model.set("dta",$("#orderDta").val());
		var pta = this.getPTA(this.model.get("sequence"));
		this.model.set("pta",pta);
		this.parent.pta = pta;
		
		if(this.parent.pta > this.parent.dta && this.parent.dta != ""){
			this.parent.$el.find('#observationPTA').css('display','block');
    	}else{
    		this.parent.$el.find('#observationPTA').css('display','none');
    	}

		this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
		this.$el.find("#quantityOrderSKU").focus();
		this.$el.find("#saveOrderSKU").click(this,this.saveOrderSKU);
		this.$el.find("#cancelOrderSKU").click(this,this.cancelOrderSKU);
		return this;
	},
	
	saveOrderSKU: function(e){		
		e.preventDefault();
		if(e.data.validate(e.data.$el.find("#quantityOrderSKU").val())){
			e.data.model.set("quantity",e.data.$el.find("#quantityOrderSKU").val())
			e.data.parent.addNewSKU(e.data.model);	
			toastr.success(json.order.skuAdded);
			$('#addOderSku').removeAttr("disabled");
		}
	},

	getPTA: function(sequenceId){
		var result = ajaxCall('GET', '/blueloop-backend/orderSequence/getPTABySequence/', {sequenceId:sequenceId}, "text/json", "json", false);
		return result.date[0]
	},
	
	cancelOrderSKU: function(e) {
		e.data.parent.resetTable();
		$('#addOderSku').removeAttr("disabled");
		
		if(e.data.parent.skusCollection.models.length == 0){
			e.data.parent.$el.find("#observationPTA").css("display","none");
    	}
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