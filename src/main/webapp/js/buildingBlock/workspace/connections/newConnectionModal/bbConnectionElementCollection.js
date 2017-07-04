bbConnectionElementCollection = Backbone.Collection.extend({

  model: bbConnectionElementModel,
   
  byName : function(letters){
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


