var forecastAllLoopView = Backbone.View.extend({
	
	template: '/blueloop/static/js/loop/forecast/fcstChain/main/template/fcstAllLoopTemplate.ejs',
	nodataTemplate:'/blueloop/static/js/loop/forecast/fcstChain/main/template/nodatafound.ejs',

	init:function (){
		this.$el = $(new EJS({url: this.template }).render());
    	this.getForecastCollection();
    	this.$el.find("#search-forecast").keypress(this, this.search);
	},
	
    render: function() {
    	this.$el.find("#tableContent").html("");	
    	var tableView = new forecastLoopTableView({collection: this.modelCollection});
		this.$el.find("#tableContent").append(tableView.render().$el);	
        return this;
    },
    
	getForecastCollection: function(){
		this.modelCollection = new forecastCollection([]);
		_.each(this.model.data,function(item,i){
			var model = new forecastModel({
				id:item.forecastChain.id,
				forecastModel:item.forecastModel,
				chain: item.chain,
				leaders:item.leaders,
				workingUnits:item.workingUnits,
				imagePath: item.imagePath,
				currentUser:item.currentUser,
				name:item.forecastChain.name,
				
				forecastFor:item.forecastChain.forecastFor,	
				planningPeriodicity:item.forecastChain.planningPeriodicity.name,
				planningRepeat:item.forecastChain.planningRepeat.name,
				planningFrecuencyRepeat:item.forecastChain.planningFrecuencyRepeat.name,
				planningRepeatValue:item.forecastChain.planningRepeatValue,
				planningTimeAvailable:item.forecastChain.planningTimeAvailable,
				signOffRepeat:item.forecastChain.signOffRepeat.name,
				signOffFrecuencyRepeat:item.forecastChain.signOffFrecuencyRepeat.name,
				signOffRepeatValue:item.forecastChain.signOffRepeatValue,
				deleted:item.forecastChain.deleted
				
			});
			this.modelCollection.add(model);
		},this);
	},
    
    search: function(e) {
    	if(e.which == 13) {
    		var searchText = forecastModuleView.allLoopView.$el.find("#search-forecast").val()
    		if( searchText === ""){
    			forecastModuleView.allLoopView.render();
    		}else{   			
    			var pattern = new RegExp(searchText.toString(),'i');
    			var filteredList = forecastModuleView.allLoopView.modelCollection.filter(function(data){
    				var inChainName = pattern.test( data.get('chain').description );
    				var inLeaderName = false, inTeamName = false;
    				
    				var dataLeaders = data.get('leaders')
    				for(var i=0; i<dataLeaders.length; i++){
    					if(pattern.test( dataLeaders[i].firstName + " " + dataLeaders[i].lastName )){
    						inLeaderName = true;	
    					}
    				}
    				
    				var team = data.get('workingUnits')
    				for(var i=0; i<team.length; i++){
    					for(var j=0; j<team[i].workingUnitMembers.length; j++){
    						if(pattern.test( team[i].workingUnitMembers[j].firstName + " " + team[i].workingUnitMembers[j].lastName )){
    							inTeamName = true;
    						}        						
    					}    					
    				}
    				return (inTeamName || inLeaderName || inChainName);	
    			});

    			if(filteredList.length > 0){
    				var coll = new forecastCollection(filteredList);        				
        	    	var tableView = new forecastLoopTableView({collection: coll});
        	    	forecastModuleView.allLoopView.$el.find("#tableContent").html(tableView.render().$el);	
    			}else{
    				forecastModuleView.allLoopView.$el.find("#tableContent").html($(new EJS({url:this.nodataTemplate}).render()));
    			}
    				    	        
    		}    		
		}
    }

});
