function wsBillingView() {

    var that = this;
    var buttons = [];

    that.init = function() {
        that.view = $(".tabbable-line.layers");    
        $("li#1").addClass("active");
        setTabButtons();
        setUserModel();
        that.setPlanView();
    };
    
    function setUserModel(){
    	var result = ajaxCall('GET', '/blueloop/administrator/getUserBillingInfo/', {}, "text/json", "json", false);
        if(result.success){
        	that.model = new userModel({
            	id:       	result.billingInfo.id,
    	        name:     	result.billingInfo.cardHolderName,
    	        cardNumber: result.billingInfo.cardNumber,
    	        month: 		result.billingInfo.month,
    	        year: 		result.billingInfo.year,
    	        cvc: 		result.billingInfo.cvc,
    	        emptyInfo: 	false
    	    });
        }else{
        	that.model = new userModel({emptyInfo:true});
        }
    }

    function setTabButtons() {
        $(that.view).find('li').each(function(i,btn){
        	$(btn).click(function(){
        		getBtnAction(this);
        	});
            buttons.push(btn);
        })
    }
    
    function setActiveClass(button) {
    	$(that.view).find('li').removeClass("active");
    	$(button).addClass("active");
    }
    
    function getBtnAction(button) {
    	switch ($(button).attr('id')){
		case "1":			
			that.setPlanView();			
			break;
		case "2":	
			that.setHistoryView();
			break;
		case "3":	
			that.setPaymentView();
			break;
		}
    }

    that.setPlanView = function(){
    	that.planView = new planView({model:that.model});
    	that.cardView = new cardView({model:that.model});
        $("#billing-content").html(that.planView.render().$el);
		toastr.success("Plans & Add-ons");
    }
    
    that.setHistoryView = function(){
    	that.historyView = new historyView();
        $("#billing-content").html(that.historyView.render().$el);
		toastr.success("History Bills");
    }
    
    that.setPaymentView = function(){
    	that.cardView = new cardView({model:that.model});
        $("#billing-content").html(that.cardView.render().$el);
		toastr.success("Payment Method");
    }
    
    return that;
}

$().ready(function() {
	window.wsView = new wsBillingView();
	window.wsView.init();
});