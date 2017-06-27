var teamworkRowView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/teamwork/main/template/teamworkRow.ejs',
        
    constructor : function (options) {
		_.extend(this, options);
	},
	
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.setEvents();
        return this;
    },
    
    setEvents: function(){
        this.$el.find("#editGroup").click(this,this.editGroup);
        this.$el.find("#messageGroup").click(this,this.messageGroup);
        this.$el.find("#chatGroupTeamwork").click(this,this.chatGroup);
        this.$el.find("#groupDetail").click(this,this.showDetail);
    },
    
    editGroup: function(e) {
    	var twEditModal = new teamworkEditModalView({ model: e.data.model });
    	twEditModal.render().$el.modal({backdrop: 'static',keyboard: false});
    },
    
    messageGroup: function(e){
    	var twEmailModal = new teamworkEmailModalView({ model: e.data.model });
    	twEmailModal.render().$el.modal({backdrop: 'static',keyboard: false});
    },
    
    chatGroup: function(e){
    	var chatname = "Team Chat: " + e.data.model.get("name");
    	var userslist = [];

    	var listTeamwork = ajaxCall('GET', '/blueloop-backend/teamwork/getTeamwork/', {id:e.data.model.id}, "text/json", "json", false);

    	$.each(listTeamwork[0].members, function (h, member) {
    		if(sessionUser.get("id") != member.user.id){
    			userslist.push(member.user.id);
    		}			
    	});

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
    },
    
    showDetail: function(e){
        if(e.data.$el.find("i").first().hasClass("fa-minus-circle")){   
        	e.data.$el.find("i").first().removeClass("fa-minus-circle").addClass("fa-plus-circle");
    		e.data.$el.next().find("td.sub-row").slideToggle(200);
    		e.data.$el.next().remove();
        } else {    
        	if(e.data.$el.find("#groupDetail i").hasClass("fa-minus-circle")){
                e.data.$el.find("#groupDetail i").removeClass("fa-minus-circle").addClass("fa-plus-circle");
                e.data.$el.next().find("td.sub-row").slideToggle(200);
                e.data.$el.next().remove();
            }
    		e.data.$el.find("i").first().removeClass("fa-plus-circle").addClass("fa-minus-circle");
        	var subrowView = new teamworkSubRowView( { model: e.data.model} );
        	e.data.$el.after(subrowView.render().$el);
        	subrowView.$el.find("td.sub-row").slideToggle(200);
        }
    }

});