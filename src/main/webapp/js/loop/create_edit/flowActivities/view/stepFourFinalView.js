var stepFourActFlow = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/create_edit/flowActivities/template/step_four_template.ejs',
        
    constructor : function (options) {
        _.extend(this, options);
    },
    
    render: function () {
        this.$el = $(new EJS({url: this.template }).render());
        this.setEvents();
        return this;
    },
    
    setEvents: function(){
        this.$el.find(".done").click(this,this.done);
    },
    
    done: function(context){
        $("#flowActivitiesModal").remove();
        $("#form-valve-tooltip").remove();
    }
});