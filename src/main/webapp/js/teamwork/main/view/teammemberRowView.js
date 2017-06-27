var teammemberRowView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/teamwork/main/template/teammemberRow.ejs',
        
    constructor : function (options) {
		_.extend(this, options);
	},
	
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        return this;
    }

});