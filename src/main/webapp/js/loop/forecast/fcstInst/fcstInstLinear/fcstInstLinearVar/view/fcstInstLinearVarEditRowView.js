var fcInstLinearVarEditRowView = Backbone.View.extend({
	
	template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstLinear/fcstInstLinearVar/template/fcstInstLinearVarEditRow.ejs',

	constructor : function (options) {
		_.extend(this, options);
	},
	
	render: function () {
		this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
		this.$el.find("#saveVar").click(this,this.saveVar);
		this.$el.find("#cancelVar").click(this,this.cancelVar);
		return this;
	},

	saveVar: function(e){

	    var validate = e.data.validateInputs(e.data);
	    if(!validate){
	        return false;
	    }
		var varSaved = JSON.parse(e.data.saveVarService(e));
		var newVariations = 0
		var varList = forecastLinearCollection.getInstance({}).findWhere({idForecastPlanning:e.data.model.get("planningId")}).get("variationsList");
		_.each(varList,function(item,i){
			if(item.id == varSaved.id){
				varList[i].value = varSaved.value;
				varList[i].observation = varSaved.observation;
			}
			newVariations = newVariations + varList[i].value
		});

		forecastLinearCollection.getInstance({}).findWhere({idForecastPlanning:e.data.model.get("planningId")}).set("variationsList",varList);
		
		forecastLinearCollection.getInstance({}).findWhere({idForecastPlanning:e.data.model.get("planningId")}).set("variations",newVariations);
		var suggested = forecastLinearCollection.getInstance({}).findWhere({idForecastPlanning:e.data.model.get("planningId")}).get("suggested");
		forecastLinearCollection.getInstance({}).findWhere({idForecastPlanning:e.data.model.get("planningId")}).set("finalTrade",suggested + newVariations);
		var custom = forecastLinearCollection.getInstance({}).findWhere({idForecastPlanning:e.data.model.get("planningId")}).get("custom");
        if(custom == false){
            forecastLinearCollection.getInstance({}).findWhere({idForecastPlanning:e.data.model.get("planningId")}).set("negociation",suggested + newVariations);
        }
		var tableView = new fcInstLinearVarTableView({planningId:e.data.model.get("planningId"),userId:e.data.userId});
		$('#varTable').html(tableView.render().$el);
		var linearTableView = new forecastInstLinearTableView({instanceId: 0, filters:[], categoryId:$("#catFilter").val(), subCategoryId:$("#subCatFilter").val(), roleId:$("#rolesFilter").val()});
		$('#linearTable').html(linearTableView.render().$el);
		linearTableView.initPagination();
	},

	saveVarService: function(e){
		var varData = {id:e.data.model.id,observation:e.data.$el.find("#observation").val(),value:e.data.$el.find("#value").val()};
		var dataReturned = $.ajax({
			type: 'POST',
			url: '/blueloop/fcstLinearPlan/editVarLinearPlanning/',
			data: JSON.stringify(varData),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			success: function(data, textStatus) {
				data =  data;
			},
			error: function(httpRequest, textStatus, errorThrown) { 
				console.log("status=" + textStatus + " ,error=" + errorThrown);
				toastr.error(json.error.tryAgain);
			}
		});
		return dataReturned.responseText;
	},

	cancelVar: function(e) {
		var tableView = new fcInstLinearVarTableView({planningId:e.data.model.get("planningId"),userId:e.data.userId});
		$('#varTable').html(tableView.render().$el);
	},
	
	validateInputs: function(data){
        var regexNum    = /^(\d|-)?(\d|^,)*\.?\d*$/;
        var regexBlank  = /^\s*$/;
        var value       = data.$el.find("#value").val();
        var observation = data.$el.find("#observation").val();
        
        if(observation == "" || regexBlank.test(observation)){
            toastr.error(json.forecast.linearPlan.validate.emptyObs);
            return false;
        }
        
        if (value.indexOf(',') >= 0) {
            toastr.error(json.forecast.linearPlan.validate.decimalMark);
            return false;
        }else if (!regexNum.test(value)){
            toastr.error(json.forecast.linearPlan.validate.numericValue);
            return false;
        }else if(value == "" || regexBlank.test(value)){
            toastr.error(json.forecast.linearPlan.validate.emptyValue);
            return false;
        }
        
        return true;
    }

});