function Realtime() {
	
	var that = this;
	that.instance;
	
	that.init= function() {	
		var username = sessionUser.get("name") + " " + sessionUser.get("lastname") + "_" + sessionUser.get("id");
		that.instance = PUBNUB.init({
			 publish_key: 'pub-c-e9535be1-3654-4c1e-95f8-47781d2d0707',
		     subscribe_key: 'sub-c-7ed4f1f6-6e9c-11e4-afd7-02ee2ddab7fe',
		     uuid: username,
		     ssl: (('https:' == document.location.protocol) ? true : false),
		     cipher_key : '465C8DF8ADC3185AE72E3681C57BL'
		 });	
		
		window.chatView = new chatPanelView();
		
		that.subscribeRealtimeChannel(sessionUser.get("pubnubChannel"));
	}
	
	// Subscribe to Realtime Channel
	that.subscribeRealtimeChannel= function(channel) {			
		that.instance.subscribe({
			channel: channel,
			message: function(m, env, ch){
				if(m.type == "deletedChat"){
				   chat.removeChat(m.chatId);
			   }
			   if(m.type == "ModifiedLoop"){
				   if(document.URL.indexOf("execution") != -1 && $("#idChain").text().trim() == m.idChain){
					   toastr.info("Loop: " + m.nameChain + json.loop.modified);
				   }	
			   }
			   if(m.type == "TimelineUpdate"){
				   if(	document.URL.indexOf("execution") != -1 && $("#idChain").text().trim()== m.chainId){
					   TimelineDataSet = JSON.parse(m.message);
					   timeline.searchTimeline("");
				   }
			   }

			   if(m.user == sessionUser.get("id")){
				   switch (m.type){
			   		case "newSingleChat":
						chat.newSingleChat(m);
						break;
			   		case "newGroupChat":
						chat.newGroupChat(m);
						break;
			   		case "newLoopGroupChat":
						chat.newLoopGroupChat(m);
						break;
			   		case "newBBGroupChat":
						chat.newBBGroupChat(m);
						break;
			   		case "removedFromChat":
						chat.removeChat(m.chatId);
						break;
			   		case "NewConnectionRequest":
			   			notifPanelView.addUserAlert(m);
						break;
			   		case "ConnectionApproved":
			   			notifPanelView.addUserAlert(m);
						break;
			   		case "CancelConnectionRequest":
			   			notifPanelView.cancelConnectionRequest(m);
						break;
			   		case "NewBBConnectionRequest":
			   			notifPanelView.addBBAlert(m);
						break;
			   		case "BBConnectionApproved":
			   			notifPanelView.addBBAlert(m);
						break;
			   		case "CancelBBConnectionRequest":
			   			notifPanelView.cancelBBConnectionRequest(m);
						break;
			   		case "LoopStarted":
			   			notifPanelView.addLoopAlert(m);
						loopStarted(m);
						break;
			   		case "AddedToTeam":					   		
			   			notifPanelView.addUserAlert(m);
						break;					   			
			   		case "RiskAlert":
			   			notifPanelView.addLoopAlert(m);
						if(document.URL.indexOf("execution") != -1){
							if(m.bbRisk.status == '1'){ //1: active, 0: inactive
								riskPopoverController.increaseRiskCounter(m.bbDiagramId);
							}else{
								riskPopoverController.decreaseRiskCounter(m.bbDiagramId);
							}
							riskPopoverController.updateRiskStateButton(m.bbRisk.status,m.bbRisk.id);
						}
						break;
			   		case "GeneralAlert":
			   			notifPanelView.addLoopAlert(m);
			   			if(document.URL.indexOf("execution") != -1){
	  			   		    if(m.typeAlert == 1){ // 1: new alert, 0:removed alert 
							   alertPopoverController.increaseAlertCounter(m.bbDiagramId);
						    }else{ 
							   alertPopoverController.decreaseAlertCounter(m.bbDiagramId);
						    } 
			   			}
			   			break;
			   		case "forecastAlert":
			   			notifPanelView.addFCAlert(m);
					   	break;
					}					   
				 }				     
			   },
			   
			   presence: function(m){
				   var id =  m.uuid.substr( m.uuid.indexOf('_')+1);
				   if(m.action == "join"){
					   chatView.changeStatusColor(id, "Online"); //newUIChat
					   if (window.hasOwnProperty('peopleGrid')) {
						   peopleGrid.changeStatusColor(id, "Online");
					   }
					   
					   realtime.getUuidState(sessionUser.get("pubnubChannel"), m.uuid);	
				   }
				   if(m.action == "leave" || m.action == "timeout" ){
					   chatView.changeStatusColor(id, "Default"); //newUIChat
					   if (window.hasOwnProperty('peopleGrid')) {
						   peopleGrid.changeStatusColor(id,"Default");
					   }
				   }
				   if(m.action == "state-change"){
					   changeUserStatus(m.data.status, m.data.id);					  
				   }				 				 		  
			   },
		});
	}
	
	that.publishChannel= function(channel, message) {	
		that.instance.publish({
	        channel : channel, message : message
	    });
	 }
	
	that.unsubscribe= function(channel) {	
		that.instance.unsubscribe({
		    channel : channel,
		 });
	 }
	
	that.setUuidState= function(channel, state) {	
		that.instance.state({
		    channel : channel,
		    state 	: state,
		    callback : function(m){
		    	console.log(m)
		    }
		 });
	 }
	
	that.getUuidState= function(channel, uuid) {	
		that.instance.state({
		    channel : channel,
		    uuid: uuid,
		    callback : function(m){
		    	changeUserStatus(m.status, m.id);				
		    }
		 });
	 }

	function changeUserStatus(status, userId){
		switch(status) {
		 case "Online":
			 if(sessionUser.get("id") == userId){
				 $(".status-icon ").removeClass("green red yellow");
				 $(".status-icon ").addClass("green");
				 $(".current-user-status-icon").removeClass("green red yellow");
				 $(".current-user-status-icon").addClass("green");
			 }else{
				 chatView.changeStatusColor(userId,status);//newUIChat
				 if (window.hasOwnProperty('peopleGrid')) {
					 peopleGrid.changeStatusColor(userId,status);
				 }
			 }
			 break;
		 case "Busy":
			 if(sessionUser.get("id") == userId){
				 $(".status-icon ").removeClass("green red yellow");
				 $(".status-icon ").addClass("red");
				 $(".current-user-status-icon").removeClass("green red yellow");
				 $(".current-user-status-icon").addClass("red");
			 }else{
				 chatView.changeStatusColor(userId,status);//newUIChat
				 if (window.hasOwnProperty('peopleGrid')) {
					 peopleGrid.changeStatusColor(userId,status);
				 }
			 }
			 break;
		 case "Away":
			 if(sessionUser.get("id") == userId){
				 $(".status-icon ").removeClass("green red yellow");
				 $(".status-icon ").addClass("yellow");
				 $(".current-user-status-icon").removeClass("green red yellow");
				 $(".current-user-status-icon").addClass("yellow");
		 	 }else{
		 		 chatView.changeStatusColor(userId,status);//newUIChat
		 	     if (window.hasOwnProperty('peopleGrid')) {
		 	    	 peopleGrid.changeStatusColor(userId,status);
		 	     }
		 	 }
			 break;
		 }		    		
	}
	
	return that;
}