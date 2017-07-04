var forecastWUActView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstChain/fcstWUAct/template/fcstWUActTemplate.ejs',

    render: function() {
    	this.$el = $(new EJS({url: this.template }).render());
    	var tableView = new forecastWUActTableView({ model: this.model});
		this.$el.find("#tableContent").append(tableView.render().$el);
		this.$el.find("#backBtn").click(this,this.backToWUList);
        return this;
    },
    
    backToWUList: function(e){
    	var tableView = new forecastWUTableView({ forecastId: e.data.model.get("forecastId")});
    	tableView.viewRow = e.data.viewRow; 
    	$('#wuContent').append(tableView.render().$el);
    	$("#actContent").empty();
    	$("#actContent").toggle( "slide" );
    	$("#wuContent").toggle( "slide" );
    }

});