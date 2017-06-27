var forecastWUNewRowView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/forecast/fcstChain/fcstWU/template/fcstWUTableNewRow.ejs',
        
    constructor : function (options) {
		_.extend(this, options);
	},
    
    render: function () {
        this.$el = $(new EJS({url: this.template }).render());
        this.$el.find("#saveWU").click(this,this.saveWU);
        this.$el.find("#cancelWU").click(this,this.cancelWU);
        return this;
    },
    
    saveWU: function(e){
    	var result = JSON.parse(e.data.saveWUService(e))
    	var wuSaved = result[0];
    	var filePath = result[2];
    	var model = new forecastWUModel({
			id: wuSaved.id,
  		  	name: wuSaved.name,
  		  	forecastId:e.data.forecastId,
  		  	activities: [],
  		  	members: result[3],
  		  	filePath: filePath
  		});
    	var modelView = new forecastWURowView( { model: model } );
    	modelView.viewRow = e.data.viewRow;
    	e.data.remove();
    	$('#forecast-wu #wuContent tbody').append(modelView.render().$el);
    },
    
    saveWUService: function(e){
    	var wuData = {id:e.data.forecastId,name:e.data.$el.find("#nameWU").val()};
    	var dataReturned = $.ajax({
	        type: 'POST',
	        url: '/blueloop-backend/fcstWUnit/saveWorkingUnit/',
	        data: JSON.stringify(wuData),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        async: false,
	        success: function(data, textStatus) {
	        	data =  data;
        		e.data.viewRow.model.set("workingUnits", data[1]);
        		e.data.viewRow.updateRow();
        		toastr.success(json.forecast.forecastWUAdded);
	        },
	    	error: function(httpRequest, textStatus, errorThrown) { 
	     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
	     	   toastr.error(json.error.tryAgain);
	     	}
	    });
    	return dataReturned.responseText;
    },
    
    cancelWU: function(e) {
    	e.data.remove();
    }

});