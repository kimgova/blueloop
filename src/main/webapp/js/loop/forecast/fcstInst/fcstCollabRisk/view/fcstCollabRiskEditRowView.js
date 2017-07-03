var fcstCollabRiskEditRowView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstInst/fcstCollabRisk/template/fcstCollabRiskEditRow.ejs',
        
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.$el.find("#saveRisk").click(this,this.saveRisk);
        this.$el.find("#cancelRisk").click(this,this.cancelRisk);
        return this;
    },
    
    saveRisk: function(e){
    	if(e.data.validate(e.data.$el.find("#observation").val(), e.data.$el.find("#variation").val(),e.data.$el.find("#probability").val())){
	    	e.data.saveRiskService(e);
	    	$('#fcst-collab-risk-modal #riskContent').empty()
	    	var tableView = new fcstCollabRiskTableView({ model: e.data.model.get("tableModel")});
	    	$('#fcst-collab-risk-modal #riskContent').append(tableView.render().$el);
    	}
    },
    
    saveRiskService: function(e){
    	var riskData = {
    			id:e.data.model.id,
    			observation:e.data.$el.find("#observation").val(),
    			value:e.data.$el.find("#variation").val(),
    			probability:e.data.$el.find("#probability").val()
    			};
    	var dataReturned = $.ajax({
	        type: 'POST',
	        url: '/blueloop/fcstCollaborative/editCollabRisk/',
	        data: JSON.stringify(riskData),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        async: false,
	        success: function(data, textStatus) {
	        	data =  data;
	        },
	    	error: function(httpRequest, textStatus, errorThrown) { 
	     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
	     	   toastr.error(json.error.tryAgain);
	     	}
	    });
    },
    
    validate: function(observation, variation, probability){
		var regexNum    = /^(\d|-)?(\d|,)*\.?\d*$/;		
        var regexBlank  = /^\s*$/;
        var regexNumPositive = /^([0-9])*[.]?[0-9]*$/;
		var valid = true;
		if(observation.trim() == "" || regexBlank.test(observation)){
			toastr.error(json.error.errorEmptyObservation);
			valid = false;
		}	
		if(variation.trim() == "" || regexBlank.test(variation)){
			toastr.error(json.error.errorEmptyVariation);
			valid = false;
		}else{
			if (!regexNum.test(variation.trim())){
	            toastr.error(json.error.errorNumericVariation);
	            return false;
	        }
		}		      
		if(probability.trim() == "" || regexBlank.test(probability)){
			toastr.error(json.error.errorEmptyProbability);
			valid = false;
		}else{
			if (!regexNumPositive.test(probability.trim())){
	            toastr.error(json.error.errorNumericProbability);
	            return false;
	        }
		}
		
		return valid;
	},
    
    cancelRisk: function(e) {
    	$('#fcst-collab-risk-modal #riskContent').empty()
    	var tableView = new fcstCollabRiskTableView({ model: e.data.model.get("tableModel")});
    	$('#fcst-collab-risk-modal #riskContent').append(tableView.render().$el);
    }

});