var addTMemberSelectView = Backbone.View.extend({
    template : '/blueloop/static/js/loop/create_edit/teamwork/addTeamMember/template/addTMemberSelect.ejs',

    render : function() {
        this.$el = $(new EJS({url: this.template }).render());
        if (this.collection.length > 0) {
            this.$el.find('#selectUsers').empty();
        }
        this.collection.each(this.addModel, this);
        return this;
    },

    addModel : function(model) {
        var optionView = new addTMemberOptionView({model : model});
        this.$el.append(optionView.render().$el);
    }    
});