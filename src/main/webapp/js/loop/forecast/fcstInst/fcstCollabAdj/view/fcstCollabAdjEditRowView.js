var fcstCollabAdjEditRowView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/forecast/fcstInst/fcstCollabAdj/template/fcstCollabAdjEditRow.ejs',
        
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.$el.find("#saveCollabAdjustment").click(this,this.saveEdit);
        this.$el.find("#cancelCollabAdjustment").click(this,this.cancelEdit);
        return this;
    },
    
    saveEdit: function(e){
    	if(e.data.validate(e.data.$el.find("#observation").val(), e.data.$el.find("#value").val())){    		
			e.data.editCollabAdjustment(e);
	    	$('#collaborative-adjustments-modal #adjContent').empty()
	    	var tableView = new fcstCollabAdjTableView({ model: e.data.model.get("tableModel")});
	    	$('#collaborative-adjustments-modal #adjContent').append(tableView.render().$el);
    	}
    },
    
    editCollabAdjustment: function(e){
    	var adjData = {
    			id:e.data.model.id,
    			observation:e.data.$el.find("#observation").val(),
    			value:e.data.$el.find("#value").val()
    			};
    	var dataReturned = $.ajax({
	        type: 'POST',
	        url: '/blueloop-backend/fcstCollaborative/editCollaborativeAdjustment/',
	        data: JSON.stringify(adjData),
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
    
	validate: function(observation, variation){
		var regexNum    = /^(\d|-)?(\d|,)*\.?\d*$/;
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
    
    cancelEdit: function(e) {
    	$('#collaborative-adjustments-modal #adjContent').empty()
    	var tableView = new fcstCollabAdjTableView({ model: e.data.model.get("tableModel")});
    	$('#collaborative-adjustments-modal #adjContent').append(tableView.render().$el);
    }

});