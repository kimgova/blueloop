var headerBreadcrumbView = Backbone.View.extend({
    
	template: '/blueloop-backend/static/js/layout/header/template/headerBreadcrumbTemplate.ejs',

    initialize: function(){
    	 _.bindAll(this, 'render', 'setCaret');
      
    },
    
    render: function() {
     	this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
     	$('#bcrumb-caret').css('visibility', 'hidden');
     	this.setCaret();
        return this;
    },
    
    setCaret: function(){
    	$('#bcrumb-caret').css('visibility', 'hidden');
    }
});