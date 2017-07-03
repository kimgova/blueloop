var mapTableRowView = Backbone.View.extend({
    
    template: '/blueloop/static/js/buildingBlock/edit/inventory/map/template/mapTableRow.ejs',
        
    render: function () {       
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        
        return this;
    }

});