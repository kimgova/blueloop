function CreateController() {
	
	var that = this;
	that.filePath = "";
	that.bbTypePool = {};
	that.dataCountries = [];
	that.objectTemplate = {};
	that.template = "/blueloop-backend/static/js/buildingBlock/view/createView.ejs";
	
	that.init = function() {
		bindEvents();
		that.objectTemplate = {gridLiImg:false,selectImg:false,filePath:"",fileName:""};
		that.dataCountries = ajaxCall('GET','/blueloop-backend/city/getCountries/', null, "text/json", "json", false);
		that.onChangeCategory($("#bbCategory").val());
		that.changeBBForm($("#bbSelect").val());	
		$("#fileNameSelect").attr("value","");

		window.bbTypeController = new BBTypeController();
		bbTypeController.init();
	}

	function bindEvents() {
		$(document).on("click", "#editBBTypes", function() {
			bbTypeController.getTypesBB($("#bbCategory").val())
			$("#editBBTypesModal").modal({backdrop: 'static',keyboard: false});
		});
		
		$(document).on("change", "#bbCategory", function() {
			that.onChangeCategory($(this).val());
			that.changeBBForm($("#bbSelect").val());
		});
		
		$(document).on("change", "#bbSelect", function() {
			$("#fileNameSelect").attr("value","");
			that.changeBBForm($(this).val());
		});
		
		$(document).on("change", "#selectAreaCode", function() {
			$("#phoneNumberAreaCode").val($("#selectAreaCode").val());
	    });
		
		$(document).on("click", "#selectImage", function() {
			that.showImgBBGrid();
		});	
		
	}

	//Function to retrieve Type BBs
	that.onChangeCategory = function(category){
		$("#bbSelect").empty();
		var jsonObject = new Object();
		jsonObject.category = category;
		var data = ajaxCall('GET','/blueloop-backend/buildingBlockType/getAllBBTypeByCategory/', jsonObject, "text/json", "json", false); 
		that.filePath = data.filePath;
		$.each(data.listBBType, function(i, item){
			that.bbTypePool[item.id] = item;
			$("#bbSelect").append($('<option></option>').attr("value", item.id).text(item.name));
	    });
	}
	
	//Function to load BB Form
	that.changeBBForm = function(type){
		if(type != null){
			withDataForm();

			var bb = {id:"",name:"",description:"",companyName:"",phoneNumber:"",emailAddress:"",type:type,category:"",
					edit:false,countries:that.dataCountries.countries,fileName:"",phoneNumberAreaCode:"",disabled:""};

			var form = $(new EJS({url: '/blueloop-backend/static/js/ejsTemplates/bbGeneralInfoCreation.ejs' }).render(bb));
			
			bindFormEvents(form);
			
			if(type == ""){
				$('#bb-thumb').attr('src', '/blueloop-backend/images/Expand.png');
			}else{
				$('#bb-thumb').attr('src', that.filePath + that.bbTypePool[type].fileName);
			}
			
			if(that.dataCountries.defaultCountry != null){
				$('#static-bb-form').find('input#phoneNumberAreaCode').val(that.dataCountries.defaultCountry.areaCode);
			}
		}else{
			noDataForm();
		}
	}
	
	function bindFormEvents(form){
		$('#static-bb-form').remove();
		$('.form-body').append(form);
		$('#static-bb-form').find(':input').val("");
		$('#static-bb-form').find("#saveBB").click(this,that.validateFields);
	}
	
	that.onSaveBuildingBlock = function(){

		var jsonObject = that.getDataForm($('#static-bb-form'));	
		
		jsonObject['type'] = $('#bbSelect').val();
		
		var bb = ajaxCall('GET','/blueloop-backend/buildingBlock/saveBuildingBlock/', jsonObject, "text/json", "json", false);
		if ( bb[0] ){
			toastr.error(json.bb.notSaved)
			$.each(bb, function(index, error) {
				if ( error.code == "nullable"){
					toastr.error(json.general.fielRequired +": "+error.field);
				}
			});
		}else{
			toastr.success(json.bb.saved);
			setTimeout(function(){window.location.replace("/blueloop-backend/buildingBlock/list")}, 2000);
		}	
	}
	
	that.validateFields = function(e){
		$("#static-bb-form").validate({
			debug: true,
		 	rules: {
		 		name: {
		 			required: true
			 	}	
		 	},
		 	messages:{
		 		name: "Please enter a name"
		 	},
			success: "valid",
			submitHandler: function(form,data) {
				that.onSaveBuildingBlock();
			}
		});
		
	}
	
	// Check If exists another function like that... TODO
	that.getDataForm = function(form){
		var o = {};	
		$.each(form.find('input'), function() {
			var input = $(this);
	        if (o[input.attr('name')] !== undefined) {
	            if (!o[input.attr('name')].push) {
	                o[input.attr('name')] = [o[input.attr('name')]];
	            }
	            o[input.attr('name')].push(input.val() || '');
	        } else {
	            o[input.attr('name')] = input.val() || '';
	        }
	    });
		
		$.each(form.find('select'), function() {
			var input = $(this);
	        if (o[input.attr('name')] !== undefined) {
	            if (!o[input.attr('name')].push) {
	                o[input.attr('name')] = [o[input.attr('name')]];
	            }
	            o[input.attr('name')].push(input.val() || '');
	        } else {
	            o[input.attr('name')] = input.val() || '';
	        }
	    });
		
		return o;
	}
	
	//Function to show no data message in building block form
	function noDataForm(){
		$('.thumb').hide();
		$('#static-bb-form').hide();
		$('#no-data-msg').show("slow");
	}
	
	function withDataForm(){
		$('#no-data-msg').hide("slow");
		$('.thumb').show("slow");
		$('#static-bb-form').show("slow");
	}
	
	that.showImgBBGrid = function(){		
		$("#image_chooser_modal").remove();	
    	var modalView = new imageChooserModalView({context:createBBController, imageType:1});
    	modalView.render().$el.modal({backdrop: 'static',keyboard: false});
	}
	
	that.setSelectedImage = function(modelImage){
		$("#bb-thumb").attr("src",modelImage.get("filePath"));
		$("#fileNameSelect").attr("value",modelImage.get("key"));	
	}
	
	return that;
}

$().ready(function() {
	window.createBBController = new CreateController();
	createBBController.init();
});