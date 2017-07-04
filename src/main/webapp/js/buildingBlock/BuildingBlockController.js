function BuildingBlockController() {	
	var that = this;	
	that.bbElementTemplate = "/blueloop/static/js/buildingBlock/view/BBListElementView.ejs";
	
	that.init = function() {
		json = JSON.parse(localStorage.getItem('jsLanguage'));
		bindEvents();
		setStyle();	
    }
	
	function bindEvents(){
	    $('#chkfiltro').selectpicker();
	    $(document).on("change", "#chkfiltro", function() {
            var searchWord = $.trim($("#search-mybb").val());
            var chkfiltro  = $("#chkfiltro").val();
            var e;
            setTimeout(searchBBByCategory(e,searchWord,chkfiltro), 7000);
        });
		
		$('#search-mybb').keyup(function(e) {
			if (e.which == 13 || e.keyCode == 13) {
				searchMyBB(e);
			}
		});
		
		$(document).on("click", ".btnDataBB", function() {
			var idBB = $(this).parent().find("#idBB").val();
			that.openEditFormTest(idBB);
		});
		
		$(document).on("click", ".btnDataBBTeam", function() {
			var idBB = $(this).parent().find("#idBB").val();
			that.openEditFormTeam(idBB);
		});
		
		$(document).on("click", ".btnDeleteBB", function() {
			deleteBB($(this).parent().find("#idBB").val(), $(this).parent().find('#inLoop').val());
		});
		
		$(document).on("click", "#selectImage", function() {
			editBBController.showImgBBGrid();
		});
	}
	
	function setStyle(){
		$("#fileNameSelect").attr("value","");
		$('.qq-upload-button').attr("class","btn btn-primary");
		$('#selectImageEdit').attr("class","btn btn-primary");
		$('.qq-upload-drop-area').remove();

		$("#btnFileSystemChooser .qq-uploader > div").removeClass("btn-primary");
		$("#btnFileSystemChooser .qq-uploader > div").addClass("dropbox-dropin-btn");
		
		var btnLoad = new EJS({url: '/blueloop/static/js/ejsTemplates/btnsUploaders.ejs'}).render({type:"faUpload"});
		$("#btnFileSystemChooser .qq-uploader > div").append(btnLoad);
		$("#btnFileSystemChooser2 .qq-uploader > div").append(btnLoad);
	}

	that.openEditFormTest = function(idBB){
		var bb = getBuildingBlockTest(idBB);
		editBBController.openEditForm(bb,"N");
	}
	
	that.openEditFormTeam = function(idBB){	
		var bb = getBuildingBlockTest(idBB);
		editBBController.openEditForm(bb);		
		loadTabs(idBB);
	}
	
	function getBuildingBlockTest(idBB){
		var jsonObject = new Object();
		jsonObject.id = idBB;
		var data = ajaxCall('GET','/blueloop/buildingBlock/getBuildingBlock/', jsonObject, "text/json", "json", false);
		var bb = data.bb;
		bb.config 	= data.config;
		bb.filePath = data.filePath;
		bb.creator.name = data.creator;
		bb.owner.name 	= data.owner;
		bb.community	= data.community;
		bb.countries	= data.countries;
		bb.defCountry	= data.defaultCountry;
		return bb;
	}
	
	function loadTabs(idBB){
		var bb 			= getBuildingBlockTest(idBB);
		var permissions = teamworkBBController.getEditPermissions(idBB);
		$("#ulNavTabs").find("li").hide();
		$("#liGeneral").show();
		$("#liGeneral").addClass("active");
		$("#general").addClass("active");	
		$.each(permissions, function(i, value){
			switch (permissions[i].id) {
    			case 2:	
    			    $("#liOperating").show();
    			    break;
    			case 3:	
    			    $("#liTeam").show();
    			    break;
				case 4:
					$("#liRisks").show();
					break;
				case 5:
				    if(bb.category == "Flow"){
				        $("#liActFlowBB").show();
				    }else{
				        $("#liActivities").show();
				    }
					break;
				case 6:
					$("#liDaysOff").show();
					break;
				case 7:
			        $("#liAttach").show();
			        break;
				case 8:	
			        $("#liInventory").show();
			        break;
				default:
					console.info("default: " + permissions[i].name);
					break;
			}
		});	
	}
	
	function deleteBB(idBB, inLoop){
		bootbox.confirm(json.bb.confirmArchive, function (e) {
			if ( inLoop == "true" || !e ){
				if (e){
					toastr.error(json.bb.myBBAssociatedWithLoop);
				}
				return;
			}
			var o = new Object();
			o.id = idBB;			
			ajaxCall('GET','/blueloop/buildingBlock/deleteBuildingBlock/', o, "text/json", "json", false);
			toastr.success(json.bb.archived);
			setTimeout(function(){window.location.replace("/blueloop/buildingBlock/list")}, 1000);
		});
	}
	
	function setPaginationTest(){
		$("#holderBB").jPages({
	        containerID  : "ulThumbsList",
	        perPage      : 12,
	        startPage    : 1,
	        startRange   : 1,
	        midRange     : 5,
	        endRange     : 1
	    });
	}
	
	function setGalleryTest(){	
		$("#gallery").html($("#ulThumbsList").find('li').eq(0).html());	
		$("#ulThumbsList").find('li').eq(0).addClass("displayed");		
		$("#ulThumbsList li").click(function(e){  		
			$("#gallery").fadeTo("fast", 0.6);
			$("#gallery").html($(this).html());
			$("#gallery").fadeTo("fast", 1);
			$("#ulThumbsList").find('li').removeClass("displayed");	
			$(this).addClass("displayed");
		});    
	}
	
	function setDatePickerTest(){
	  $('.default-date-picker').datepicker({
	      format: 'dd/mm/yyyy'
	  });
	}	
}

$().ready(function() {
	window.bbController = new BuildingBlockController();
	bbController.init();
});