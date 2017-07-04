var fileRowView = Backbone.View.extend({
    
    template: '/blueloop/static/js/buildingBlock/edit/inventory/file/template/fileRowTemplate.ejs',
    
    render: function() {
        this.$el = $(new EJS({url: this.template}).render(this.model.toJSON()));
        return this;
    }

});