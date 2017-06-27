var uploadBudgetView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/forecast/fcstChain/fcstBudget/template/fcstUploadBudget.ejs',

    render: function() {
    	this.$el = $(new EJS({url: this.template }).render({idForecast:this.idForecast}));
    	this.$el.find("#uploadBudgetFile").click(this,this.uploadBudgetFile);
    	
        return this;
    },
    
    uploadBudgetFile: function(e){
    	if(e.data.validateFile()){
    		e.data.submitForm($("#formUploadBudget"), "/blueloop-backend/fcstBudget/uploadBudgetData", e.data )
    	}    	
    },
    
    submitForm: function(formObj, url, view) {
        $(formObj).ajaxSubmit({
            async: true,
            url: url,
            beforeSubmit: function() { 
            	$("body").addClass("loading");    
 			},
            success: function (data) {
            	$("body").removeClass("loading"); 
                toastr.success(json.forecast.budget.submitted);
                if(data.unsavedTotal > 0){
                    toastr.warning(data.unsavedTotal + json.forecast.budget.msg);
                }                 
                
                $('#budgetContent').empty();
                var tableView = new forecastBudgetTableView({ forecastId:view.idForecast });
                $('#budgetContent').append(tableView.render().$el);
                
                view.$el.modal("hide");
                view.$el.remove();
            },
            error: function(httpRequest, textStatus, errorThrown) { 
            	$("body").removeClass("loading"); 
                console.log("status=" + textStatus + " ,error=" + errorThrown);
                toastr.error(httpRequest.responseJSON.error);
              }
        });
    },
    
    validateFile: function(){
    	var valid = true;
    	var description =  $("#budgetDescription").val();
    	if(description.trim() == ''){
    		toastr.error(json.forecast.budget.nameIPO);
    		valid = false;    		
    	}
    	
    	var fileName = $("#inputFile").val();
    	if(fileName.match(".xls$")== null && fileName.match(".xlsx$")== null ){    	
    		toastr.error(json.forecast.budget.format);
    		valid = false;   		
    	}
    	return valid;
    }
    
});
