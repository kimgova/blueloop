function EditController() {
	
	var that = this;
	that.filePath = "";
	that.dataCountries = [];
	var bbFormDetailBB, teamsFormDetailBB, idbbFormDetailBB, idteamFormDetailBB;
	var $imgTemplate;
	
	that.init = function() { 
		bindEvents();
    }
	
	function bindEvents() {
		
		$(document).on("change", "#selectAreaCode", function() {
			$("#phoneNumberAreaCode").val($("#selectAreaCode").val());
	    });
		
		$(document).on("click", "#liOperating a", function() {
			if(idteamFormDetailBB != "N"){
				that.setOperatingParameters(bbFormDetailBB,null);
			}else{
				that.setOperatingParameters(bbFormDetailBB,teamsFormDetailBB);
			}
		});
		
		$(document).on("click", "#liTeam a", function() {
			teamworkBBController.getTeamworkBB(bbFormDetailBB);
		});
		$(document).on("click", "#liActivities a", function() {
			inOutActivitiesController.createTableActivities(idbbFormDetailBB);
		});
		$(document).on("click", "#liRisks a", function() {
			riskController.createTableRisks(idbbFormDetailBB);
		});
		$(document).on("click", "#liDaysOff a", function() {
			dayOffController.createTableDayOff(idbbFormDetailBB);
		});
		$(document).on("click", "#liAttach a", function() {
			$('.qq-upload-list').html("");
			attachmentController.createTableAttachFromDropbox(idbbFormDetailBB);
		});
		$(document).on("click", "#liInventory a", function() {		
//			attachmentController.createTableUploadInventory(idbbFormDetailBB);	
			var invView = new inventoryTableView({idBB:idbbFormDetailBB});
			$("#uploadInventory-content").html(invView.render().$el);
		});	
		
		$(document).on("click", ".formula", function(e) {
			e.preventDefault();
			formulaController.setIdField($(this).parent().parent().find("input").attr("id"));
			formulaController.setIdBB(idbbFormDetailBB);
			formulaController.setData();		
			$("#formulaForField").text($(this).parent().parent().parent().find("label").text());
			$("#formulaEditorModal").modal({backdrop: 'static',keyboard: false});
			formulaController.initField($("#tagsexample"));
		});
		
		$(document).on("click", ".removeFormula", function(e) {
			e.preventDefault();
			formulaController.setIdField($(this).parent().parent().find("input").attr("id"));
			formulaController.setIdBB(idbbFormDetailBB);
			formulaController.removeFormula();
		});
		
        $(document).on("click", "#selectFileType", function() {
            $("#modalSelectFile").remove();
        	var model = new fileModel({
                process:PROCESS_STATUS["SUBIDOMANUAL"],
                bb_id: idbbFormDetailBB,
                client_id: 0,
                client_name: ""
            });
        	var fileView = new selectFileView({model:model});
            fileView.render().$el.modal({backdrop: 'static',keyboard: false});
        });
        
        $(document).on("click", "#updateFileMap", function() {
        	$("#modalMap").remove();
        	$("#modalInventory").remove();
        	var mapView = new mapModalView({idBB:idbbFormDetailBB});
        	mapView.render().$el.modal({backdrop: 'static',keyboard: false});
        	mapView.initDatatable();
        });
        
        $(document).on("click", "#showUploadHistory", function() {
        	var fileView = new fileModalView({idBB:idbbFormDetailBB});
            fileView.render().$el.modal({backdrop: 'static',keyboard: false});
        });
        
        $(document).on("click", "#liActFlowBB a", function() {
            var tabPane = new activityFlowTabView({bb_id:idbbFormDetailBB});
            $("#activitiesFlow").html(tabPane.render().$el);
        });
	}
	
	that.openEditForm = function(bb,idTeamwork){
		bbFormDetailBB 	   = bb;
		idbbFormDetailBB   = bb.id;
		idteamFormDetailBB = idTeamwork;
		teamsFormDetailBB = null; 
	
		$("#myModal").modal({backdrop: 'static',keyboard: false});
		setGeneralInfo(bb);
		setStyleProperties(bb.category);
	}
	
	function setStyleProperties(bbType){
		$("#fileNameSelect").attr("value","");
		$("#ulNavTabs").find("li").show();
		$("#ulNavTabs").find("li").removeClass("active");
		$(".tab-content").find(".tab-pane").removeClass("active");
		$("#liGeneral").show();
		$("#liGeneral").addClass("active");
		$("#general").addClass("active");
		if(bbType == "Flow"){
		    $("#ulNavTabs").find("#liActivities").hide();
		    $("#ulNavTabs").find("#liInventory").hide();
		    
		    if(_.isEmpty($("#ulNavTabs").find("#liActFlowBB"))){
		        var liTemp = $(new EJS({url: '/blueloop/static/js/buildingBlock/edit/flowBBActivities/template/li_template.ejs' }).render());
		        $(liTemp).insertBefore($("#ulNavTabs").find("#liDaysOff"));
		        if(_.isEmpty($(".tab-content").find("#activitiesFlow"))){
		            $('<div id="activitiesFlow" class="tab-pane"></div>').insertBefore($(".tab-content").find("#daysOff"));
		            
		        }
		    }
        }
	}
	
	function setGeneralInfo(bb){
		$('#bb-title').html(bb.name);
		$("#static-bb-form").remove();

		bb.edit = true;
		bb.currentLoggedUser = sessionUser.get("id");
		bb.disabled = "";
		var form = $(new EJS({url: '/blueloop/static/js/ejsTemplates/bbGeneralInfoEdition.ejs' }).render(bb));
		$("#general").append(form);
		$('#static-bb-form').find("#saveBB").click(this,that.validateFields);
		
		$('#bb-thumb').attr('src', bb.filePath + bb.fileName);
		
	}
	
	that.setOperatingParameters = function(bb,teamworks){
		$("#dynamic-bb-form").remove();
		var config = JSON.parse(bb.config);
		bb.fields = config;
		bb.disabled = "";
		var form = $(new EJS({url: '/blueloop/static/js/ejsTemplates/bbOperatingParams.ejs' }).render(bb));
		$("#operating").append(form);
		$('#dynamic-bb-form').find("#editDynamicBB").click(this,that.validateDynamicFields);
	}
	
	that.validateFields = function(e){
		$("#static-bb-form").validate({
			debug: true,
		 	rules	: { name: { required: true }	
		 	},
		 	messages: {	name: "Please enter a name"
		 	},
			success: "valid",
			submitHandler: function(form,data) {
				that.onSaveBuildingBlock();
			}
		});		
	}
	
	that.validateDynamicFields = function(e){
		$("#dynamic-bb-form").validate({
			debug: true,
		 	rules	: { name: { required: true }	
		 	},
		 	messages: { name: "Please enter a name"
		 	},
			success: "valid",
			submitHandler: function(form,data) {
				that.editOperatingParams();
			}
		});		
	}
	
	
	that.onSaveBuildingBlock = function(){
		var jsonObject = that.getDataForm($('#static-bb-form'));
		jsonObject.SYNCHRONIZER_TOKEN = $("meta[name='_csrf']").attr('content');
		jsonObject.SYNCHRONIZER_URI   = $("meta[name='_csrf_header']").attr('content');
		
		var result = ajaxCall('GET','/blueloop/buildingBlock/editBuildingBlock/', jsonObject, "text/json", "json", false);
		if(result.error && result.error == 'invalidToken'){
		    window.location.replace("/blueloop/errors/invalidToken");
		}else{
		    toastr.success(json.general.successfullySaved);
		    $("#myModal").modal("hide");
		    setTimeout(function(){window.location.replace("/blueloop/buildingBlock/list")}, 100);
		}
	}

    that.editOperatingParams = function() {
        var jsonObject = that.getDataForm($('#dynamic-bb-form'));
        jsonObject.SYNCHRONIZER_TOKEN = $("meta[name='_csrf']").attr('content');
        jsonObject.SYNCHRONIZER_URI = $("meta[name='_csrf_header']").attr('content');

        var result = ajaxCall('GET', '/blueloop/buildingBlock/editBuildingBlockConfig/', jsonObject, "text/json", "json", false);
        if (result.error && result.error == 'invalidToken') {
            window.location.replace("/blueloop/errors/invalidToken");
        } else {
            toastr.success(json.general.successfullySaved);
            $("#myModal").modal("hide");
        }
    }
	
	that.showImgBBGrid = function(){
		$("#image_chooser_modal").remove();	
    	var modalView = new imageChooserModalView({context:editBBController, imageType:1});
    	modalView.render().$el.modal({backdrop: 'static',keyboard: false});
	}
	
	that.setSelectedImage = function(modelImage){
		$("#bb-thumb").attr("src",modelImage.get("filePath"));
		$("#fileNameSelect").attr("value",modelImage.get("key"));	
	}
	
	function initPagination() {
		$imgTemplate.find("#ulGridImg").css("display", "none");
	    var numEntries = $imgTemplate.find('#ulGridImg li.gridliBbImg').length;
	    
	    $imgTemplate.find("#pagination").pagination(numEntries, {
	        num_edge_entries: 1,
	        num_display_entries: 5,
	        callback: pageSelectCallback,
	        items_per_page: 15
	    });
	}
	
	function pageSelectCallback(pageIndex, jq) {
	    var max_elem = Math.min((pageIndex+1) * 15, $imgTemplate.find('#ulGridImg li.gridliBbImg').length);
		$imgTemplate.find('#display').empty()
		for(var i=pageIndex*15;i<max_elem;i++){
			$imgTemplate.find('#display').append($imgTemplate.find("#ulGridImg li.gridliBbImg:eq("+i+")").clone());
		}
	    return false;
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
	
	return that;
}

$().ready(function() {
	window.editBBController = new EditController();
	editBBController.init();
});