function Timeline() {

	var that = this;
	that.view = $("#");
	
	//Esto estaba en el gsp, revisar si se necesita...
	//<g:javascript>var TimelineDataSet = ${timeline as grails.converters.JSON};</g:javascript>
    
	that.init = function() {
		$('#search-timeline').keyup(function(e) {
			that.searchTimeline($("#search-timeline").val());
		});
		
		$('#seeMoreTimeline').click(function(e) {
		    var jsonSearch = new Object();
		    jsonSearch.idChain = $("#idChain").text();	    
		    TimelineDataSet = ajaxCall('GET', '/blueloop-backend/timeline/showAllTimeline/', jsonSearch, "text/json", "json", false);
		    that.searchTimeline("");
		});
		
		$('#btnSendTimeline').click(function(e) {
			addTimelineMessage();
		});				
    }

	that.searchTimeline= function(searchWord){
		$("#timeline_content").html("");		
	    var stringHtml="";
		$.each(TimelineDataSet, function(i, item){				
			if(item[0].message.toLowerCase().indexOf(searchWord.toLowerCase())!=-1 || item[0].creationDate.toString().toLowerCase().indexOf(searchWord.toLowerCase())!=-1 || item[1].firstName.toLowerCase().indexOf(searchWord.toLowerCase())!=-1 || item[1].lastName.toLowerCase().indexOf(searchWord.toLowerCase())!=-1 ) {				
				stringHtml += new EJS({url: '/blueloop-backend/static/js/ejsTemplates/timelineContent.ejs'}).render({item:item[0],user:item[1]});
			}
	    });
		$(stringHtml).appendTo("#timeline_content");			
	}
	
	function addTimelineMessage(){	
        var jsonObject = new Object();
    	jsonObject.chainId = $("#idChain").text().trim();
    	jsonObject.message = $("#timelineMessage").val().trim();
    	jsonObject.type    = 2;
    	 	
    	var message = ajaxCall('GET', '/blueloop-backend/timeline/addTimelineMessage/', jsonObject, 'application/json; charset=utf-8', "json", false);
		if (message.result == true){
			toastr.success(json.loop.messageSend);
	    	$("#timelineMessage").val("");
	    	
	    	$.each(message.timeline, function(i, item){	
	    		var firstName = message.timeline[i][1].firstName;
	    		var lastName  = message.timeline[i][1].lastName;
	    		message.timeline[i][1] = {};
	    		message.timeline[i][1].firstName = firstName;
	    		message.timeline[i][1].lastName  = lastName;
	    	});
	    	realtimeTimeline(message.timeline);	    	
		}    	
    }
	
	function realtimeTimeline(timelineData){
		var chainId= $("#idChain").text().trim();
		realtime.publishChannel(sessionUser.get("pubnubChannel"), {type:"TimelineUpdate", chainId:chainId, message:JSON.stringify(timelineData)});
	}	
}

$().ready(function() {
	window.timeline = new Timeline();
	timeline.init();
});