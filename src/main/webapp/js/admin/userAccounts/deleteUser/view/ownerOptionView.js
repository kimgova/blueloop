var ownerOptionView = Backbone.View.extend({
    
    template : '/blueloop-backend/static/js/admin/userAccounts/deleteUser/template/ownerOption.ejs',

    render : function() {
        this.$el = $(new EJS({url : this.template}).render(this.model.toJSON()));
        return this;
    }

});