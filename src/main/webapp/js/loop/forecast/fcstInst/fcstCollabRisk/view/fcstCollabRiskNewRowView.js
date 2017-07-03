var fcstCollabRiskNewRowView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstInst/fcstCollabRisk/template/fcstCollabRiskNewRow.ejs',
        
    constructor : function (options) {
		_.extend(this, options);
	},
    
    render: function () {
        this.$el = $(new EJS({url: this.template }).render());
        this.$el.find("#saveRisk").click(this,this.saveRisk);
        this.$el.find("#cancelRisk").click(this,this.cancelRisk);
        return this;
    },
    
    saveRisk: function(e){
    	if(e.data.validate(e.data.$el.find("#observation").val(), e.data.$el.find("#variation").val(),e.data.$el.find("#probability").val())){    	
	    	var result = JSON.parse(e.data.saveRiskService(e))
	    	var model = new fcstCollabRiskModel({
	    		id:result.risk.id,
				creationDate:result.risk.dateCreation,
				observation:result.risk.observation,
				variation:result.risk.value,
				probability:result.risk.probability,
				user:result.user,
				tableModel:e.data.tablemodel
	  		});
	    	var modelView = new fcstCollabRiskRowView( { model: model } );
	    	e.data.remove();
	    	$('#fcst-collab-risk-modal #riskContent tbody').append(modelView.render().$el);
    	}
    },
    
    saveRiskService: function(e){
    	var riskData = {
    			observation:e.data.$el.find("#observation").val(),
    			variation:e.data.$el.find("#variation").val(),
    			probability:e.data.$el.find("#probability").val(),
    			objectId:e.data.model.id,
    			rowType:e.data.model.get("rowType"),
				filterType:e.data.model.get("filterType"),
				instanceId:e.data.model.get("instanceId"),
    			skus:e.data.getSkusToChange(e)
    			};
    	var dataReturned = $.ajax({
	        type: 'POST',
	        url: '/blueloop/fcstCollaborative/saveCollabRisk/',
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
    	return dataReturned.responseText;
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
	
    getSkusToChange: function(e){
    	var skuList = []
    	if(e.data.model.get("rowLevel") < 4){
    		_.each(e.data.model.get("subList"),function(item,i){
    			if(item.rowLevel == 4){
    				skuList.push(item);
    			}else{
    				_.each(item.subList,function(item2,i){
    	    			if(item2.rowLevel == 4){
    	    				skuList.push(item2);
    	    			}else{
    	    				_.each(item2.subList,function(item3,i){
    	    	    			if(item3.rowLevel == 4){
    	    	    				skuList.push(item3);
    	    	    			}
    	    	    		});
    	    			}
    	    		});
    			}
    		});
    	}
    	return skuList;
    },
    
    cancelRisk: function(e) {
    	e.data.remove();
    }

});