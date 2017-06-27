var forecastWUModel = Backbone.Model.extend({
	
	defaults: {
	    id: 0,
	    name: ""
	},
	
	initialize: function(){
		this.set("activityCollection",new forecastWUActCollection([]));
		this.set("memberCollection",new forecastWUMemberCollection([]));
		this.setWUActCollection();
	    this.setWUMemberCollection();
	},

	setWUActCollection: function(){
		_.each(this.get("activities"),function(item,i){
			var model = new forecastWUActModel({
				id:item.id,
	  		  	name: item.name,
	  		  	imgUrl: item.fileName,
	  		  	filePath:this.get("filePath")
	  		});
			this.get("activityCollection").add(model);
	    },this);
	},

	setWUMemberCollection: function(){
		_.each(this.get("members"),function(item,i){
			var model = new forecastWUMemberModel({
				id:item.id,
	  		  	name: item.name,
	  		  	selected: item.selected
	  		});
			this.get("memberCollection").add(model);
	    },this);
	}

});