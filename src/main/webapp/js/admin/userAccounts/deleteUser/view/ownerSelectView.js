var ownerSelectView = Backbone.View.extend({
	
    template : '/blueloop/static/js/admin/userAccounts/deleteUser/template/ownerSelect.ejs',
    
    constructor : function (options) {
		_.extend(this, options);
	},

    render : function() {
        this.$el = $(new EJS({url: this.template }).render());
        if (this.collection.length > 0) {
            this.$el.find('#selectUsers').empty();
        }
        this.collection.each(this.addModel, this);
        return this;
    },

    addModel : function(model) {
    	model.set("owner",this.owner);
        var optionView = new ownerOptionView({model : model});
        this.$el.append(optionView.render().$el);
    }
});