var activityListView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstChain/fcstWUAct/template/fcstWUActSeqActivityTemplate.ejs',

    render: function() {
    	this.$el = $(new EJS({url: this.template }).render({model:this.model.toJSON(), select:this.collection.models}));
    	
    	var that=this;
    	this.select = this.$el.find(".dependency-select#select-" + this.model.get("id")).multipleSelect({
		    filter: true,
	 		width: 175,
	 		multipleWidth: 250    	
		});

    	this.$el.find(".ms-drop li input").click(this,this.changeDependency);
        return this;
    },
    
    changeDependency: function(e) {
	    var dependencies = []
	    _.each(e.data.select.find("option"),function(option,i){
    		if(option.selected){    	
    			dependencies.push({id:option.value, name:""})
    		}
    	});	    
	    e.data.model.set("dependencies", dependencies)	    	    
	},

});


