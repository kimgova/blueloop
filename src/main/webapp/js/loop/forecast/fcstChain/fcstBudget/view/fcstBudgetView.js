var forecastBudgetView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/forecast/fcstChain/fcstBudget/template/fcstBudgetTemplate.ejs',

    render: function() {
    	this.$el = $(new EJS({url: this.template }).render());
    	var tableView = new forecastBudgetTableView({ forecastId: this.model.id});
		this.$el.find("#budgetContent").append(tableView.render().$el);
        return this;
    },
      
});