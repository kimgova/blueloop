var inventoryRowView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/buildingBlock/edit/inventory/main/template/inventoryRowTemplate.ejs',
        
    constructor : function (options) {
		_.extend(this, options);
	},
	
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));

        return this;
    }
    
});