var fcstInstBudgetModalView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstBudget/template/fcstInstBudgetTemplate.ejs',

    render: function() {
    	this.collection = new fcstInstBudgetCollection();
    	this.getForecastBudgets();
    	this.$el = $(new EJS({url: this.template }).render({budgets:this.collection.models}));
    	this.$el.find("#selectBudget").click(this,this.selectBudget);
        return this;
    },
    
    getForecastBudgets: function(){
    	_.each(this.retrieveBudgetList(),function(item,i){
			var model = new fcstInstBudgetModel({
				id:item.id,
				description: item.description
			});
			this.collection.add(model);
		},this);
    },
    
    retrieveBudgetList: function(){
		var dataReturned = $.ajax({
			type: 'GET',
			url: '/blueloop/fcstBudget/getAllBudget/',
			data: {id:this.model.id},
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			success: function(data, textStatus) {
				data = data;
			},
			error: function(httpRequest, textStatus, errorThrown) { 
				console.log("status=" + textStatus + " ,error=" + errorThrown);
				toastr.error(json.error.tryAgain);
			}
		});
		return dataReturned.responseJSON;
	},
	
	selectBudget: function(e) {
		var budgetInstData = {budgetId:e.data.$el.find("#budgetSelect").val(),instanceId:e.data.model.id};
		var dataReturned = $.ajax({
			type: 'POST',
			url: '/blueloop/fcstBudget/selectInstanceBudget/',
			data: JSON.stringify(budgetInstData),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			success: function(data, textStatus) {
				data =  data;
				toastr.success(json.general.successfullySaved);
			},
			error: function(httpRequest, textStatus, errorThrown) { 
				console.log("status=" + textStatus + " ,error=" + errorThrown);
				toastr.error(json.error.tryAgain);
			}
		});
		return dataReturned.responseText;
	}
	    
});