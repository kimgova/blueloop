var fcstInst3SEditRowView = Backbone.View.extend({
	
	template: '/blueloop-backend/static/js/loop/forecast/fcstInst/fcstInstEdit3S/template/fcstInst3SEditRow.ejs',

	render: function () {
		this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
		this.$el.find(".save3s").click(this,this.save3s);
		this.$el.find(".cancel3s").click(this,this.cancel3s);
		return this;
	},

	save3s: function(e){
		if(e.data.validate(e.data.$el.find("input").val())){
			var threeSaved = JSON.parse(e.data.save3sService(e));
			fcstInst3SCollection.getInstance({}).findWhere({idSkuChain:e.data.model.get("idSkuChain")}).set("fcstExport",threeSaved.finalExport);
			var tableView = new fcstInst3STableView({ instanceId: 0, roleId: 0, fromEdit: true});
	    	$('#3sTable').html(tableView.render().$el);
	    	tableView.initPagination();
		}		
	},

	save3sService: function(e){
		var threeData = {idSkuChain:e.data.model.get("idSkuChain"),fcstExport:e.data.$el.find("input").val(),instanceId:e.data.model.get("instanceId"),roleId:e.data.model.get("roleId")};
		var dataReturned = $.ajax({
			type: 'POST',
			url: '/blueloop-backend/fcst3S/edit3sData/',
			data: JSON.stringify(threeData),
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
	
	validate: function(finalExportValue){
		var valid = true;
		if(!/^([0-9])*[.]?[0-9]*$/.test(finalExportValue.trim())){ //positive number o positive decimal number
			toastr.error(json.error.errorNumericFinalExport);
			valid = false; 
		}
		if(finalExportValue.trim() == "" || /^\s*$/.test(finalExportValue)){
			toastr.error(json.error.errorEmptyFinalExport);
			valid = false;
		}
		return valid;
	},


	cancel3s: function(e) {
		var rowView = new fcstInst3SRowView( { model: e.data.model } );
    	e.data.$el.parent().after(rowView.render().$el);
    	e.data.remove();
	}

});