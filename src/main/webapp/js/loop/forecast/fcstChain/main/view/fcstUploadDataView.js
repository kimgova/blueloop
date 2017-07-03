var uploadDataView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstChain/main/template/fcstUploadData.ejs',

    render: function() {
    	this.$el = $(new EJS({url: this.template }).render({idForecast:this.idForecast}));
    	this.$el.find("#uploadHistoricalFile").click(this,this.uploadHistoricalFile);
    	
        return this;
    },
    
    uploadHistoricalFile: function(e){
    	if(e.data.validateFile()){
    		e.data.submitForm($("#formUpload"), "/blueloop/forecast/uploadHistorical", e.data )
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
                toastr.success('File submitted successfully');
                view.$el.modal("hide");
                view.$el.remove();
                view.rowModel.set('haveHistory', true);
            },
            error: function(httpRequest, textStatus, errorThrown) { 
            	$("body").removeClass("loading"); 
 	     	   	console.log("status=" + textStatus + " ,error=" + errorThrown);
 	     	   	toastr.error(httpRequest.responseJSON.error);
 	     	} 	     	   
        });
    },
    
    validateFile: function(){
    	var fileName = $("#inputFile").val();
    	if(fileName.match(".xls$")!= null || fileName.match(".xlsx$")!= null ){
    		return true
    	}else{
    		toastr.error("Format file not allowed. Only xls or xlsx files");
    		return false    		
    	}
       return false;
    }
    
});
