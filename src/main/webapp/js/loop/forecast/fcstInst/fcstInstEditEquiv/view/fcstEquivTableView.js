var forecastEquivTableView = Backbone.View.extend({

	template: '/blueloop-backend/static/js/loop/forecast/fcstInst/fcstInstEditEquiv/template/fcstEquivTable.ejs',

	constructor : function (options) {
		_.extend(this, options);
	},

	render: function() {
		this.getEquivCollection();
		this.$el = $(new EJS({url: this.template }).render({headers:this.headerCollection.models}));
		if(this.collection.length > 0){
			this.$el.find('tbody').empty();
		}
		this.collection.each(this.addModel, this);
		
		return this;
	},

	getEquivCollection: function(){
		if(this.forecastId != 0){
			this.collection = forecastEquivCollection.getInstance({clean:true});
			this.headerCollection = forecastHeaderEquivCollection.getInstance({clean:true});
			var result = this.retrieveEquivalenceList();
			_.each(result[1],function(item,i){
				var model = new forecastSKUEquivModel({
					id: item.id,
					identifier: item.identifier,
					description: item.description,
					equivList: item.equivalences
				});
				this.collection.add(model);
			},this);
			_.each(result[0],function(item,i){
				var model = new forecastHeaderEquivModel({
					name: item.name
				});
				this.headerCollection.add(model);
			},this);
		}else{
			this.collection = forecastEquivCollection.getInstance({});
			this.headerCollection = forecastHeaderEquivCollection.getInstance({});
		}
	},

	retrieveEquivalenceList: function(){
		var dataReturned = $.ajax({
			type: 'GET',
			url: '/blueloop-backend/fcstSku/getEquivalences/',
			data: {id:this.forecastId},
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			success: function(data, textStatus) {
				data = data;
			},
			error: function(httpRequest, textStatus, errorThrown) { 
				console.log("status=" + textStatus + " ,error=" + errorThrown);
				toastr.error(json.error.tryAgain);
			}
		});
		return dataReturned.responseJSON;
	},

	addModel: function(model) {
		var modelView = new forecastEquivRowView( { model: model } );
		this.$el.find('tbody').append(modelView.render().$el);
	},
	
	initPagination: function(){
		this.$el.find("tbody#all").css("display", "none");
		var numEntries = this.collection.length
		this.$el.find("#pagination").pagination(numEntries, {
	        num_edge_entries: 1,
	        num_display_entries: 5,
	        callback: this.pageSelectCallback,
	        items_per_page: 30
	    });
	},
	
	pageSelectCallback: function(pageIndex, jq){
		var max_elem = Math.min((pageIndex+1) * 30, $(jq.prevObject[0]).find('tbody#all tr').length);
		$(jq.prevObject[0]).find('#display').empty()
		for(var i=pageIndex*30;i<max_elem;i++){
			$(jq.prevObject[0]).find('#display').append($(jq.prevObject[0]).find("tbody#all tr:eq("+i+")").clone(true,true));
		}
		return false;
	}

});