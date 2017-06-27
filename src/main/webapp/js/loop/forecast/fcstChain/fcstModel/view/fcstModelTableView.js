var forecastModelTableView = Backbone.View.extend({
    
	constructor : function (options) {
		_.extend(this, options);
	},
	
    template: '/blueloop-backend/static/js/loop/forecast/fcstChain/fcstModel/template/fcstModelTable.ejs',

    render: function() {
        this.$el = $(new EJS({url: this.template }).render({forecastPermission:this.forecastPermission}));
        if(this.collection.length > 0){
        	this.$el.find('tbody').empty();
        }
        this.collection.each(this.addModel, this);
        return this;
    },
   
    addModel: function(model) {
        var modelView = new forecastModelRowView( { model: model, forecastPermission: this.forecastPermission} );
 		this.$el.find('tbody').append(modelView.render().$el);
    }

});