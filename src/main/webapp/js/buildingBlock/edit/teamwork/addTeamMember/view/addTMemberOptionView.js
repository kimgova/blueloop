var addTMemberOptionView = Backbone.View.extend({
    
    template : '/blueloop/static/js/buildingBlock/edit/teamwork/addTeamMember/template/addTMemberOption.ejs',

    render : function() {
        this.$el = $(new EJS({url : this.template}).render(this.model.toJSON()));
        return this;
    }

});