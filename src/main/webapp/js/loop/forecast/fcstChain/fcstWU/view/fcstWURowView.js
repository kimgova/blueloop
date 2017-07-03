var forecastWURowView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstChain/fcstWU/template/fcstWUTableRow.ejs',
    noDataTemplate: '/blueloop/static/js/loop/forecast/fcstChain/fcstWU/template/fcstWUNoDataRow.ejs',
        
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.$el.find("#editWU").click(this,this.editWU);
        this.$el.find("#addWUActivities").click(this,this.addWUActivities);
        this.$el.find("#addWUMembers").click(this,this.addWUMembers);
        this.$el.find("#deleteWU").click(this,this.deleteWU);        
        return this;
    },

    deleteWU: function(e) {
    	bootbox.confirm(json.general.deleteRow, function (r) {
			if(r){
		    	var wuData = {id:e.data.model.id};
		    	var dataReturned = $.ajax({
			        type: 'POST',
			        url: '/blueloop/fcstWUnit/deleteWorkingUnit/',
			        data: JSON.stringify(wuData),
			        contentType: 'application/json; charset=utf-8',
			        dataType: 'json',
			        async: false,
			        success: function(data, textStatus) {
			        	data =  data;
			        	e.data.viewRow.model.set("workingUnits", data[1])
		        		e.data.viewRow.updateRow();
			        	e.data.remove();
			        	if($("#tableForecastWU tbody").find("tr").length == 0){
			        		$("#tableForecastWU tbody").append(new EJS({url: e.data.noDataTemplate }).render());
			        	}
			        	toastr.success(json.forecast.forecastWURemoved);
			        },
			    	error: function(httpRequest, textStatus, errorThrown) { 
			     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
			     	   toastr.error(httpRequest.responseJSON.error);
			     	}
			    });		
			}
		});
	},
	
	editWU: function(e) {
		var modelView = new forecastWUEditRowView( { model: e.data.model } );
		modelView.viewRow = e.data.viewRow;
		e.data.$el.empty();
		e.data.$el.append(modelView.render().$el);
	},
	
	addWUActivities: function(e){
		var actView = new forecastWUActView( { model: e.data.model } );
		actView.viewRow = e.data.viewRow;
		$("#actContent").append(actView.render().$el);
		$('#wuContent').empty()
		$("#wuContent").toggle( "slide" );
		$("#actContent").toggle( "slide" );
	},
	
	addWUMembers: function(e){
		var memView = new forecastWUMemberView( { model: e.data.model } );
		memView.viewRow = e.data.viewRow;
		$("#memContent").append(memView.render().$el);
		$('#wuContent').empty()
		$("#wuContent").toggle( "slide" );
		$("#wu-members").multiSelect('refresh');
		$("#memContent").toggle( "slide" );
	}

});