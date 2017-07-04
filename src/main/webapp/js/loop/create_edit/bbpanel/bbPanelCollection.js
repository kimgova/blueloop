var bbPanelCollection = Backbone.Collection.extend({

	model: bbPanelModel,
	
	search : function(letters){
		var pattern = new RegExp(letters,"gi");
		this.each(function(model){
			if ( pattern.test(model.attributes['name']) ){
		        model.trigger('show')
		      }
		      else{
		        model.trigger('hide')
		      }
		});
	}

});