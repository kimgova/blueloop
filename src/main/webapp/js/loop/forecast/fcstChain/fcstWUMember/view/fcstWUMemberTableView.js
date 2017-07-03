var forecastWUMemberSelectView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstChain/fcstWUMember/template/fcstWUMemberSelect.ejs',

    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        this.collection = this.model.get("memberCollection");
        this.collection.each(this.addModel, this);
        this.setMultipleSelect();
        return this;
    },

    addModel: function(model) {
        var modelView = new forecastWUMemberOptionView( { model: model } );
 		this.$el.append(modelView.render().$el);
    },
    
    setMultipleSelect: function(){
    	var that = this;
		this.$el.multiSelect({
			afterSelect: function(values){
				that.saveTeamMember(that.model.id,that.model.get("forecastId"),values[0],that.viewRow);
			},
			afterDeselect: function(values){
				that.deleteTeamMember(that.model.id,that.model.get("forecastId"),values[0],that.viewRow);
			}
		});
    },
    
    saveTeamMember: function(wuId, forecastId, userId, viewRow){
    	var memberData = {id:wuId,forecastId:forecastId,userId:userId};
    	var dataReturned = $.ajax({
	        type: 'POST',
	        url: '/blueloop/fcstWUnit/saveWUMember/',
	        data: JSON.stringify(memberData),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        async: false,
	        success: function(data, textStatus) {
	        	data =  data;
	        	viewRow.model.set("workingUnits", data[1])
        		viewRow.updateRow();
	        	toastr.success(json.forecast.forecastWUUserAdded);
	        },
	    	error: function(httpRequest, textStatus, errorThrown) { 
	     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
	     	   toastr.error(json.error.tryAgain);
	     	}
	    });
    },
    
    deleteTeamMember: function(wuId, forecastId, userId, viewRow){
    	var memberData = {id:wuId,forecastId:forecastId,userId:userId};
    	var dataReturned = $.ajax({
	        type: 'POST',
	        url: '/blueloop/fcstWUnit/deleteWUMember/',
	        data: JSON.stringify(memberData),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        async: false,
	        success: function(data, textStatus) {
	        	data =  data;
	        	viewRow.model.set("workingUnits", data[1])
        		viewRow.updateRow();
	        	toastr.success(json.forecast.forecastWUUserRemoved);
	        },
	    	error: function(httpRequest, textStatus, errorThrown) { 
	     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
	     	   toastr.error(json.error.tryAgain);
	     	}
	    });
    }

});