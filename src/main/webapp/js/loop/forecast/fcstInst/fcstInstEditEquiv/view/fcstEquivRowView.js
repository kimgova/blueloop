var forecastEquivRowView = Backbone.View.extend({

	template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstEditEquiv/template/fcstEquivRow.ejs',
	editableInputTemplate: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstEditEquiv/template/fcstEquivEditRow.ejs',

	render: function () {
		this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
		this.$el.find(".editEquiv").click(this,this.editEquiv);
		return this;
	},
	
	editEquiv: function(e) {
		var idEquivalence = $(e.target).parent().parent().find(".fcstEquivContainer").attr("id");
		var previousValue = $(e.target).parent().parent().find(".fcstEquivContainer").html();
		var divContainer = $(e.target).parent().parent();
		divContainer.html($(new EJS({url: e.data.editableInputTemplate }).render({editableRow:true,idEquiv:idEquivalence,valueEquiv:previousValue,previousValue:previousValue})));
		
		divContainer.find(".saveEquiv").click(e.data,e.data.saveEquiv);
		divContainer.find(".cancelEquiv").click(e.data,e.data.cancelEquiv);
		
	},
	
	saveEquiv: function(e) {
		var idEquivalence = $(e.target).parent().find("#idSkuEquivalence").val();
		var valueEquivalence = $(e.target).parent().find("#valueSkuEquivalence").val();

		if(e.data.validate(valueEquivalence)){
			var equivSaved = JSON.parse(e.data.saveEquivService(idEquivalence,valueEquivalence));
			
			//update data collections
			var equivList = forecastEquivCollection.getInstance({}).findWhere({id:e.data.model.id}).get("equivList");
			$.each(equivList, function(i, equiv){
				if(equiv.id == idEquivalence){
					equiv.factor = equivSaved.factor;
				}
			});
			forecastEquivCollection.getInstance({}).findWhere({id:e.data.model.id}).set({"equivList":equivList});
			
			//update hidden pagination table 
			$('tbody#all').find('.fcstEquivContainer#'+ idEquivalence).html(valueEquivalence);
			
			//update td content on table
			var divContainer = $(e.target).parent().parent().parent().parent(); 
			divContainer.html($(new EJS({url: e.data.editableInputTemplate }).render({editableRow:false,idEquiv:idEquivalence,valueEquiv:valueEquivalence})));		
			divContainer.find(".editEquiv").click(e.data,e.data.editEquiv);	
		}		
	},

	validate: function(valueEquivalence){
		var valid = true;
		if(!/^([0-9])*[.]?[0-9]*$/.test(valueEquivalence.trim())){ //positive number or positive decimal number
			toastr.error(json.error.errorNumericEquiv);
			valid = false; 
		}
		if(valueEquivalence.trim() == "" || /^\s*$/.test(valueEquivalence)){
			toastr.error(json.error.errorEmptyEquiv);
			valid = false;
		}
		return valid;
	},

	saveEquivService: function(idEquivalence,valueEquivalence){
		var equivData = {id:idEquivalence,factor:valueEquivalence};
		var dataReturned = $.ajax({
			type: 'POST',
			url: '/blueloop/fcstSku/editForecastSKUEquiv/',
			data: JSON.stringify(equivData),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			success: function(data, textStatus) {
				data =  data;
				toastr.success(json.forecast.fcstInstEquivEdited);
			},
			error: function(httpRequest, textStatus, errorThrown) { 
				console.log("status=" + textStatus + " ,error=" + errorThrown);
				toastr.error(json.error.tryAgain);
			}
		});
		return dataReturned.responseText;
	},
	
	cancelEquiv: function(e) {
		var idEquivalence = $(e.target).parent().find("#idSkuEquivalence").val();
		var valueEquivalence = $(e.target).parent().find("#previousValue").val();
		var divContainer = $(e.target).parent().parent().parent().parent();
		divContainer.html($(new EJS({url: e.data.editableInputTemplate }).render({editableRow:false,idEquiv:idEquivalence,valueEquiv:valueEquivalence})));		
		divContainer.find(".editEquiv").click(e.data,e.data.editEquiv);		
	}


});
