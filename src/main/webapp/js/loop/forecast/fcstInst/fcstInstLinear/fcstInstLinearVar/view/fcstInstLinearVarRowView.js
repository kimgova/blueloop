var fcInstLinearVarRowView = Backbone.View.extend({

	template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstLinear/fcstInstLinearVar/template/fcstInstLinearVarRow.ejs',

	constructor : function (options) {
		_.extend(this, options);
	},
	
	render: function () {
		this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
		this.setEvents();
		return this;
	},

	setEvents: function(){
		var that = this;
		this.$el.find("#editVar").click(this,this.editVar);
		this.$el.find("#deleteVar").click(this,this.deleteVarInDB);
	},
	
	editVar: function(e) {
		var modelView = new fcInstLinearVarEditRowView({model:e.data.model,userId:e.data.userId});
		e.data.$el.html(modelView.render().$el);
	},
	
	deleteVarInDB: function(e) {		
		bootbox.confirm(json.general.deleteRow, function (r) {
			if(r){
				var varData = {id:e.data.model.id};
				var dataReturned = $.ajax({
					type: 'POST',
					url: '/blueloop/fcstLinearPlan/deleteVarLinearPlanning/',
					data: JSON.stringify(varData),
					contentType: 'application/json; charset=utf-8',
					dataType: 'json',
					async: false,
					success: function(data, textStatus) {
						e.data.deleteVar(e,data.text);
					},
					error: function(httpRequest, textStatus, errorThrown) { 
						toastr.error(json.error.tryAgain);
						console.log("status=" + textStatus + " ,error=" + errorThrown);
					}
			 	});
			}
		});
	},
	
	deleteVar: function(e) {
		var varList = forecastLinearCollection.getInstance({}).findWhere({idForecastPlanning:e.data.model.get("planningId")}).get("variationsList");
		var newVariations = 0
		_.each(varList,function(item,i){
			if(item.id == e.data.model.id){
				varList.splice(i,1);
			}else{
				newVariations = newVariations + item.value
			}
		});
		forecastLinearCollection.getInstance({}).findWhere({idForecastPlanning:e.data.model.get("planningId")}).set("variationsList",varList);
		
		forecastLinearCollection.getInstance({}).findWhere({idForecastPlanning:e.data.model.get("planningId")}).set("variations",newVariations);
		var suggested = forecastLinearCollection.getInstance({}).findWhere({idForecastPlanning:e.data.model.get("planningId")}).get("suggested")
		forecastLinearCollection.getInstance({}).findWhere({idForecastPlanning:e.data.model.get("planningId")}).set("finalTrade",suggested + newVariations);
		var custom = forecastLinearCollection.getInstance({}).findWhere({idForecastPlanning:e.data.model.get("planningId")}).get("custom");
		if(custom == false){
		    forecastLinearCollection.getInstance({}).findWhere({idForecastPlanning:e.data.model.get("planningId")}).set("negociation",suggested + newVariations);
		}
		e.data.remove();
		toastr.success(json.general.successfully);
		
		var linearTableView = new forecastInstLinearTableView({instanceId: 0, filters:[], categoryId:$("#catFilter").val(), subCategoryId:$("#subCatFilter").val(), roleId:$("#rolesFilter").val()});		
		$('#linearTable').html(linearTableView.render().$el);
		linearTableView.initPagination();
	}

});