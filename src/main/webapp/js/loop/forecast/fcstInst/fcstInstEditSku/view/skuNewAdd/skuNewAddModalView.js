var skuNewAddModalView = Backbone.View.extend({
	template : '/blueloop/static/js/loop/forecast/fcstInst/fcstInstEditSku/template/skuNewAdd/skuNewAddModal.ejs',
	
	skuCollection: null,
	promotion:null,
	skuAssoCollection: null,
	
	render : function() {
		this.$el = $(new EJS({url:this.template}).render({model: this, description:"", unit:""}));
		if(this.callFrom == "modifySkuAsso"){
			this.chargeSkuDataModel(this.skuModel,this);
			this.setEventsMod();
		}else{
			this.setEvents();
		}
		
		
		return this;
	},
	
	setEvents: function(view){
		this.$el.find("#saveNewSku").click(this,this.validateFields);
		this.$el.find("#btnConsult").click(this,this.consultSku);		
	},
	
	setEventsMod: function(view){
		this.$el.find("#saveNewSku").click(this,this.modifySkuAsso);
	},

	consultSku : function(e) {
		var el = e.data.$el;
		var validate = e.data.validateSku(e.data);
		if(validate){
			e.data.skuCollection = new forecastSkuCollection([]);
			var sku = e.data.retrieveSku(e.data.$el.find("#skuCode").val(),e.data.fcInstanceId);
			if(sku.error){
				e.data.promotion = "";
				var model = new forecastSkuModel({});
				e.data.skuNotFound(model,e);
				e.data.setICheckEvents(e.data);
				e.data.chargeTableAsso(e.data, model);
				return
			}else{
				e.data.chargeSkuData(sku[0],e.data);
			}
		}

	},
	
	retrieveSku : function(id,fcInstanceId ){
		var jsonObj = {id:id,fcInstanceId:fcInstanceId};
		var dataReturned = $.ajax({
			type : 'POST',
			url : '/blueloop/fcstSku/consultSku/',
			data : JSON.stringify(jsonObj),
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
	
	getDefaultUnit : function(fcInstanceId ){
		var jsonObj = {fcInstanceId:fcInstanceId};
		var dataReturned = $.ajax({
			type : 'POST',
			url : '/blueloop/fcstSku/getDefaultSkuUnit/',
			data : JSON.stringify(jsonObj),
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
	
	skuNotFound : function(model,e){
		model.attributes.disabled = "";
		var selectView = new skuNewAddFamilyView({model:model, skuCollection:null});
		e.data.$el.find("#familyBrand").html(selectView.render().$el);
		e.data.$el.find("#skuDes").val("");	
		e.data.$el.find("#skuDes").attr("disabled",false);
		var defaultUnit = e.data.getDefaultUnit(e.data.fcInstanceId);

		e.data.$el.find("#skuUnit").val(defaultUnit.name);
		e.data.$el.find("#idUnit").val(defaultUnit.id);
		e.data.$el.find("#skuUnit").attr("disabled",true);
	},
	
	validateFields:function(e){
		var that = e;
		$(e.data.$el).find("form").validate({
			debug: true,
		 	rules: {
		 		skuDes: {
		 			required: true
			 	}	
		 	},
			success: "valid",
			submitHandler: function(form,data) {
				that.data.saveNewSku(that);
			}
		});
		
	},
	
	saveNewSku : function(e) {

		var validate = e.data.validateSku(e.data);
		if(!validate){
			return
		}

		var jsonObj = {fcInstanceId:e.data.fcInstanceId};
		if(e.data.skuCollection.length > 0){
			var sku = e.data.skuCollection.first().attributes;
			sku.promotion = e.data.promotion;
			sku.family = e.data.$el.find("#familySku").val();
			sku.brand = e.data.$el.find("#brandSku").val();
			sku.skuAssociateList = e.data.skuAssoCollection.toJSON();
			jsonObj.sku = sku;
		}else{
			var sku = {};
			sku.description = e.data.$el.find("#skuDes").val();
			sku.family = e.data.$el.find("#familySku").val();
			sku.brand = e.data.$el.find("#brandSku").val();
			sku.identifier = e.data.$el.find("#skuCode").val();
			sku.promotion = e.data.promotion;
			sku.status = 'new';
			sku.type = e.data.$el.find("#typeSku").val();
			sku.unit = e.data.$el.find("#idUnit").val();
			sku.skuAssociateList = e.data.skuAssoCollection.toJSON();
			jsonObj.sku = sku;
		}
		var result = e.data.saveSku(jsonObj);
		if(result[0].id){
			var model = forecastSkuCollection.getInstance({}).add(result[0]);
			var modelView = new forecastInstSkuRowView( { model: model } );
			var row = modelView.render().$el;
			e.data.setEventsRow(e.data.skuView,row);
			toastr.success(json.general.successfullySaved);
			$("#newSkuModal").remove();
		}else{
			toastr.error(json.error.tryAgain);
		}
	},
	
	saveSku: function(jsonObj) {
		var dataReturned = $.ajax({
			type : 'POST',
			url : '/blueloop/fcstSku/saveNewSku/',
			data : JSON.stringify(jsonObj),
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
	
	setICheckEvents : function(e) {
		var that = e;
		$("#familyBrand input:checkbox").on('ifChecked', function(e){
			that.promotion = 'checked';
		});
		$("#familyBrand input:checkbox").on('ifUnchecked', function(e){
			that.promotion = "";
		});
	},
	
	setEventsRow: function(view,row){
		$(row.find("input:checkbox")).iCheck({
			checkboxClass: 'icheckbox_square-blue',
			radioClass: 'iradio_square-blue',
			increaseArea: '20%' 
		});
		
		$(row.find("input:checkbox")).on('ifChecked', function(e){
			view.data.changeCheckboxStatus(e, view.data, "tbodySku","addClass", 'P');
		});
		$(row.find("input:checkbox")).on('ifUnchecked', function(e){
			view.data.changeCheckboxStatus(e, view.data, "tbodySku","removeClass",null);
		});

		
		$("#display").append(row);
		var clone = row.clone(true,true);
		clone.appendTo("#tbodySku");
	},
	
	chargeTableAsso : function(data,model){
		var tableView = new skuNewAddAssoTableView({ model: model, view:data});
		var render = tableView.render();
		data.$el.find("#associateTable").html(render.$el);
		data.skuAssoCollection = render.collection;
	},
	
	validateSku : function(data){
		var skuExists = forecastSkuCollection.getInstance({}).where({identifier: data.$el.find("#skuCode").val()});
		if(data.$el.find("#skuCode").val() == "" || /\s/.test(data.$el.find("#skuCode").val())){
			toastr.error(json.forecast.skuPlanning.codeNull);
			return false
		}else if(skuExists.length > 0){
			toastr.error(json.forecast.skuPlanning.skuExists);
			return false
		}	
		return true
	},
	
	chargeSkuData : function(sku,data){
		var model = new forecastSkuModel({
			id:sku.id,
			identifier:sku.identifier,
			description:sku.description,
			type:sku.type,
			brand:sku.brand,
			family:sku.family, 
			promotion:sku.promotion,
			skuChain:sku.skuChain,
			status:sku.status,
			disabled:'disabled',
			unit:sku.unit,
			skuAssociateList:sku.skuAssociateList
		});
		
		data.skuCollection.add(model);
		data.promotion = sku.promotion;
		
		var selectView = new skuNewAddFamilyView({ model: model, skuCollection: data.skuCollection});
		
		data.$el.find("#familyBrand").html(selectView.render().$el);
		data.$el.find("#skuDes").val(model.attributes.description);
		data.$el.find("#skuUnit").val(model.attributes.unit);
		
		data.setICheckEvents(data);
		
		data.chargeTableAsso(data, model);
	},

	chargeSkuDataModel : function(model,data){

		data.skuCollection = new forecastSkuCollection([]);
		model.attributes.disabled = 'disabled';
		data.skuCollection.add(model);
		data.promotion = model.attributes.promotion;
		var selectView = new skuNewAddFamilyView({ model: model, skuCollection: data.skuCollection});
		
		data.$el.find("#familyBrand").html(selectView.render().$el);
		data.$el.find("#skuDes").val(model.attributes.description);
		data.$el.find("#skuUnit").val(data.getDefaultUnit(data.fcInstanceId).name);
		data.$el.find("#skuCode").val(model.attributes.identifier);
		data.$el.find("#skuCode").attr("disabled",true);
		data.$el.find("#btnConsult").parent().remove();
		data.$el.find("input:checkbox").attr("disabled",true);
		
		data.chargeTableAsso(data, model);
	},

	modifySkuAsso: function(e){
		var jsonObj = {fcInstanceId:e.data.fcInstanceId,skuChain:e.data.skuChain};

		if(e.data.skuCollection.length > 0){
			var sku = e.data.skuCollection.first();
			sku.set("promotion", e.data.promotion)
			sku.set("brand", e.data.$el.find("#brandSku").val())
			sku.set("skuAssociateList",e.data.skuAssoCollection.toJSON())
			sku.set("asso",'modifySkuAsso')
			jsonObj.sku = sku;
		}else{
			toastr.error(json.error.tryAgain);
			return;
		}

		var result = e.data.saveSku(jsonObj);
		if(result.id){
			var model = forecastSkuCollection.getInstance({}).get( e.data.skuCollection.first());
			model.set({skuAssociateList: e.data.skuAssoCollection.toJSON()})
			toastr.success("Saved");
			$("#newSkuModal").remove();
		}else{
			toastr.error(json.error.tryAgain);
		}
	}
	
});