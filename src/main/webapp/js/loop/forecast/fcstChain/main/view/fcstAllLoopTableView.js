var forecastLoopTableView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstChain/main/template/fcstAllLoopTable.ejs',

    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        this.collection.each(this.addRow, this);
        return this;
    },

    addRow: function(model) {
       var modelView = new forecastLoopTableRowView( {model: model} );
       this.$el.find('tbody').append(modelView.render().$el);
    }
    
});
