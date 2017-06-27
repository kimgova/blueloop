var forecastWUActRowView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/forecast/fcstChain/fcstWUAct/template/fcstWUActTableRow.ejs',
    noDataTemplate: '/blueloop-backend/static/js/loop/forecast/fcstChain/fcstWUAct/template/fcstWUActNoDataRow.ejs',
        
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.$el.find("#editAct").click(this,this.editAct);
        this.$el.find("#deleteAct").click(this,this.deleteAct); 
        return this;
    },

    deleteAct: function(e) {
    	bootbox.confirm(json.general.deleteRow, function (r) {
			if(r){
		    	var actData = {id:e.data.model.id};
		    	var dataReturned = $.ajax({
			        type: 'POST',
			        url: '/blueloop-backend/fcstWUnit/deleteWUActivity/',
			        data: JSON.stringify(actData),
			        contentType: 'application/json; charset=utf-8',
			        dataType: 'json',
			        async: false,
			        success: function(data, textStatus) {
			        	data =  data;
			        	e.data.remove();
			        	toastr.success(json.forecast.deleteWUActivity);
			        },
			    	error: function(httpRequest, textStatus, errorThrown) { 
			     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
			     	   toastr.error(httpRequest.responseJSON.error);
			     	}
			    });				
			}
		});
	},
	
	editAct: function(e) {
		var modelView = new forecastWUActEditRowView( { model: e.data.model } );
		e.data.$el.empty();
		e.data.$el.append(modelView.render().$el);
	},

});