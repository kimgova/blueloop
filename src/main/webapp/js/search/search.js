$(document).ready(function(){
	
	$(".aConnection" ).mouseenter(function() {
					connStatus(this);
				}).mouseleave(function(event) {
					connStatusReset(this);
				});
	$('#chkfiltro').multiselect({
		onChange: function(element, checked) {
			var searchWord = $.trim($("#searchAllForm").val());
			var chkfiltro  = $("#chkfiltro").val();
			var e;
			setTimeout(searchAll(e,searchWord,chkfiltro), 7000);
		}, 
		includeSelectAllOption: true
	});
});

/* Set state of users connected or not */
function connStatus(thisbtn){
	var status = $.trim($(thisbtn).find("label").text());	
	switch(status) {
	case "nonConnStatus":
		$(thisbtn).find("i").attr("class", "fa fa-chain");
		$(thisbtn).find("i").prop("style").color = "#71B9E7";
		break;
	case "connStatus":
		$(thisbtn).find("i").attr("class", "fa fa-chain-broken");
		$(thisbtn).find("i").prop("style").color = "#ff6c60";
		break;
	case "conRequest":
		$(thisbtn).find("i").attr("class", "fa fa-chain-broken");
		$(thisbtn).find("i").prop("style").color = "#ff6c60";
		break;
	default: console.log("code block default- connStatus")
	} 
}

function connStatusReset(thisbtn){
	var status = $.trim($(thisbtn).find("label").text());
	switch(status) {
	case "nonConnStatus":
		$(thisbtn).attr("data-original-title", "Send contact request to this user");
		$(thisbtn).find("i").attr("class", "fa fa-chain-broken");
		$(thisbtn).find("i").prop("style").color = "#ff6c60";
		break;
	case "connStatus":
		$(thisbtn).attr("data-original-title", "Remove connection");
		$(thisbtn).find("i").attr("class", "fa fa-chain");
		$(thisbtn).find("i").prop("style").color = "#a9d86e";
		break;
	case "conRequest":
		$(thisbtn).attr("data-original-title", "Connection request sent Click to cancel the request");
		$(thisbtn).find("i").attr("class", "fa fa-chain");
		$(thisbtn).find("i").prop("style").color = "#71B9E7";
		break;
	default: console.log("code block default connStatusReset")
	} 
}

function modifyConnStatus(name, userId, status, thisbtn){
	var jsonObject		  = new Object();
	jsonObject.userConnId = userId;
	
	switch(status) {
    case "nonConnStatus":
    	var data = ajaxCall('GET', '/blueloop-backend/user/connetUsers/', jsonObject, "text/json", "json", false);
    	$(thisbtn).attr("data-original-title", "Connection request sent Click to cancel the request");
    	$(thisbtn).find("i").attr("class", "fa fa-chain");
    	$(thisbtn).find("i").prop("style").color = "#71B9E7";
    	$(thisbtn).attr("onclick", "modifyConnStatus('" + name +"'," + userId + ",'conRequest', this)");
    	$(thisbtn).find("label").text("conRequest");
    	$("#ribbon" + userId).append('<div class="ribbon ribbon-small ribbon-black"><div class="banner"><div class="text" style="opacity: 0.94;">Pending</div></div></div>');
    	dialogConfirm('Connection request sent ', '../images/btn/add_user.png', name);
    	sendNotification(data);
        break;
    case "connStatus":
    	var data = ajaxCall('GET', '/blueloop-backend/user/disConnetUsers/', jsonObject, "text/json", "json", false);
    	$(thisbtn).attr("data-original-title", "Send contact request to this user");
    	$(thisbtn).find("i").attr("class", "fa fa-chain-broken");
		$(thisbtn).find("i").prop("style").color = "#ff6c60";
		$(thisbtn).attr("onclick", "modifyConnStatus('" + name +"'," + userId + ",'nonConnStatus', this)");
		$(thisbtn).find("label").text("nonConnStatus");
		$("#ribbon" + userId).find(".ribbon").remove();
    	dialogConfirm('Connection successfully removed', '../images/btn/delete_user.png', name);
        break;
    case "conRequest":
    	var data = ajaxCall('GET', '/blueloop-backend/user/cancelUserRequest/', jsonObject, "text/json", "json", false);
    	$(thisbtn).attr("data-original-title", "Send contact request to this user");
    	$(thisbtn).find("i").attr("class", "fa fa-chain-broken");
		$(thisbtn).find("i").prop("style").color = "#ff6c60";
		$(thisbtn).attr("onclick", "modifyConnStatus('" + name +"'," + userId + ",'nonConnStatus', this)");
		$(thisbtn).find("label").text("nonConnStatus");
		$("#ribbon" + userId).find(".ribbon").remove();
    	dialogConfirm('Connection request deleted', '../images/btn/delete_user.png', name);
    	sendCancelConnectionNotification(data);
    	break;
    default: console.log("code block default - modifyConnStatus")
	} 
}

function sendNotification(data){
	realtime.publishChannel(sessionUser.get("pubnubChannel"), 
			{type:		"NewConnectionRequest",
			 user:		data.userReceiver.id,
			 userName:	data.userReceiver.name,
			 user2:		data.userSender.id,
			 user2Name:	data.userSender.name,
			 alert:		{date:		  data.createDate,
				 		 description: data.alert.description,
				 		 id: 		  data.alert.id,
				 		 name: 		  data.alert.name					 
			 			},
			 userAlertId: data.userAlert.id
			}); 
}

function sendCancelConnectionNotification(data){
	realtime.publishChannel(sessionUser.get("pubnubChannel"), 
			{type:		"CancelConnectionRequest",
			 user:		data.userAlert.receiver.id,
			 user2:		data.userAlert.sender.id,
			 userAlert: data.userAlert.id
			}
	); 
}

function dialogConfirm(title, image, name){	
	$.extend($.gritter.options, { 
	    position: 'bottom-right',// defaults to 'top-right' but can be 'bottom-left', 'bottom-right', 'top-left', 'top-right' (added in 1.7.1)
		fade_in_speed: 'medium', // how fast notifications fade in (string or int)
		fade_out_speed: 1000, 	 // how fast the notices fade out
		time: 6000 				 // hang on the screen for...
	});
	
	$.gritter.add({		
		title: title, 		 // (string | mandatory) the heading of the notification		
		text: "to: " + name, // (string | mandatory) the text inside the notification		
		image: image, 		 // (string | optional) the image to display on the left		
		sticky: false, 		 // (bool | optional) if you want it to fade out on its own or just sit there
		class_name: "gritter-light",
		before_open: function(){
			if($('.gritter-item-wrapper').length == 3){
				return false; // Returning false prevents a new gritter from opening
			}
		}
	}); 
}

function initSearch(){	
    $(".info").tooltip({
		show: null,
		position: {
			my: "left top",
			at: "left bottom"
		},
		open: function( event, ui ) {
			ui.tooltip.animate({ top: ui.tooltip.position().top + 10 }, "fast" );
		}
	});

	$('.dropdown-toggle').dropdown();
}