var forecastInstanceView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/forecast/fcstInst/main/template/fcstInstTemplate.ejs',

    idForecastChain: 0,
    
    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        var tableView = new forecastInstanceTableView({ forecastId: this.idForecastChain});
        this.$el.find("#tableInstancesContent").append(tableView.render().$el);        
        $("#forecasts").html(this.$el);        
        tableView.setPagination();
        this.$el.find("#backBtn").click(this,this.gotoForecastList);
         
        return this;
    },
    
    gotoForecastList: function(e) {
        window.location.href = '#forecastList/';
    },
    
    
});