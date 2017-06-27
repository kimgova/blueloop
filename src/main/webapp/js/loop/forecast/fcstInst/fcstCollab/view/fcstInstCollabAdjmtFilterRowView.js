var collaborativeFilterRowView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/forecast/fcstInst/fcstCollab/template/fcstInstCollabAdjmtFilterRow.ejs',

    render: function() {
    	this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        return this;
    }

});


