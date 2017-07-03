var historyView = Backbone.View.extend({
    
    template: '/blueloop/static/js/admin/billing/template/historyTemplate.ejs',
    
    constructor : function (options) {
        _.extend(this, options);
    },
    
    render: function () {
        this.$el = $(new EJS({url: this.template }).render());
        this.setEvents();
        return this;
    },
    
    setEvents: function(){
        this.$el.find("#resetPass").click(this,this.resetPass);
    },
    
    resetPass: function(e) {
        
    }

});