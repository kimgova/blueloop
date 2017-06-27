var cardView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/admin/billing/template/cardTemplate.ejs',
    
    constructor : function (options) {
        _.extend(this, options);
        TCO.loadPubKey('sandbox');
    },
    
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.setEvents();
        return this;
    },
    
    setEvents: function(){
        this.$el.find("#addCCInfo").click(this,this.submitCardInfo);
    },
    
    submitCardInfo: function(e) {
    	e.preventDefault();
    	e.data.sendTokenRequest(0,e.data.$el.find("#ccNo").val(),e.data.$el.find("#cvv").val(),e.data.$el.find("#expMonth").val(),e.data.$el.find("#expYear").val());

        // Prevent form from submitting
        return false;
    },
    
    sendTokenRequest: function(successType,ccNo,cvv,month,year) {
        // Setup token request arguments
        var args = {
          sellerId: "901308378",
          publishableKey: "37DFB794-1A1C-4356-86E5-FACCD115160C",
          ccNo: ccNo,
          cvv: cvv,
          expMonth: month,
          expYear: year
        };

        // Make the token request
        if(successType == 0){
        	TCO.requestToken(this.saveSuccessCallback, this.errorCallback, args);
        }else{
        	TCO.requestToken(this.successCallback, this.errorCallback, args);
        }
        
    },
    
    successCallback: function(data) {
        $("#token").val(data.response.token.token);
        window.wsView.model.set("token",data.response.token.token);
        toastr.success("Transaction Approved");
    },
    
    saveSuccessCallback: function(data) {
        $("#token").val(data.response.token.token);
        window.wsView.model.set("token",data.response.token.token);
        window.wsView.cardView.saveBillingInfo();
    },
    
    saveBillingInfo: function(){
    	this.model.set("cardNumber",this.$el.find("#ccNo").val());
        this.model.set("cvc",this.$el.find("#cvv").val());
        this.model.set("month",this.$el.find("#expMonth").val());
        this.model.set("year",this.$el.find("#expYear").val());
        this.model.set("emptyInfo",false);
        var data = ajaxCall('POST','/blueloop-backend/administrator/saveBillingInfo/', JSON.stringify(this.model.toJSON()), "text/json", "json", false);
        if(data.success){
        	toastr.success("Credit Card Saved");
        	window.wsView.setPaymentView();
        }else{
        	toastr.error("Error saving your credit card info");
        }
    },
      
    // Called when token creation fails.
    errorCallback: function(data) {
        // Retry the token request if ajax call fails
        if (data.errorCode === 200) {
        	window.wsView.cardView.sendTokenRequest();
        } else {
          toastr.error(data.errorMsg);
        }
    }

});