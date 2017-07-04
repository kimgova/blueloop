var forecastWUMemberView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstChain/fcstWUMember/template/fcstWUMemberTemplate.ejs',

    render: function() {
    	this.$el = $(new EJS({url: this.template }).render());
    	var tableView = new forecastWUMemberSelectView({ model: this.model});
    	tableView.viewRow = this.viewRow
		this.$el.find("#tableContent").append(tableView.render().$el);
		this.$el.find("#backBtn").click(this,this.backToWUList);
        return this;
    },
    
    backToWUList: function(e){
    	var tableView = new forecastWUTableView({ forecastId: e.data.model.get("forecastId")});
    	tableView.viewRow = e.data.viewRow;
    	$('#wuContent').append(tableView.render().$el);
    	$("#memContent").empty();
    	$("#memContent").toggle( "slide" );
    	$("#wuContent").toggle( "slide" );
    }

});