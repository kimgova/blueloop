peopleCollection = Backbone.Collection.extend({

  model: peopleElementModel,
  
  byName : function(letters){
	 
		var pattern = new RegExp(letters,"gi");
	    this.each(function(model){
	      if ( pattern.test(model.attributes['firstName']) ){
	        model.trigger('show')
	      }
	      else{
	        model.trigger('hide')
	      }
	    });
	}

});