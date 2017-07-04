var forecastWUActTableView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstChain/fcstWUAct/template/fcstWUActTable.ejs',

    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        this.collection = this.model.get("activityCollection");
        if(this.collection.length > 0){
        	this.$el.find('tbody').empty();
        }
        this.collection.each(this.addModel, this);
        this.$el.find("#addActBtn").click(this,this.addAct);
        return this;
    },

    addModel: function(model) {
    	model.set("activityCollection",this.collection);
        var modelView = new forecastWUActRowView( { model: model } );
 		this.$el.find('tbody').append(modelView.render().$el);
    },
    
    addAct: function(e){
    	e.data.$el.find("tbody").find("#no-data-tr").remove();
    	var modelView = new forecastWUActNewRowView( { wuId: e.data.model.id, actCollection:e.data.collection, filePath:e.data.model.get("filePath") } );
    	
    	e.data.$el.find("tbody").append(modelView.render().$el);
    }

});