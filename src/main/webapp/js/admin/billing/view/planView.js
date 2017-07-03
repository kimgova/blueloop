var planView = Backbone.View.extend({
    
    template: '/blueloop/static/js/admin/billing/template/planTemplate.ejs',

    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        this.setEvents();
        return this;
    },
    
    setEvents: function(){
    	 this.$el.find("#silverBtn").click(this,this.validateBillingInfo);
    },
    
    validateBillingInfo: function(e){
    	if(e.data.model.get("emptyInfo")){
    		window.wsView.setPaymentView({model:e.data.model});
    		$(".tabbable-line.layers").find('li').removeClass("active");
    		$("li#3").addClass("active");
    	}else{
    		window.wsView.cardView.sendTokenRequest(1,e.data.model.get("cardNumber"),e.data.model.get("cvc").toString(),e.data.model.get("month").toString(),e.data.model.get("year").toString())
    		e.data.addSilverPlan(e);
    	}
	},
	
	addSilverPlan: function(e){
		if(window.wsView.model.get("token") == undefined){
    		setTimeout(function(){
    			e.data.addSilverPlan(e);
			}, 2000);
		}else{
			var data = ajaxCall('POST','/blueloop/administrator/sellPlan/', JSON.stringify({token:window.wsView.model.get("token")}), "text/json", "json", false);
    		if(data.success){
    			toastr.success(data.message);
    		}else{
    			toastr.error(data.message);
    		}
		}
	}

});