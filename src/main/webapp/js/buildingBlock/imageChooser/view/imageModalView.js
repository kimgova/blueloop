var imageChooserModalView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/buildingBlock/imageChooser/template/imageModalTemplate.ejs',
    
    constructor : function (options) {
        _.extend(this, options);
    },

    //imageType: 1=BB, 2=Activities, 3=Risk
    render: function() {
    	this.setImagesData();
    	this.selectedImage = null;
    	this.$el = $(new EJS({url: this.template }).render({}));
    	
    	this.categories.each(this.showCategory, this);
    	this.loadAllImagesDefault(this);
		this.setEvents();
		this.setScroll();
        return this;
    },
    
    setEvents: function(){
        this.$el.find("#chooseImage").click(this,this.selectImage);
        this.$el.find(".gridliBbImg").dblclick(this,this.selectImage);
        this.$el.find("#allImages").click(this,this.showAllImages);
        
    },
    
    setScroll: function(){
//    	this.$el.find("#images_content").niceScroll({styler:"fb",cursorcolor:"#A1B2BD", cursorwidth: '7', cursorborderradius: '10px', background: '#404040', spacebarenabled:false, cursorborder: ''});
    },
    
    setImagesData: function(){
    	var result = ajaxCall('GET', '/blueloop-backend/imageCategory/getImages/', {imageType:this.imageType}, "text/json", "json", false);

	    this.categories = new categoryCollection([]);
	    _.each(result,function(item,i){
	    	
	    	var images = new imageCollection([]);
	    	_.each(item.images,function(img,j){
	    		var imagen = new imageModel({
	    			fileName:img.fileName,
	    			filePath:img.filePath,
	    			key:img.key
				});
	    		images.push(imagen);
	    	},this); 
	    	
	    	var category = new categoryModel({
	    		categoryFolderPath: item.category.path,
	    	    category:item.category.name,
	    	    images: images
			});
	    	this.categories.push(category);

	    },this); 
	},
	
	selectImage: function(e) {
    	if(e.data.selectedImage != null){
    		e.data.context.setSelectedImage(e.data.selectedImage,e.data.context);
    		e.data.$el.modal("hide");
    	}
    },    
    
	showCategory: function(model){
    	var categView = new categoryView({model:model, modalParent:this});
		this.$el.find("#list_categories").append(categView.render().$el);
    },
    
    showAllImages: function(e){
    	e.data.loadAllImagesDefault(e.data);
    	e.data.$el.find("#list_categories li").removeClass('active');        
    	e.data.$el.find("#allImages").addClass('active');
    	e.data.setScrollOnTop();
    },
    
    loadAllImagesDefault: function(context){
    	context.$el.find("#ulGridImg").html("");
    	context.selectedImage = null;
    	context.categories.each(function(category){
    		category.get("images").each(function(imagen) {
	    		var imgView = new imageView({model:imagen, modalParent:context});
	    		context.$el.find("#ulGridImg").append(imgView.render().$el);
    		 }, this)
        }, this)
    },
    
    setScrollOnTop: function(){
    	this.$el.find("#images_content").scrollTop(0);
    }
});