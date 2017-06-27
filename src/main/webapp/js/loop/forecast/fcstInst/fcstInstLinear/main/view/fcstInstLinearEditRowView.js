var forecastInstLinearEditRowView = Backbone.View.extend({
	
	template: '/blueloop-backend/static/js/loop/forecast/fcstInst/fcstInstLinear/main/template/fcstInstLinearEditRow.ejs',

	render: function () {
		this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
		this.$el.find("#saveLinear").click(this,this.saveLinear);
		this.$el.find("#cancelLinear").click(this,this.cancelLinear);
		return this;
	},

	saveLinear: function(e){
	    var validate = e.data.validateInputs(e.data);
	    if(!validate){
	        return false;
	    }
		var linearSaved = JSON.parse(e.data.saveLinearService(e));
		
		forecastLinearCollection.getInstance({}).findWhere({idForecastPlanning:e.data.model.get("idForecastPlanning")}).set("negociation",linearSaved.negociation);
		forecastLinearCollection.getInstance({}).findWhere({idForecastPlanning:e.data.model.get("idForecastPlanning")}).set("custom",true);
		
		var tableView = new forecastInstLinearTableView({instanceId: 0, filters:[], categoryId:$("#catFilter").val(), subCategoryId:$("#subCatFilter").val(), roleId:$("#rolesFilter").val()});
		$('#linearTable').html(tableView.render().$el);
		tableView.initPagination();
	},

	saveLinearService: function(e){
		var linearData = {instanceId:e.data.model.get("instanceId"),planningId:e.data.model.get("idForecastPlanning"),negociation:e.data.$el.find("#negociation").val()};
		var dataReturned = $.ajax({
			type: 'POST',
			url: '/blueloop-backend/fcstLinearPlan/editLinearPlanning/',
			data: JSON.stringify(linearData),
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

	cancelLinear: function(e) {
		var tableView = new forecastInstLinearTableView({instanceId: 0, filters:[], categoryId:$("#catFilter").val(), subCategoryId:$("#subCatFilter").val(), roleId:$("#rolesFilter").val()});
		$('#linearTable').html(tableView.render().$el);
		tableView.initPagination();
	},
    
    validateInputs: function(data){
        var regexNegative = /^-+(\d|-)?(\d|,)*\.?\d*$/;
        var regexNum      = /^(\d)*\.?\d*$/;
        var regexBlank    = /^\s*$/;
        var value         = data.$el.find("#negociation").val().trim();
        
        if (regexNegative.test(value)){
            toastr.error(json.forecast.linearPlan.validate.negativeValue);
            return false;
        }else if (value.indexOf(',') >= 0) {
            toastr.error(json.forecast.linearPlan.validate.decimalMark);
            return false;
        }else if(!regexNum.test(value)){
            toastr.error(json.forecast.linearPlan.validate.negoNumericValue);
            return false;
        }else if(value == "" || regexBlank.test(value)){
            toastr.error(json.forecast.linearPlan.validate.negoEmptyValue);
            return false;
        }
        
        return true;
    }
	

});