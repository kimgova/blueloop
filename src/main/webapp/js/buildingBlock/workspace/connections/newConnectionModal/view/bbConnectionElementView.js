var bbConnectionElementView = Backbone.View.extend({
    
    template: '/blueloop/static/js/buildingBlock/workspace/connections/newConnectionModal/template/bbConnectionElementViewTemplate.ejs',
    
    
    initialize: function(){
    	_.bindAll(this, 'selectBB'); 
    	this.listenTo(this.model, 'show', this.show);
        this.listenTo(this.model, 'hide', this.hide);
    },
    
     render: function() {
    	this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
    	this.$el.find('#select-btn').click(this, this.selectBB);
        return this;
    },
    
    hide: function()
    {
      this.$el.addClass('hide')
    },
    
    show: function()
    {
      this.$el.removeClass('hide')
    },
    
    selectBB : function(e){
    	e.preventDefault();
    	connModal.refreshSelection(this.model);
    }
    
    
    
});