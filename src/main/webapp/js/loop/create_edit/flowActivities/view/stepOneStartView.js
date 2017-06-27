var stepOneStartView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/create_edit/flowActivities/template/step_one_template.ejs',
       
    constructor : function (options) {
        _.extend(this, options);
    },

    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        return this;
    }
    
});