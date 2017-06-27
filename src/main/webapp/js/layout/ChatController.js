function Chat() {
	
	var that = this;
	that.listChatRoom      = [];
	that.total_popups	   = 0;
	that.popups            = [];
	that.dropDownChatView;
    
		
	/*===================================================================================================================*/
    /* Begins of Code for Chat Boxes*/
    /*===================================================================================================================*/
	
	that.createChatFromPanel =  function (chatId, userId, title, channel, obj){	
		
		var jsonObject = {idUser:userId,loopChat:"false",chatName:"",idChain:"",idCbb:""};
		var data = ajaxCall('GET','/blueloop-backend/chat/createChat/', jsonObject, "text/json", "json", false);
		if(channel == ""){
			chatView.setSingleChatChannel(userId, data.channel, data.id);
			realtime.publishChannel(sessionUser.get("pubnubChannel"), {chatId:data.id, channel:data.channel, user:userId, user2:sessionUser.get("id"), type:"newSingleChat"}); //publish notification
		}
		
		that.agregarNewChat(data.id, title, data.channel)
		
	}
	
	that.agregarNewChat = function(idChat, title, channel){
		var obj = _.find(that.popups, function(model) { return model.id == idChat });
	    if(obj == undefined){
	    	var model = new chatWidgetModel({
				id:idChat,
	  		  	title: title,
	  		  	channel: channel,
	  		  	people: []
	  		});
	    	var singleChatView = new chatWidgetSingleChatView({model:model});
	    	that.listChatRoom.push(singleChatView );
		    $("body").append(singleChatView.render().$el);
		    singleChatView.setScroll();
	    	that.popups.unshift(model);
	    }else{
	    	var index, model;
	    	_.each(that.popups,function(item,i){
	    		if(item.id == idChat){
	    			index = i;
	    			model = item;
	    		}	    	
	    	});
	    	that.popups.splice(index,1);
	    	that.popups.unshift(model);
	    }
	    calculate_popups();
	}
	

    that.agregarGroupChat = function(data) {
        var obj = _.find(that.popups, function(model) {
            return model.id == data.model.get("id");
        });

        if (obj == undefined) {
            var peopleObj = that.getChatUsers(data.model.get("id"));
            var model = new chatWidgetModel({
                id : data.model.get("id"),
                title : data.model.get("chatName"),
                channel : data.model.get("channel"),
                people : peopleObj[0].members,
                isCreator : peopleObj[0].isCreator
            });
            var groupChatView = new chatWidgetGroupChatView({
                model : model,
                panelView : data
            });
            that.listChatRoom.push(groupChatView);
            $("body").append(groupChatView.render().$el);
            groupChatView.setScroll();
            that.popups.unshift(model);
        } else {
            var index, model;
            _.each(that.popups, function(item, i) {
                if (item.id == data.model.get("id")) {
                    index = i;
                    model = item;
                }
            });
            that.popups.splice(index, 1);
            that.popups.unshift(model);
        }
        calculate_popups();
    }
	
	
	that.getChatUsers = function(idChat){
		var users;
		$.ajax({
	        type: 'GET',
	        url: '/blueloop-backend/chat/getChatWithMembers/',
	        data: {id:idChat},
	        contentType: "text/json",
	        dataType: "json",
	        async: false,
	        success: function(data) {
	        	users = data;
	        },
	    	error: function(httpRequest, textStatus, errorThrown) { 
	     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
	     	}
	    });
		return users;
	}
	
    function calculate_popups(){
        var width = window.innerWidth;
        
        if(width < 540){
            that.total_popups = 0;
        }else{
            width = width - 200;
            //340 is width of a single popup box
            that.total_popups = parseInt(width/340);
        }
        
        display_popups();
        
    }
    
    function display_popups(){
        var left = 0;
        
        var iii = 0;
        for(iii; iii < that.total_popups; iii++){
            if(that.popups[iii] != undefined){
                $(document).find("#"+that.popups[iii].id+".chat-widget").css("left",left + "px");
                $(document).find("#"+that.popups[iii].id+".chat-widget").css("display","block");
                left = left + 340;
            }
        }
        if(that.dropDownChatView){
	    	that.dropDownChatView.remove();
	    }
        
        if(that.total_popups < that.popups.length){
        	var chatList = [];
		    for(var jjj = iii; jjj < that.popups.length; jjj++){
	            $(document).find("#"+that.popups[jjj].id+".chat-widget").css("display","none");
	            chatList.push(that.popups[jjj]);
	        }
	    	that.dropDownChatView = new dropDownChatView({numberToGroup:(that.popups.length - that.total_popups),chatList:chatList,left:left});
		    $("body").append(that.dropDownChatView.render().$el);
        }  
        
    }
    
    that.closeChat = function (idChat){	
    	var index1,index2;
    	_.each(that.popups,function(item,j){
    		if(item.id == idChat){
    			index1 = j;
    		}	    	
    	});
    	that.popups.splice(index1,1);

    	var view;
    	_.each(that.listChatRoom,function(item,i){
    		if(item.model.id == idChat){
    			index2 = i;
    			view = item;
    		}	    	
    	});
    	that.listChatRoom.splice(index2,1);
    	if(view){
    	    view.remove();
    	}
    	chatView.setChatState(idChat, 0); //0: closed
    	calculate_popups();
    	
	}
	
    /*===================================================================================================================*/
    /* Begins of Code for Chat Panel
    /*===================================================================================================================*/
	
	that.newSingleChat = function(m){
		colorPanelChat();
		chatView.setSingleChatChannel(m.user2, m.channel, m.chatId);
	}
	
	that.newGroupChat = function(m){
	    var data = {id:m.chatId, name:m.chatName, owner:false, channel: "Chat_"+m.chatId, type: 0};
	    chatView.addNewGroupChat(data); //new UI chat
	}
	
	that.newLoopGroupChat = function(m){
		colorPanelChat();
	    var data = {id:m.chatId, name:m.chatName, owner:false, channel: "Chat_"+m.chatId, type: 1};
	    chatView.addNewGroupChat(data); //new UI chat
	}
	
	that.newBBGroupChat = function(m){
		var data = {id:m.chatId, name:m.chatName, owner:false, channel: "Chat_"+m.chatId, type: 3};
		chatView.addNewGroupChat(data); //new UI chat
	}
	
	function colorPanelChat(){	
		if($("#panel_chat_menu").hasClass('expandida') == false){
			   $("#tab_chat").css("background","#ff6c60");
		}
	}
    
	/*===================================================================================================================*/
    /* Begins of Code for Creation of Group Chats
    /*===================================================================================================================*/
	
	//function showChatGroupDialog() {
	that.showChatGroupDialog = function(){
		var data = ajaxCall('GET', '/blueloop-backend/chat/getListCommunity/', new Object(), "text/json", "json", false);
		var groupModal = $(new EJS({url:'/blueloop-backend/static/js/layout/chat/chatPanel/template/chatNewGroupModal.ejs'}).render({userList:data, name:'',id:'',idChain:'',edit:false}));
		groupModal.modal('show');
		setEventsChatGroupDialog(groupModal);
	}
	
	that.showLoopChatGroupDialog = function(idChain) {
		var data = ajaxCall('GET', '/blueloop-backend/chat/getListTeamMembers/', {idChain:idChain}, "text/json", "json", false);
		var groupModal = $(new EJS({url:'/blueloop-backend/static/js/layout/chat/chatPanel/template/chatNewLoopGroupModal.ejs'}).render({userList:data.listUsers,name: data.chainName, id:'', idChain:idChain, edit:false}));

		groupModal.modal('show');
		setEventsChatGroupDialog(groupModal);
	}
	
	that.showBBChatGroupDialog = function(suggestedName, cbbid, bbid, idChain) {
		var data = ajaxCall('GET', '/blueloop-backend/chat/getListBBTeamMembers/', {idCBB:cbbid,idBB:bbid}, "text/json", "json", false);
		var groupModal = $(new EJS({url:'/blueloop-backend/static/js/layout/chat/chatPanel/template/chatNewBBGroupModal.ejs'}).render({userList:data,name: '', id: '',cbbId:cbbid,suggestedName:suggestedName,idChain:idChain, edit: false}));
		groupModal.modal('show');
		setEventsChatGroupDialog(groupModal);
	}
	
	function setEventsChatGroupDialog(groupModal,model){
		groupModal.find('#selectUsers').multiSelect('refresh');
		groupModal.find("#select-all").click(function() {
			groupModal.find('#selectUsers').multiSelect('select_all');
		});
		groupModal.find("#deselect-all").click(function() {
			groupModal.find('#selectUsers').multiSelect('deselect_all');
		});

		groupModal.find("#btnSaveGroup").click(function() {
			if(validateGroupChatForm(groupModal)){
				var users = [];
				$.each(groupModal.find("#selectUsers option:selected"), function(index, id) { 
					users.push(this.value);		
				});
				that.createNewChatGroup(groupModal.find("#nameChatGroup").val(),users);
				groupModal.modal('hide');
			}
		});
		
		groupModal.find("#btnSaveLoopChatGroup").click(function() {
			if(validateGroupChatForm(groupModal)){
				var users = [];
				$.each(groupModal.find("#selectUsers option:selected"), function(index, id) { 
					users.push(this.value);		
				});
				that.createLoopChatGroup(groupModal.find("#nameChatGroup").val(),users,groupModal.find("#chainId").html());
				groupModal.modal('hide');
			}
		});
		
		groupModal.find("#btnSaveBBChatGroup").click(function() {
			if(validateGroupChatForm(groupModal)){
				var users = [];
				$.each(groupModal.find("#selectUsers option:selected"), function(index, id) { 
					users.push(this.value);		
				});
				that.createBBChatGroup(groupModal.find("#nameChatGroup").val(),users,groupModal.find("#chainId").html(),groupModal.find("#cbbId").html());
				groupModal.modal('hide');
			}
		});
		
		groupModal.find("#btnSaveEditGroup").click(function() {
			if(validateGroupChatForm(groupModal)){
				var users = [];
				$.each(groupModal.find("#selectUsers option:selected"), function(index, id) { 
					users.push(this.value);
				});
				
    			var datausers = that.editChatGroup(groupModal.find("#nameChatGroup").val(),users,model.get("id"));
    			notificationEditChatGroup(datausers, "newGroupChat",model);
    			groupModal.modal('hide');
			}
		});
		
		groupModal.find("#btnSaveEditLoopChatGroup").click(function() {
			if(validateGroupChatForm(groupModal)){
				var users = [];
				$.each(groupModal.find("#selectUsers option:selected"), function(index, id) { 
					users.push(this.value);
				});
    			var datausers = that.editChatGroup(groupModal.find("#nameChatGroup").val(),users,groupModal.find("#idChatHidden").val());
    			notificationEditChatGroup(datausers, "newLoopGroupChat");
    			groupModal.modal('hide');
			}
		});
		
		groupModal.find("#btnSaveEditBBChatGroup").click(function() {
			if(validateGroupChatForm(groupModal)){
				var users = [];
				$.each(groupModal.find("#selectUsers option:selected"), function(index, id) { 
					users.push(this.value);
				});
    			var datausers = that.editChatGroup(groupModal.find("#nameChatGroup").val(),users,groupModal.find("#idChatHidden").val());    			
    			notificationEditChatGroup(datausers, "newBBGroupChat");
    			groupModal.modal('hide');
			}
		});
	}
	
	function validateGroupChatForm(modal){
		var valid = true;
		modal.find("#nameChatGroupError").html("");
		modal.find("#membersChatGroupError").html("");

		if (modal.find("#nameChatGroup").val().trim().length < 3){
			valid = false;
			modal.find("#nameChatGroupError").html(json.chat.enterTitle);
			modal.find("#nameChatGroup").focus();
		}
		if (modal.find(".ms-selection").find('.ms-selected').length < 1){
			valid = false;
			modal.find("#membersChatGroupError").html(json.chat.memberSelectionError);
			modal.find(".ms-selection").focus();
		}			
		return valid;
	}
	
	that.createNewChatGroup = function(groupName,userList){		
		var jsonObject = new Object();
		jsonObject.chat = groupName;
		jsonObject.users= userList;
		var data = ajaxCall('GET','/blueloop-backend/chat/createChatGroup/', jsonObject, "text/json", "json", false);
		chatView.addNewGroupChat(data); //new UI chat
		//refreshPanelChatGroup(data.id,groupName); // old chat
		sendNotificationNewChat(data.id, groupName, userList, "newGroupChat", "");
		//that.subscribeGroupChannels();
	}
	
	that.createLoopChatGroup = function(groupName,userList,idChain){
		var jsonObject = new Object();
		jsonObject.chat = groupName;
		jsonObject.users= userList;
		jsonObject.idChain = idChain;
		var data = ajaxCall('GET','/blueloop-backend/chat/createLoopChatGroup/', jsonObject, "text/json", "json", false);
		chatView.addNewLoopChat(data); //new UI chat
		//refreshPanelLoopChatGroup(data.instanceChat.id,groupName,data.instanceChat.chain.id, data.loopName);
		sendNotificationNewChat(data.instanceChat.id, groupName, userList, "newLoopGroupChat", data.loopName)
		//that.subscribeLoopGroupChannels();
	}
	
	that.createBBChatGroup = function(groupName,userList,idChain,idCBB,type){	//type  1: from bb id, null: from cbb	
		var jsonObject = new Object();
		jsonObject.chat = groupName;
		jsonObject.users= userList;
		jsonObject.idChain = idChain;
		jsonObject.idCBB = idCBB;
		jsonObject.type = type;
		var data = ajaxCall('GET','/blueloop-backend/chat/createBBChatGroup/', jsonObject, "text/json", "json", false);
		chatView.addNewBBChat(data); //new UI chat
		//refreshPanelBBChatGroup(data.instanceChat.id,groupName,data.instanceChat.bb.id, data.bbName);
		sendNotificationNewChat(data.instanceChat.id, groupName, userList, "newBBGroupChat", data.bbName);
		//that.subscribeBBGroupChannels();
	}
	
	function sendNotificationNewChat(idChat, nameChat, users, type, other){
		$.each($(users), function(index, iduser) { 
			realtime.publishChannel(sessionUser.get("pubnubChannel"), {chatId:idChat, chatName:nameChat, user:iduser, type:type, other: other});
		});				
	}
	
	/*===================================================================================================================*/
    /* Begins of Code for Edit Group Chats
    /*===================================================================================================================*/
	
	//New UI chat way to edit group chats, loop chats or bb chats, given the type of the chat
	that.editChat = function (model,modelWidgetGroup) {
		switch (model.get("type")){
		
		case 0: //type: 0 = group chat
			var users    = ajaxCall('GET', '/blueloop-backend/chat/getListCommunity/', new Object(), "text/json", "json", false);
			var chatData = getChatGroupWithMembers(model.get("id"),users);
			var groupModal = $(new EJS({url:'/blueloop-backend/static/js/layout/chat/chatPanel/template/chatNewGroupModal.ejs'}).render({userList:chatData.users,name:chatData.chatName,id:model.get("id"),edit:true}));						
			groupModal.modal('show');
			setEventsChatGroupDialog(groupModal,model);
		break;
		
		case 1://type: 1 = loop chat
			var users = ajaxCall('GET', '/blueloop-backend/chat/getListTeamMembers/', {idChain:model.get("chain_id")}, "text/json", "json", false);
			var chatData = getChatGroupWithMembers(model.get("id"),users.listUsers);
			var groupModal = $(new EJS({url:'/blueloop-backend/static/js/layout/chat/chatPanel/template/chatNewLoopGroupModal.ejs'}).render({userList:chatData.users,name:chatData.chatName,id:model.get("id"),idChain:model.get("chain_id"),edit:true}));						
			groupModal.modal('show');
			setEventsChatGroupDialog(groupModal,model);
		break;

		case 3: //type : 3 = bb chat
			var users = ajaxCall('GET', '/blueloop-backend/chat/getListBBTeamMembers/', {idCBB:model.get("id"),idBB:model.get("bb_id")}, "text/json", "json", false);
			var chatData = getChatGroupWithMembers(model.get("id"),users);
			var groupModal = $(new EJS({url:'/blueloop-backend/static/js/layout/chat/chatPanel/template/chatNewBBGroupModal.ejs'}).render({userList:chatData.users,suggestedName:chatData.chatName,id:model.get("id"),cbbId:model.get("bb_id"),idChain:model.get("chain_id"),edit:true}));						
			groupModal.modal('show');
			setEventsChatGroupDialog(groupModal,model);
		break;
		} 
	}
	
	function getChatGroupWithMembers(id,users){	
		var data = ajaxCall('GET', '/blueloop-backend/chat/getChatWithMembers/', {id:id}, "text/json", "json", false);
		$.each(data[0].members, function (i,member) {
			$.each(users, function(j,user) {
				if(user.id == member.id) {
					users[j].selected = "selected";
				}
			});
		});	
		
		return {users:users,chatName:data[0].chat.name};
	}
	
	that.editChatGroup = function(newName,users,id){
		var jsonObject    = new Object({chat:newName,users:users,id:id});
		var data = ajaxCall('GET','/blueloop-backend/chat/editGroup/', jsonObject, "text/json", "json", false);
		
		return data; //Format: users removed, user in group, chatinstance, bbname or loopname		
	}

	function notificationEditChatGroup(data,type,modelWidgetGroup){
		$.each(data[0], function(index, userchat) {  //users removed
			if (userchat != null){
				realtime.publishChannel(sessionUser.get("pubnubChannel"), {chatId:userchat.chat.id, chatName:data[2].name, user:userchat.user.id, type:"removedFromChat"});
				$("#" + userchat.chat.id+".chat-widget").find('i.user-id-'+ userchat.user.id).parents(".contact").remove();
				var count = $("#" + userchat.chat.id+".chat-widget").find('.chat-people-collapse').attr('data-badge');
				count = parseInt(count) - 1;
				$("#" + userchat.chat.id+".chat-widget").find('.chat-people-collapse').attr({'data-badge':count,'aria-label':count.toString() + json.chat.countPeople,"title":count.toString() + json.chat.countPeople});
			}
		});

		$.each(data[1], function(index, usercht) { //users in group
			if (usercht != null){
		        if(usercht.user.id != sessionUser.get("id")){
		            realtime.publishChannel(sessionUser.get("pubnubChannel"), {chatId:usercht.chat.id, chatName:data[2].name, user:usercht.user.id, type:type, other:data[3]});
		        }										
		    }
		});	
		
        $.each(data[3], function(index, item) { // new users in group
            if (item != null) {
                if (item.user.id != sessionUser.get("id")) {
                    refreshContactList(item.user, item.chat_id)
                }
            }
        });		

        chatView.refreshName(data[2].id, data[2].name, type); //new Ui chat
	}

	function refreshContactList(user,chat_id){
        var content = $(new EJS({url: '/blueloop-backend/static/js/layout/chat/chatWindow/template/contact.ejs'}).render({user:user}));
        
        var userStatus = chatView.singleChatsCollection.findWhere({userId:user.id}).get("status");
        var status     = $(content).find('i.user-id-'+ user.id).parent();
        if(userStatus == "Away"){
            status.css("background-color", "#F5A623");
        }else if(userStatus == "Online"){
            status.css("background-color", "#7ED321");
        }else if(userStatus == "Busy"){
            status.css("background-color", "#FF001F");
        }else if(userStatus == "Default"){
            status.css("background-color", "#D5D5D5");
        }
        
        $("#"+chat_id+".chat-widget").find(".contact-list").append($(content));
        
        var count = $("#" +chat_id+".chat-widget").find('.chat-people-collapse').attr('data-badge');
        count = parseInt(count) + 1;
        $("#" +chat_id+".chat-widget").find('.chat-people-collapse').attr({'data-badge':count,'aria-label':count.toString() + json.chat.countPeople,"title":count.toString() + json.chat.countPeople});
	}
	
	function refreshPanelChatGroup(chatId, chatName){	
		var data = {chatId:chatId, chatName:chatName, owner:true};
		var content = $(new EJS({url: '/blueloop-backend/static/js/layout/chat/chatPanel/template/chatPanelGroupItem.ejs'}).render(data));
		$("#chat-group-list").append($(content));
		$("#chat-group-list").find('i').click(that.btnActionByClass);
	}
	
	function refreshPanelLoopChatGroup(chatId, chatName, chainId, loopName){	
		var data = {chatId:chatId, chatName:chatName, other:loopName, owner:true, chainId:chainId};
		var content = $(new EJS({url: '/blueloop-backend/static/js/layout/chat/chatPanel/template/chatPanelLoopGroupItem.ejs'}).render(data));
		$("#loop-chat-group-list").append($(content)); 		
		$("#loop-chat-group-list").find('i').click(that.btnActionByClass);
	}
	
	function refreshPanelBBChatGroup(chatId, chatName, bbId, bbName){	
		var data = {chatId:chatId, chatName:chatName, other:bbName, owner:true, bbId:bbId};
		var content = $(new EJS({url: '/blueloop-backend/static/js/layout/chat/chatPanel/template/chatPanelBbGroupItem.ejs'}).render(data));
		$("#bb-chat-group-list").append($(content)); 			
		$("#bb-chat-group-list").find('i').click(that.btnActionByClass);
	}
	
	that.leaveChat = function (idChat, nameChat) {
		bootbox.confirm(json.chat.confirmLeave, function (e) {
    		if (e){
    			var result = ajaxCall('GET', '/blueloop-backend/chat/leaveChat/', {id:idChat}, "text/json", "json", false);
    			if(result.result == "success"){
    				toastr.success(json.chat.leaved);
    				that.removeChat(idChat);
    			}    			
    		}
    	});
	}
	
	that.deleteChat = function (idChat, nameChat, chatType) {
		bootbox.confirm(json.chat.confirmDelete, function (e) {
    		if (e){
    			var result = ajaxCall('GET', '/blueloop-backend/chat/removeChat/', {id:idChat}, "text/json", "json", false);
    			if(result.result == "success"){
    				toastr.success(json.chat.deleted);
    				chatView.removeChat(idChat, chatType);
    				realtime.publishChannel(sessionUser.get("pubnubChannel"), {chatId:idChat, chatName:nameChat, type:"deletedChat"});
    				
    			}    			
    		}
    	});
	}
	
	that.removeChat = function(idChat){
		that.closeChat(idChat);
	}
	
	return that;
}