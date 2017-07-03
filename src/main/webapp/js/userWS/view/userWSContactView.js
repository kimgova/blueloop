var userWSContactView = Backbone.View.extend({

    template : '/blueloop/static/js/userWS/template/userWSContactViewTemplate.ejs',

    initialize : function() {
        _.bindAll(this, 'render');
    },

    render : function() {

        this.$el = $(new EJS({url : this.template}).render(this.model.toJSON()));
        this.$el.find(".ws-contact-name").parents(".not_partners").click(this, this.askForRequest);

        return this;
    },
    
    askForRequest : function(context){
        var modalView = new friendRequestView({model:context.data.model});
        modalView.render().$el.modal("show");
    }

});