var categoryView = Backbone.View.extend({
    
	template: '/blueloop/static/js/buildingBlock/imageChooser/template/categoryTemplate.ejs',
    
	constructor : function (options) {
        _.extend(this, options);
    },
    
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.attributes));
        this.setEvents();
        return this;
    },
    
    setEvents: function(){
    	this.$el.click(this,this.showImages);
    },
    
    showImages: function(e) {
    	e.data.modalParent.$el.find("#ulGridImg").html("");
    	e.data.modalParent.selectedImage = null;
    	e.data.model.get("images").each(function(model) {
    		var imgView = new imageView({model:model, modalParent:e.data.modalParent});
    		e.data.modalParent.$el.find("#ulGridImg").append(imgView.render().$el);
        }, this)
		e.data.$el.parent().find('li').removeClass('active');        
    	e.data.$el.addClass('active');
    	e.data.modalParent.setScrollOnTop();
    } 
});