function CommunityBBController() {
	
	var that = this;
	
	that.init = function() {
		json = JSON.parse(localStorage.getItem('jsLanguage'));
		bindEvents();
		searchBB();
    }
	
	function bindEvents() {
		
		$('#search-bb').keyup(function(e) {
			searchBB();
		});
		
		$(document).on("click", ".btn-more", function() {
			moreInfoBB(this);
		});

	}
	
	function searchBB(){
		var jsonObject = new Object();
		jsonObject.searchWord = $("#search-bb").val();
		var data = ajaxCall('GET','/blueloop/buildingBlock/searchBBToBeShared/', jsonObject, "text/json", "json", false);
		renderCommunityBB(data);
	}
	
	function moreInfoBB(context){
		$("#info-dialog").find('.id_bb').val($(context).parent().find('.id_bb').val());
		$( "#info-dialog" ).modal( "show" );
		setInfoModal();	
	}
	
	function renderCommunityBB(data){
		$("#carousel-container").append(new EJS({url: '/blueloop/static/js/buildingBlock/view/BBCommunityView.ejs' }).render({listBB:data.listBB,filePath:data.filePath,size:data.listBB.length}))
		$('#mycarousel').elastislide({
			imageW : 240, margin : 20, border : 10,	minItems : 1
		});
	}
	
	function setInfoModal(){
		$("#info-dialog").find("#info-content").children().remove();
		
		var o	  = new Object();
		o.id	  = $("#info-dialog").find('.id_bb').val();
		var data  = ajaxCall('GET','/blueloop/buildingBlock/getBuildingBlock/', o, "text/json", "json", false);
		var bb = data.bb;
		bb.config = JSON.stringify(data.bb.config);
		bb.disabled = "disabled";
		bb.countries = [];
		bb.edit = false;
		var form = $(new EJS({url: '/blueloop/static/js/ejsTemplates/bbGeneralInfo.ejs' }).render(bb));
		$("#info-dialog").find("#info-content").append(form);	
		$("#info-content").find("#saveBB").css({"display":"none"});
	}
	
}

$().ready(function() {
	window.communityBBController = new CommunityBBController();
	communityBBController.init();
});