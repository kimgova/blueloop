var lastStepView = Backbone.View.extend({
    
	template: '/blueloop-backend/static/js/admin/userAccounts/deleteUser/template/lastStepTemplate.ejs',
       
    constructor : function (options) {
		_.extend(this, options);
	},

    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        return this;
    }
    
});