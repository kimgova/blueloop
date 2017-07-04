var headerView = Backbone.View.extend({
	
	el : $('header'),
    initialize: function (){
    	_.bindAll(this, 'render');
		this.render();
		this.setBreadCrumb();
	},
	
    render: function() {
    	var model = new userNavBarModel();
    	 var modelView = new userNavBarView( {model: model} );
         $(this.el).append(modelView.render().$el);
        
        return this;
    },
    
    updateMessagesCount : function(count){
    	if(count==0){
    		this.$el.find('#msg-count').css("visibility", "hidden");
    	}else{
    		this.$el.find('#msg-count').css("visibility", "visible");
    		this.$el.find("#msg-count").text(count);
    	}
    },
    
    updateAlertsCount : function(count){
    	if(count==0){
    		this.$el.find('#alert-count').css("visibility", "hidden");
    	}else{
    		this.$el.find('#alert-count').css("visibility", "visible");
    		this.$el.find("#alert-count").text(count);
    	}
    },
   

        setBreadCrumb : function(bcumbSec) {

        var bcumbSection = "";
        var bcumbSubSec = "";
        var currentPath = location.pathname.substring(18);
        if (currentPath == "") {
            if (sessionUser.get("role") == '[ROLE_SUPERADMIN]') {
                bcumbSection = json.bcumbSection.adminConsole;
            } else {
                bcumbSection = json.bcumbSection.home;
            }
        } else {
            switch (true) {
            case /^user\/profile$/.test(currentPath):
                bcumbSection = json.bcumbSection.people;
                bcumbSubSec  = json.bcumbSection.myProfile;
                break;
            case /teamwork/.test(currentPath):
                bcumbSection = json.bcumbSection.teamworks;
                break;
            case /people/.test(currentPath):
                bcumbSection = json.bcumbSection.people;
                break;
            case /^user\/profileWall\/\d+$/.test(currentPath):
                bcumbSection = json.bcumbSection.people;
                bcumbSubSec  = $('#ws-info-name').text();
                break;
            case /^user\/settings$/.test(currentPath):
                bcumbSection = json.bcumbSection.user;
                bcumbSubSec  = json.bcumbSection.settings;
                break;
            case /^buildingBlock\/create$/.test(currentPath):
                bcumbSection = json.bcumbSection.newBB;
                break;
            case /^buildingBlock\/list$/.test(currentPath):
                bcumbSection = json.bcumbSection.bbs;
                break;
            case /^buildingBlock\/workspace\/\d+$/.test(currentPath):
                bcumbSection = json.bcumbSection.bbs;
                break;
            case /^buildingBlock\/search$/.test(currentPath):
                bcumbSection = json.bcumbSection.community;
                break;
            case /^chain\/create$/.test(currentPath):
                bcumbSection = json.bcumbSection.newLoop;
                break;
            case /^chain\/list/.test(currentPath):
                bcumbSection = json.bcumbSection.loops;
                break;
            case /^chain\/execution\/\d+$/.test(currentPath):
                bcumbSection = json.bcumbSection.execution;
                bcumbSubSec  = $('#nameLoop').val();
                break;
            case /^chain\/edit\/\d+$/.test(currentPath):
                bcumbSection = json.bcumbSection.edit;
                bcumbSubSec = $('#titleChain').text();
                break;
            case /forecast/.test(currentPath):
                bcumbSection = json.bcumbSection.forecast;
                break;
            case /analysis/.test(currentPath):
                bcumbSection = json.bcumbSection.analysis;
                break;
            case /^index\/indexAdmin/.test(currentPath):
                bcumbSection = json.bcumbSection.adminConsole;
                break;
            case /^administrator\/userAccounts/.test(currentPath):
                bcumbSection = json.bcumbSection.adminConsole;
                bcumbSubSec  = json.bcumbSection.users;
            break;
            case /^administrator\/companyProfile/.test(currentPath):
                bcumbSection = json.bcumbSection.adminConsole;
                bcumbSubSec  = json.teamwork.company;
                break;
	        case /^administrator\/billing/.test(currentPath):
	            bcumbSection = json.bcumbSection.billing;
	            break;
	        }
        }

        this.renderBreadCrumb(bcumbSection, bcumbSubSec);
    },
    
    renderBreadCrumb : function(bcumbSection, bcumbSubSec){

    	var model = new headerBreadcrumbModel({
    		   bcrumb : bcumbSection,
    		   bcrumbSubsec : bcumbSubSec
      	});
    	
    	var bcrumbView = new headerBreadcrumbView({model: model} );
        this.$el.find("#bcrumb-container").append(bcrumbView.render().$el);
        
        if(bcumbSubSec!=""){
        	$('#bcrumb-caret').css('visibility', 'visible');
        }
        
    }

});



$().ready(function() {
	window.headView = new headerView();
});