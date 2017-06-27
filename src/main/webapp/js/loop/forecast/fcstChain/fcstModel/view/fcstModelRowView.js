var forecastModelRowView = Backbone.View.extend({
    
	constructor : function (options) {
		_.extend(this, options);
	},
	
    template: '/blueloop-backend/static/js/loop/forecast/fcstChain/fcstModel/template/fcstModelTableRow.ejs',
        
    render: function () {
    	this.model.set("forecastPermission", this.forecastPermission);
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.$el.find("#addForecastModel").click(this,this.addModel);
        return this;
    },
	
    addModel: function(e) {
        if(e.data.$el.find("#nameFcst").val() == ""){
            toastr.error(json.forecast.fcstName);
            return false
        }
    	if(!e.data.validateModel(e.data.model.id)){
        	var forecastData = {chainId:localStorage.getItem("loopId"),modelId:e.data.model.id,fcstName:e.data.$el.find("#nameFcst").val()};
        	var dataReturned = $.ajax({
    	        type: 'POST',
    	        url: '/blueloop-backend/forecast/saveForecast/',
    	        data: JSON.stringify(forecastData),
    	        contentType: 'application/json; charset=utf-8',
    	        dataType: 'json',
    	        async: false,
    	        success: function(data, textStatus) {
    	        	data =  data;
    	        	toastr.success(json.forecast.forecastModelAdded);
    	        },
    	    	error: function(httpRequest, textStatus, errorThrown) { 
    	     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
    	     	   toastr.error(json.error.tryAgain);
    	     	}
    	    });
        	forecastModuleView.init();
    	}else{
    		toastr.error(json.forecast.forecastModelError);
    	}
    },
    
    validateModel: function(modelId){
    	var hasModel = false;
    	if(forecastModuleView.oneLoopView != undefined){
    		if(forecastModuleView.oneLoopView.modelCollection.where({forecastModel:modelId}).length > 0){
    			hasModel = true;
    		}
    	}
    	return hasModel;
    }

});