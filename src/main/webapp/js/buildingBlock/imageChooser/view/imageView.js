var imageView = Backbone.View.extend({
    
	template: '/blueloop-backend/static/js/buildingBlock/imageChooser/template/imageTemplate.ejs',
    
	constructor : function (options) {
        _.extend(this, options);
    },
    
    render: function () {
        this.$el = $(new EJS({url: this.template}).render(this.model.attributes));
        this.setEvents();
        return this;
    },
    
    setEvents: function(){
    	this.$el.click(this,this.pickImage);
    },
    
    pickImage: function(e) {  
    	e.data.modalParent.selectedImage = e.data.model;
    	e.data.$el.parent().find('li').removeClass('active');        
    	e.data.$el.addClass('active');   
    },
    
});