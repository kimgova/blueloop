var forecastBudgetRowView = Backbone.View.extend({
    
    constructor : function (options) {
		_.extend(this, options);
	},
	
    template: '/blueloop/static/js/loop/forecast/fcstChain/fcstBudget/template/fcstBudgetTableRow.ejs',
        
    render: function () {    	
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.$el.find("#editIPO").click(this,this.editIPO);
        this.$el.find("#deleteIPO").click(this,this.deleteIPO);    
        this.$el.find("#viewIPO").click(this,this.viewIPO);    
        return this;
    },

    deleteIPO: function(e) {
    	bootbox.confirm(json.general.deleteRow, function (r) {
			if(r){
		    	var IPOData = {id:e.data.model.id};
		    	var dataReturned = $.ajax({
			        type: 'POST',
			        url: '/blueloop/fcstBudget/deleteIPO/',
			        data: JSON.stringify(IPOData),
			        contentType: 'application/json; charset=utf-8',
			        dataType: 'json',
			        async: false,
			        success: function(data, textStatus) {
			        	data =  data;
			        	e.data.remove();
			        	toastr.success("Successfully deleted");
			        },
			    	error: function(httpRequest, textStatus, errorThrown) { 
			     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
			     	   toastr.error(httpRequest.responseJSON.error);
			     	}
			    });		
			}
		});
	},
	
	editIPO: function(e) {
		var modelView = new forecastBudgetEditRowView( { model: e.data.model,forecastId:e.data.forecastId} );
		e.data.$el.html(modelView.render().$el);
	},
	
	viewIPO: function(e) {
		var budgetSkusView = new forecastBudgetSkusView( { model: e.data.model,forecastId:e.data.forecastId} );
		$('#titleBudget').html(e.data.model.get('description'));
		$("#budgetDetailContent").append(budgetSkusView.render().$el);
		budgetSkusView.setPagination();
		
		$('#budgetContent').empty()
		$("#budgetContent").toggle( "slide" );
		$("#budgetDetailContent").toggle( "slide" );
	},

});