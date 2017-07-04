var teamworkSubRowView = Backbone.View.extend({
    
    template: '/blueloop/static/js/teamwork/main/template/teamworkSubRow.ejs',
        
    constructor : function (options) {
		_.extend(this, options);
	},
	
    render: function () {
    	this.getData();
        this.$el = $(new EJS({url: this.template }).render(this.dataTemplate));
        this.setEvents();
        return this;
    },
    
    getData: function(){
    	var data = ajaxCall('GET', '/blueloop/teamwork/getTeamWorkFnOpen/', {id:this.model.id}, "text/json", "json", false);

        this.dataTemplate = {
            idTeam     : this.model.id,
            nameTeam   : this.model.get("name"),
            typeTeam   : this.model.get("type"),
            itemId     : this.model.get("objid"),
            item       : this.model.get("objname"),
            items      : data.teamMembers,
            userLogged : data.userLogged
        };
    },
    
    setEvents: function(){
        this.$el.find(".messageTeammember").click(this,this.messageTeammember);
        this.$el.find(".chatTeammember").click(this,this.chatTeammember);
    },
    
    messageTeammember: function(e) {
    	console.log(e.currentTarget.name)
    	var tmEmailModal = new teammemberEmailModalView({ id: e.currentTarget.id,name:e.currentTarget.name });
    	tmEmailModal.render().$el.modal("show");
    },
    
    chatTeammember: function(e){
    	var chatname = e.currentTarget.name + " on Team " + e.data.model.get("name");
    	var userslist = [];
    	userslist.push(e.currentTarget.id);	

    	if(e.data.model.get("type") == 0 && e.data.model.get("objname") != ''){
    		chat.createLoopChatGroup(chatname, userslist, e.data.model.get("objid"));//chat type 0 (team of loop) and assigned to loop
    	}else{
    		if(e.data.model.get("type") == 1 && e.data.model.get("objname") != ''){ 
    			chat.createBBChatGroup(chatname, userslist, null, e.data.model.get("objid"), 1);//chat type 1 (team of BB, assigned to BB)
    		}else{
    			chat.createNewChatGroup(chatname, userslist);//team without BB or loop assigned
    		}	
    	}
    	toastr.success(json.chat.createSuccess);
    }

});