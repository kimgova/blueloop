var firstStepView = Backbone.View.extend({
    
	template: '/blueloop/static/js/admin/userAccounts/deleteUser/template/firstStepTemplate.ejs',
       
    constructor : function (options) {
		_.extend(this, options);
	},

    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        return this;
    }
    
});