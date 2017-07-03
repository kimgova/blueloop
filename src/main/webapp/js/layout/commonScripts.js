/* ========================================================================
 * Make calls to backend
 * Parameters: 
 * 		pType: "GET" - "POST"... 
 * 		pUrl: "/blueloop/..."
 * 		pJsonObject: Json Object with data
 * 		pContentType: "text/json"
 * 		pDataType: "json"
 * 		pAsync: true - false
 * ======================================================================== */
function ajaxCall(pType, pUrl, pJsonObject, pContentType, pDataType, pAsync){
	var pData;
	var authorizationToken = $("meta[name='_csrf']").attr("content");
	var authorizationUri   = $("meta[name='_csrf_header']").attr("content");
	$.ajax({
        type: pType,
        beforeSend: function (request)
        {
            request.setRequestHeader("authorizationToken", authorizationToken);
            request.setRequestHeader("authorizationUri", authorizationUri);
        },
        url: pUrl,
        data: pJsonObject,
        contentType: pContentType,
        dataType: pDataType,
        async: pAsync,
        success: function(data) {
        	pData = data;
        },
    	error: function(httpRequest, textStatus, errorThrown) {
    		toastr.error(httpRequest.responseJSON.error);
     	}
    });
	return pData;
}

$.fn.serializeObject = function(){
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};


$().ready(function() {
	/* ========================================================================
	 * Chat Component
	 * ======================================================================== */
	window.chat = new Chat();
	
	/* ========================================================================
	 * Lock Screen Component
	 * ======================================================================== */
	lockScreen.valState();
	lockScreen.startTimers();

});


/* ========================================================================
 * Variable for activate loader in pages load
 * ======================================================================== */
var showloader = true;

/* ========================================================================
 * Toastr Plugin Conf
 * ======================================================================== */
toastr.options = {
  "closeButton": true,
  "debug": false,
  "progressBar": false,
  "positionClass": "toast-bottom-right",
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

/* ========================================================================
 * Miscellaneous
 * ======================================================================== */
$(function() {
	
	$("html").niceScroll({styler:"fb",cursorcolor:"#A1B2BD", cursorwidth: '3', cursorborderradius: '10px', background: '#404040', spacebarenabled:false,  cursorborder: '', zindex: '1000', cursoropacitymin: 0.8});

    $('.popovers').popover();
	
	$('.tooltips').tooltip();
	
	$(document.body).tooltip({ selector: '[data-toggle="tooltip"]' });
	
	$(document).on('contextmenu' , function(event){
	    event.preventDefault();
	    
	}); 

	$('#menu_forescast').click(function(e) {
		localStorage.setItem('loopId','all');
	});
	
	$("body").keypress(function(e) {
        if (e.which == 13) {
            return false;
        }
    });
	
	//TODO Sidebar JS File
    $('#nav-accordion').dcAccordion({
        eventType: 'click',
        autoClose: true,
        saveState: false,
        disableLink: true,
        speed: 'fast',
        showCount: false,
        autoExpand: true,
        classExpand: 'dcjq-current-parent'
    });
    
//    $('#nav-language').dcAccordion({
//        eventType: 'click',
//        autoClose: false,
//        saveState: true,
//        disableLink: true,
//        speed: 'fast',
//        showCount: false
//    });
    
//    var activeurl = window.location.pathname;
//    var patt      = new RegExp("search/results");
       
//    var navBrowser
//    if (navigator.userAgent.search("MSIE") >= 0){//MS Internet Explorer
//    	navBrowser = 1
//    } else if (navigator.userAgent.search("Chrome") >= 0){ //Google Chrome
//    		navBrowser = 2
//    	} else if (navigator.userAgent.search("Firefox") >= 0){ //Mozilla Firefox 
//    			navBrowser = 3
//    		} else if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0){ //Apple Safari
//    				navBrowser = 4
//    			} else if (navigator.userAgent.search("Opera") >= 0){ //Opera
//    					navBrowser = 5
//    				} else{	
//    						navBrowser = 6
//    					}

    //TODO to SidebarController.js
    jQuery('#sidebar .sub-menu > a').click(function () {
        var o = ($(this).offset());
        diff = 250 - o.top;
        if(diff>0)
            $("#sidebar").scrollTo("-="+Math.abs(diff),500);
        else
            $("#sidebar").scrollTo("+="+Math.abs(diff),500);
    });

    //    sidebar toggle
    var is_mini_menu_rigth = false; //is mini-menu activated

    //	localStorage mini_menu item storage if the menu is open or not   
    $(function() {
        function responsiveView() {
            var wSize = $(window).width();
            if (wSize <= 768) {
                $('#container').addClass('sidebar-close');
                $('#sidebar').removeAttr('style');
                $('#sidebar > ul').hide();
                localStorage.setItem('mini_menu','true');
            }
            if (localStorage.getItem('mini_menu') == "true") {
            	$('#main-content').css({'margin-left': '55px'});
                $('#sidebar').removeAttr('style');
                $('#sidebar').css({'margin-left': '0px'});
                $("#container").addClass("sidebar-closed");
                $("#sidebar").addClass("mini-menu");
                $('#sidebar > ul').show();
                localStorage.setItem('mini_menu','true');
            }            
            if (wSize > 768 && (localStorage.getItem('mini_menu') == "null" || localStorage.getItem('mini_menu') == "false")) {
                $('#container').removeClass('sidebar-close');
                $('#sidebar > ul').show();
                localStorage.setItem('mini_menu','false');
            }
        }
        $(window).on('load', responsiveView);
        $(window).on('resize', responsiveView);
    });
    
	//TODO to sidebarController.js
	// custom scrollbar
    $("#sidebar").niceScroll({styler:"fb",cursorcolor:"#A1B2BD", cursorwidth: '3', cursorborderradius: '10px', background: '#404040', spacebarenabled:false, cursorborder: ''});
    
    //TODO to analisis module....
    // custom bar chart
    if ($(".custom-bar-chart")) {
        $(".bar").each(function () {
            var i = $(this).find(".value").html();
            $(this).find(".value").html("");
            $(this).find(".value").animate({
                height: i
            }, 2000)
        })
    }
    
    $("input").keyup(function(e) {
		$(this).val($(this).val().replace("<",""));
    	$(this).val($(this).val().replace(">",""));
	});	

});
