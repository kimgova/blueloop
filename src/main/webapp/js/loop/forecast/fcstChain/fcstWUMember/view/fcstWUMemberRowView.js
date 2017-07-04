var forecastWUMemberOptionView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstChain/fcstWUMember/template/fcstWUMemberOption.ejs',
        
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        return this;
    }

});