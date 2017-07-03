function TeamworkBBController(){

	var tableMember;
	var idTeamSelect;
	var idBB;
	var listMembers = [];
	var that = this;
	that.objectTemplate = {};
	that.template = "/blueloop/static/js/buildingBlock/view/teamworkBBView.ejs";
	
	that.init = function() {
		that.objectTemplate = {checkTemplate:false,thumbsTeamList:false,memberList:false,multiSelect:false,optionSelect:false,teamSelect:false,
							   btnDelete:false,rbid:"",idCategory:"",checked:"",disabled:"",name:"",filePath:"",fileName:"",id:"",idTeam:"",description:""};
		bindEvents();
	}
	
	function bindEvents() {		
		$(document).on("click", "#closeEditTeamMember", function() { // Into _editTeamMember.gsp
			$("#myModal").modal("show");
		});
		
		$(document).on("click", "#closeHeaderEditTeamMember", function() { // Into _editTeamMember.gsp
			$("#myModal").modal("show");
		});
		
	}	
	
	that.getTeamworkBB = function(bbInstance){
		idTeamSelect = null;
		if(bbInstance.teamwork){
			idTeamSelect = bbInstance.teamwork.id;
			idBB = bbInstance.id;
		}		
		var tableView = new teamworkTableView({});
		tableView.team_id = bbInstance.teamwork.id;
		tableView.bb_id   = bbInstance.id;
		tableView.bb_category = bbInstance.category;
        $("#teamWorkList").html(tableView.render().$el);
	}
	
	that.getEditPermissions = function(idBB){
		var jsonObject  	  = new Object();
		jsonObject.idBB = idBB;		
		var data = ajaxCall('GET','/blueloop/teamwork/getEditPermissions/', jsonObject, "text/json", "json", false);		
		return data
	}
	
	function cloneDataForm(actProperty, values) {
		var cloneObject = _.clone(that.objectTemplate);
		_.each(values,function(val,property){
			cloneObject[property] = val;
		});		
		_.each(actProperty,function(act,i){
				cloneObject[act] = true;	
		});		
		return cloneObject;
	}
	
	return that;
}

$().ready(function() {
	window.teamworkBBController = new TeamworkBBController();
	teamworkBBController.init();
});