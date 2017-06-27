bbGridElementCollection = Backbone.Collection.extend({

  model: bbGridElementModel,
  
  byOwner: function (ownership) {
	    this.each(function(model){
	      
	      if(ownership === 'Archived'){
	    		if (model.attributes['archived'] === true ){
	    	        model.trigger('show')
	    	      }
	    	      else{
	    	        model.trigger('hide')
	    	      }
	    	}else{
	    		if( (model.attributes['ownership'] === ownership || ownership === 'All') && model.attributes['archived'] === false ){
	    	        model.trigger('show')
	    	      }
	    	      else{
	    	        model.trigger('hide')
	    	      }
	    	}      
	      
	    });
  },
  
  byName : function(letters){
		var pattern = new RegExp(letters,"gi");
	    this.each(function(model){
	      if ( pattern.test(model.attributes['name']) && model.attributes['archived'] === false ){
	        model.trigger('show')
	      }
	      else{
	        model.trigger('hide')
	      }
	    });
	}

});


