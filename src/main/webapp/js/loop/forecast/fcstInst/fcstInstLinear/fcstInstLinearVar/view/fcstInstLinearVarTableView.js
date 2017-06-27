var fcInstLinearVarTableView = Backbone.View.extend({

	template: '/blueloop-backend/static/js/loop/forecast/fcstInst/fcstInstLinear/fcstInstLinearVar/template/fcstInstLinearVarTable.ejs',

	constructor : function (options) {
		_.extend(this, options);
	},

	render: function() {
		this.$el = $(new EJS({url: this.template }).render());
		this.getLinearVarCollection();
		if(this.collection.length > 0){
			this.$el.find('tbody').empty();
		}
		this.collection.each(this.addModel, this);
		return this;
	},

	getLinearVarCollection: function(){
		this.collection = new fcLinearVarCollection();
		_.each(this.retrieveLinearVarCollection(),function(item,i){
			var disabled = "disabled";
			if(item.user.id == this.userId){
				disabled = "";
			}
			var model = new fcLinearVarModel({
				id:item.id,
				date:item.date,
				observation:item.observation,
				value:item.value,
				user:item.user,
				planningId:this.planningId,
				disabled:disabled
			});
			this.collection.add(model);
		},this);
	},

	retrieveLinearVarCollection: function(){
		var planning = forecastLinearCollection.getInstance({}).findWhere({idForecastPlanning:this.planningId})
		return planning.get("variationsList")
	},

	addModel: function(model) {
		var modelView = new fcInstLinearVarRowView( { model: model,userId:this.userId } );
		this.$el.find('tbody').append(modelView.render().$el);
	}

});