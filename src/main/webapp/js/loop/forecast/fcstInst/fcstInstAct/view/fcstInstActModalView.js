var forecastInstActModalView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstAct/template/fcstInstActModal.ejs',

    render: function() {
        this.$el = $(new EJS({url: this.template }).render({name:this.model.get("name")}));
        var modelView = new forecastInstActView({instanceId:this.model.get("id"),forecastId:this.model.get("forecastId")});
        this.$el.find('.panel-body').append(modelView.render().$el);
        return this;
    }

});