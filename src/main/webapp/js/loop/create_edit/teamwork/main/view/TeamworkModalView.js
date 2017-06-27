var TeamworkModalView = Backbone.View.extend({

	template: '/blueloop-backend/static/js/loop/create_edit/teamwork/main/template/TeamworkModal.ejs',
	
    initialize: function(){
        this.model = new TeamworkModel();
        if (localStorage.getItem('teamworkId') != "null" && localStorage.getItem('teamworkId')) {
            this.model.set("id",localStorage.getItem('teamworkId'));
        }
    },

	render: function() {	
		this.model.members = new TeamMemberCollection([]);
		this.model.membersRemove = new TeamMemberCollection([]);
		
		if (localStorage.getItem('teamworkId') != "null") {
			this.getMembersSavedTeam();
		}else{
			this.getMembersNewTeam();
	   	}	
		this.updateCollection();
		this.$el = $(new EJS({url: this.template }).render({teamName:this.model.name})); 
		this.setEvents();
        return this;
	},
	
	show: function(){		
		this.updateCollection();
		this.resetDatatable();
		this.$el.modal("show");
	},
	
	setEvents: function(){
		this.$el.find("#closeHeader").click(this,this.closeModal);
		this.$el.find("#closeBtn").click(this,this.closeModal);
		this.$el.find("#acceptBtn").click(this,this.acceptModal);
		this.$el.find("#addUserBtn").click(this,this.addUsertBtn);
	},
	
	setTeamName: function(teamName){
		this.model.set('name',teamName);
		this.$el.find("#teamworkNameEdit").val(teamName);
	},
	
	setTeamId: function(teamId){
		this.model.id = teamId;
	},
	
	resetDatatable: function(){
		var tableView = new TeamworkTableView({collection:this.model.members, parent:this});
		this.$el.find("#teamworkTableContent").html(tableView.render().$el);
		tableView.initDatatable();		
	},
	
	getMembersNewTeam: function(){
		var creator = ajaxCall('GET', '/blueloop-backend/user/getCurrentForNewLoop/', undefined, "text/json", "json", false);
    	if($("#titleChain").html() != "Untitled"){
    	    this.model.name = $("#titleChain").html() + " Teamwork";
    	}else{
    	    this.model.name = "Teamwork";
    	}
    	
		this.model.creator = creator.id		
		var member = new TeamMemberModel({
			idUser:creator.id,
  		  	name: creator.name,
  		  	company: creator.company,
  		  	viewer: true,
  		  	roles: [{id:1,roleName:"LOOP_ARCHITECT"},{id:4,roleName:"LOOP_ORDER_RESPONSIBLE"}],
  		  	layers: [{name:"GENERAL"},{name:"RISK_MANAGEMENT"}]
  		});    		
		this.model.members.add(member);  
	},
	
	getMembersSavedTeam: function(){
		var jsonObject = {id:this.model.id, from:'loop'}
		var result = ajaxCall('GET', '/blueloop-backend/teamwork/getLoopTeamwork/', jsonObject, "text/json", "json", false);
		
		var data = result[0];
		this.model.name = data.team.name;
    	this.model.creator = data.userCreator.id
		
    	_.each(data.members,function(item,i){
    		var member = new TeamMemberModel({
    			idUser:item.user.id,
    		  	name: item.user.firstName + " " + item.user.lastName,
      		  	company: item.company,
    		  	viewer: item.viewer,
    		  	roles: item.roles,
    		  	layers: item.layers,
    		  	teamMember_id : item.teamMember
    		});
    		this.model.members.models.push(member); 
	    },this); 
	},
	
	getDataSave: function(){
		this.updateCollection();
		return this.model;
	},

	updateOwners: function(dataOwners){
    	_.each(dataOwners,function(us,i){	
    		var modelMember = this.model.members.findWhere({'idUser': us.id});
    		if (modelMember == undefined) {//if us is not in model.members it's added
    			this.addNewResponsibleUser(us);   			
			}
    	},this);					
    },

    updateResponsibles: function(dataResponsibles){
    	_.each(dataResponsibles,function(us,i){
    		var modelMember = this.model.members.findWhere({'idUser': us.id});
			if (modelMember == undefined) {
				this.addNewResponsibleUser(us);//if us is not in model.members it's added
			}else{ 
				this.updateResponsibleUser(modelMember);//if us is already in listMembers[] it's updated as responsible (responsibles)
			} 
    	 },this);				
    },

    updateCollection: function(){ 
    	var dataResponsibles = chain.getResponsibles(); //bb responsibles selected on diagram
		var dataOwners = chain.getOwners(); //bb owners on diagram

    	this.updateResponsibles(dataResponsibles);
    	this.updateOwners(dataOwners);
    	//remove old responsibles from model.members
    	 this.model.members.each(function(member,i){
    		var isAlreadyBBResponsible = false, isAlreadyArchitect = false, remove = true;
    		if(member){
    		    _.each(member.get('roles'),function(role,j){
    		        if(role.roleName == "LOOP_BB_RESPONSIBLE"){
    		            isAlreadyBBResponsible = true;}				
    		        if(role.roleName == "LOOP_ARCHITECT"){
    		            isAlreadyArchitect = true;}		
    		    },this);
    		    
    		    if(isAlreadyBBResponsible){
    		        _.each(dataResponsibles,function(us,k){
    		            if(us.id == member.get('idUser'))
    		                remove = false;
    		        },this);
    		        _.each(dataOwners,function(us,i){
    		            if(us.id == member.get('idUser'))
    		                remove = false;
    		        },this);
    		        if(remove){
    		            this.removeResponsibleUser(isAlreadyArchitect, member);
    		        }
    		    }
    		}
    	},this);
    },
    
    addNewResponsibleUser: function(us){
		var newmember = new TeamMemberModel({idUser: us.id, name: us.name, company: us.company, viewer: true,
  		  	roles: [{id:2,roleName:"LOOP_BB_RESPONSIBLE"}], layers: [{name:"GENERAL"}]
  		});
		this.model.members.models.push(newmember); 
    },
    
    addNewInvitedUser: function(idUser, nameUser, companyUser, sendEmail){
		var newmember = new TeamMemberModel({idUser: idUser, name: nameUser, company: companyUser, viewer: true,
  		  	roles: [{id:2,roleName:"LOOP_INVITED"}], layers: [{name:"GENERAL"}], sendEmail:sendEmail
  		});
		this.model.members.models.push(newmember); 		
    },
    
    updateResponsibleUser: function(modelMember){
		var isAlreadyBBResponsible = false
		_.each(modelMember.get('roles'),function(role,j){
			if(role.roleName == "LOOP_BB_RESPONSIBLE")
				isAlreadyBBResponsible = true;					
		},this);  
		if(!isAlreadyBBResponsible)
			modelMember.get('roles').push({id:2,roleName:"LOOP_BB_RESPONSIBLE"});
    },
    
    removeResponsibleUser: function(isAlreadyArchitect, member){
    	if(!isAlreadyArchitect){
    		_.each(this.model.members.models,function(model,i){
    			if(model != undefined){
    				if(model.cid == member.cid){
    				    this.model.members.models.splice(i,1); 
    				    this.model.membersRemove.add(member); 
    				}
    			}    			 
    		},this); 
    	}else{
			_.each(member.get('roles'),function(role,k){
    			if(role && role.roleName == "LOOP_BB_RESPONSIBLE")
    				member.attributes.roles.splice(k,1);  
    		},this); 	
		}
    },
	
	closeModal: function(e){
		e.data.$el.modal("hide");
	},
	
	acceptModal: function(e){
		e.data.model.attributes.name = e.data.$el.find("#teamworkNameEdit").val();
		e.data.$el.modal("hide");
	},
	
    addUsertBtn: function(e){
        var addMember = new addTMemberModalView({teamModel:e.data});
        addMember.render().$el.modal('show');
    }
});