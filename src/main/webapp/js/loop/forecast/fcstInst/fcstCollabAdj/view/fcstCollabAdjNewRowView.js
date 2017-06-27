var fcstCollabAdjNewRowView = Backbone.View.extend({
	
	template: '/blueloop-backend/static/js/loop/forecast/fcstInst/fcstCollabAdj/template/fcstCollabAdjNewRow.ejs',
		
	constructor : function (options) {
		_.extend(this, options);
	},
	
	render: function () {
		this.$el = $(new EJS({url: this.template }).render());
		this.$el.find("#saveCollabAdjustment").click(this,this.saveNew);
		this.$el.find("#cancelCollabAdjustment").click(this,this.cancelNew);
		return this;
	},
	
	saveNew: function(e){
		if(e.data.validate(e.data.$el.find("#observation").val(), e.data.$el.find("#value").val())){
			var result = JSON.parse(e.data.saveCollabAdjustment(e))
	    	var model = new fcstCollabAdjModel({
	    		id:result.adjustment.id,
				creationDate:result.adjustment.dateCreation,
				observation:result.adjustment.observation,
				value:result.adjustment.value,
				user:result.user,
    			tableModel:e.data.tablemodel
	  		});
	    	var modelView = new fcstCollabAdjRowView( { model: model } );
	    	e.data.remove();
	    	$('#collaborative-adjustments-modal #adjContent tbody').append(modelView.render().$el);			
		}		
	},
	
	saveCollabAdjustment: function(e){
		var adjData = {
    			observation:e.data.$el.find("#observation").val(),
    			variation:e.data.$el.find("#value").val(),
    			objectId:e.data.model.id,
    			rowType:e.data.model.get("rowType"),
				filterType:e.data.model.get("filterType"),
				instanceId:e.data.model.get("instanceId"),
    			skus:e.data.getSkusToChange(e)
    			};
		var dataReturned = $.ajax({
			type: 'POST',
			url: '/blueloop-backend/fcstCollaborative/saveCollaborativeAdjustment/',
			data: JSON.stringify(adjData),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			success: function(data, textStatus) {
				data =  data;
			},
			error: function(httpRequest, textStatus, errorThrown) { 
				toastr.error(httpRequest.responseJSON.error);
		 	}
		});
		return dataReturned.responseText;
	},
	
	validate: function(observation, variation){
		var regexNum    = /^(\d|-)?(\d|,)*\.?\d*$/;
//		var regexNum    = /^[+-]?[0-9]{1,9}(?:\.[0-9]{1,2})?$/;
        var regexBlank  = /^\s*$/;
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
	
	cancelNew: function(e) {
		e.data.remove();
	}

});