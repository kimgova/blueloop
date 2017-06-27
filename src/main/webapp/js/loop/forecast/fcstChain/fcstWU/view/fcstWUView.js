var forecastWUView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/forecast/fcstChain/fcstWU/template/fcstWUTemplate.ejs',

    render: function() {
    	this.$el = $(new EJS({url: this.template }).render());
    	var tableView = new forecastWUTableView({ forecastId: this.model.id, model:this.model});
    	tableView.viewRow = this.viewRow;
		this.$el.find("#wuContent").append(tableView.render().$el);
        return this;
    }
    
});