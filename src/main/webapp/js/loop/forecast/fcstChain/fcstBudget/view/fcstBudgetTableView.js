var forecastBudgetTableView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/forecast/fcstChain/fcstBudget/template/fcstBudgetTable.ejs',
    
    constructor : function (options) {
		_.extend(this, options);
	},

    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        this.getBudgetCollection();
        if(this.collection.length > 0){
        	this.$el.find('tbody').empty();
        }
        this.collection.each(this.addModel, this);
        this.$el.find("#uploadBudget").click(this,this.uploadBudget);		
        return this;
    },
    
    getBudgetCollection: function(){
    	this.collection = new forecastBudgetCollection([]);
    	_.each(this.getBudgetIPOList(),function(item,i){
    		var model = new forecastBudgetModel({
    			id:item.id,
      		  	description: item.description,
      		  	creationDate: item.creationDate
      		});
    		this.collection.add(model);
	    },this);
    },
    
    getBudgetIPOList: function(){
    	var dataReturned = $.ajax({
	        type: 'GET',
	        url: '/blueloop-backend/fcstBudget/getIPOsByForecastChain/',
	        data: {id:this.forecastId},
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
		return dataReturned.responseJSON;
    },

    addModel: function(model) {
        var modelView = new forecastBudgetRowView( { model: model, forecastId:this.forecastId} );
 		this.$el.find('tbody').append(modelView.render().$el);
    },
    
    uploadBudget: function(e) {
    	$("#forecast-uploadBudget").remove();
		var uploaderView = new uploadBudgetView({});
		uploaderView.idForecast =  e.data.forecastId; 
		uploaderView.render().$el.modal("show");
	},	  

});