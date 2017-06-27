var bbAccessNoAllowedView = Backbone.View.extend({

    template : '/blueloop-backend/static/js/userWS/template/bbAccessNoAllowedTemplate.ejs',

    render : function() {
        this.$el = $(new EJS({url : this.template}).render(this.model.toJSON()));      
        this.setEvents();
        return this;
    },
    
    setEvents : function(){
        this.$el.find(".close").click(this, this.close);
    },
    
    close : function(context){
        context.data.$el.remove();
    }

});