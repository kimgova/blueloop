var forecastInstSubCatTableView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstEditCat/template/fcstInstSubTable.ejs',
    
    constructor : function (options) {
		_.extend(this, options);
	},

    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        this.getSubCatCollection();
        if(this.collection.length > 0){
        	this.$el.find('tbody').empty();
        }
        this.collection.each(this.addModel, this);
        return this;
    },
    
    getSubCatCollection: function(){
    	this.collection = new forecastSubCollection();
    	_.each(this.retrieveSubCategoryList(this.categoryId),function(item,i){
    		var model = new forecastSubModel({
    			id:item.id,
				name: item.name,
				status: CATEGORY_STATUS[item.status.name],
				categoryId:this.categoryId
			});
			this.collection.add(model);
	    },this);
    },
    
    retrieveSubCategoryList: function(categoryId){
    	var subList = [];
    	if(categoryId != 0){
    		subList = forecastCatCollection.getInstance({}).findWhere({id:categoryId}).get("subCatList");
    	}
    	return subList;
    },

    addModel: function(model) {
        var modelView = new forecastInstSubCatRowView( { model: model } );
 		this.$el.find('tbody').append(modelView.render().$el);
    }

});