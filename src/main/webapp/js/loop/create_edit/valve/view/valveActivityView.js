var valveActivityView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/create_edit/valve/template/valveActivityRow.ejs',
    
    constructor : function (options) {
        _.extend(this, options);
    },

    render: function() {
    	this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
    	this.setEvents();
        return this;
    },
    
    setEvents: function(){
        this.$el.find("#rl"+this.model.id).click(this,this.changeState);
        this.$el.find("#ra"+this.model.id).click(this,this.changeMCState);
    },
    
    changeState: function(e){
        if(e.currentTarget.checked){
            e.data.$el.find("#mc"+e.data.model.id).prop('disabled', false);
            e.data.$el.find("#ra"+e.data.model.id).prop('disabled', false);
        }else{
            e.data.$el.find("#mc"+e.data.model.id).prop('disabled', true);
            e.data.$el.find("#mc"+e.data.model.id).prop('checked', false);
            e.data.$el.find("#ra"+e.data.model.id).prop('disabled', true);
            e.data.$el.find("#ra"+e.data.model.id).prop('checked', false);
        }
    },
    
    changeMCState: function(e){
    	if(e.currentTarget.checked){
    		e.data.$el.find("#mc"+e.data.model.id).prop('checked', true);
    		e.data.$el.find("#mc"+e.data.model.id).prop('disabled', true);
    	}else{
    	    e.data.$el.find("#mc"+e.data.model.id).prop('checked', false);
    	    e.data.$el.find("#mc"+e.data.model.id).prop('disabled', false);
    	}
    }
    
});