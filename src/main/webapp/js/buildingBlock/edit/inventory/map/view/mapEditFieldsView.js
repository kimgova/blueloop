var mapEditFieldsView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/buildingBlock/edit/inventory/map/template/mapEditFields.ejs',

    render: function() {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        
        return this;
    }

});


