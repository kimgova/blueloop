var userWSPanelView = Backbone.View.extend({

    template : '/blueloop/static/js/userWS/template/userWSPanelViewTemplate.ejs',

    initialize : function(userId, current_id) {
        this.userId     = userId;
        this.current_id = current_id;
    },

    render : function() {
        this.$el = $(new EJS({url : this.template}).render());

        var loopListView = new userWSLoopListView(this.userId,this.current_id);
        this.$el.find('#ws-loops-container').append(loopListView.render().$el);

        var bbListView = new userWSBBListView(this.userId,this.current_id);
        this.$el.find('#ws-bbs-container').append(bbListView.render().$el);

        var contactListView = new userWSContactListView(this.userId);
        this.$el.find('#ws-contacts-container').append(contactListView.render().$el);

        return this;
    }

});