var forecastLeaderView = Backbone.View.extend({
	template : '/blueloop/static/js/loop/forecast/fcstChain/fcstLeader/template/fcstLeaderModal.ejs',
	usersCollection: null,

	render : function() {
		this.$el = $(new EJS({url:this.template}).render());
		this.setCollections();
		var selectView = new forecastLeaderSelectView({ model: this, collection: this.usersCollection });
		this.setEvents(selectView);
		
		return this;
	},
	
	setEvents: function(view){
		this.$el.find("#selectContent").append(view.render().$el);
		this.$el.find("#selectLeaders").multiSelect('refresh');
	},
	
	setCollections : function() {
		this.usersCollection = new forecastLeaderCollection([]);
		var that = this;
		_.each(that.retrieveUsersLeadersList(), function(item, i) {
			var model = new forecastLeaderModel({
				id : item.id,
				name : item.name,
				selected : item.selected
			});
			that.usersCollection.add(model);
		});
	},

	retrieveUsersLeadersList:function(){
		var dataReturned = $.ajax({
			type : 'GET',
			url : '/blueloop/forecast/getAllUsersAndLeaders/',
			data : {id:this.idForecast},
			contentType : 'application/json; charset=utf-8',
			dataType : 'json',
			async : false,
			success : function(data, textStatus) {
				data = data;
			},
			error : function(httpRequest, textStatus, errorThrown) {
				console.info("status=" + textStatus + " ,error=" + errorThrown);
				toastr.error(json.error.tryAgain);
			}
		});
		return dataReturned.responseJSON;
	},
	
	updateModel : function(data, viewRow) {
		viewRow.model.set("leaders", data)
		viewRow.updateRow();
	}
});