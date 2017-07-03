var forecastBudgetEditRowView = Backbone.View.extend({
    
    constructor : function (options) {
		_.extend(this, options);
	},
	
    template: '/blueloop/static/js/loop/forecast/fcstChain/fcstBudget/template/fcstBudgetTableEditRow.ejs',
        
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.attributes));
        this.$el.find("#saveIPO").click(this,this.editIPO);
        this.$el.find("#cancelIPO").click(this,this.cancelIPO);
        return this;
    },
    
    editIPO: function(e){
    	e.data.saveIPO(e);
    	var tableView = new forecastBudgetTableView({ forecastId: e.data.forecastId});
    	$('#budgetContent').html(tableView.render().$el);
    },
    
    saveIPO: function(e){
    	var IPOData = {id:e.data.model.id,description:e.data.$el.find("#nameIPO").val()};
    	var dataReturned = $.ajax({
	        type: 'POST',
	        url: '/blueloop/fcstBudget/editIPO/',
	        data: JSON.stringify(IPOData),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        async: false,
	        success: function(data, textStatus) {
	        	data =  data;
	        	toastr.success("Successfully saved");
	        },
	    	error: function(httpRequest, textStatus, errorThrown) { 
	     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
	     	   toastr.error(json.error.tryAgain);
	     	}
	    });
    },
    
    cancelIPO: function(e) {
    	var tableView = new forecastBudgetTableView({ forecastId: e.data.forecastId});
    	$('#budgetContent').html(tableView.render().$el);
    }

});