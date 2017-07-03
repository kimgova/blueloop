var forecastModelView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstChain/fcstModel/template/fcstModelTemplate.ejs',

    render: function() {
    	this.getForecastPermission();
    	this.$el = $(new EJS({url: this.template }).render({forecastPermission:this.forecastPermission}));
    	var tableView = new forecastModelTableView({ collection: this.getModelCollection(), forecastPermission:this.forecastPermission});
		this.$el.find("#tableContent").append(tableView.render().$el);
        return this;
    },
    
    getModelCollection: function(){
    	var modelCollection = new forecastModelCollection([]);
    	_.each(this.model,function(item,i){
    		var model = new forecastModelModel({
    			id:item.id,
      		  	name: item.name,
      		  	description: item.description
      		});
    		modelCollection.add(model);
	    });
    	return modelCollection;
    },
    
    getForecastPermission:function(){
    	var data = ajaxCall('GET', '/blueloop/user/verifyForecastCreationPermission/', {}, "text/json", "json", false);
    	this.forecastPermission = data.permission 
	},

});