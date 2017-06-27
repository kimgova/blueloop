var forecastInstanceEditRowView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/forecast/fcstInst/main/template/fcstInstEditRow.ejs',
        
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.$el.find("#saveInstance").click(this,this.saveEditInstance);
        this.$el.find("#cancelInstance").click(this,this.cancelEditInstance);
        return this;
    },
    
    saveEditInstance: function(e){
    	var datainstance = JSON.parse(e.data.editInstance(e.data));
    	var tableView = new forecastInstanceTableView({ forecastId: datainstance.forecastChain.id});
    	$('#tableInstancesContent').html(tableView.render().$el);
    	tableView.setPagination();
    },
    
    editInstance: function(data){
    	var instance = {id:data.model.id,name:data.$el.find("#nameInstance").val()};
    	var dataReturned = $.ajax({
	        type: 'POST',
	        url: '/blueloop-backend/forecast/editForecastInstance/',
	        data: JSON.stringify(instance),
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
    
    cancelEditInstance: function(e) {
    	var rowView = new forecastInstanceRowView( { model: e.data.model } );
    	e.data.$el.parent().after(rowView.render().$el);
    	e.data.remove();
    }

});