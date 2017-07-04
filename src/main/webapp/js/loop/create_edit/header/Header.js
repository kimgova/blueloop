/**
 * Class: Header.js
 * Date: 06/08/14
 * Description:
 */

function Header() {

	var that = this;
	that.view = $(".header");
    
	that.init = function() {
		$(that.view).find('#header_inbox_bar ul li a').click(lnkAction);		
		$('.alertNotification').unbind('click'); //prevent click event for notifications
		$(that.view).find('#header_notification_bar ul li a').click(lnkAction);		
		$(that.view).find('ul.dropdown-menu li a').click(lnkAction);
		$(that.view).find('a.logo').click(lnkAction);
    }
    
    function lnkAction(e) {  
    	 if (!e) e = window.event;
    	    if (e.preventDefault) {
    	        e.preventDefault();
    	    }
    	    
    	    exitDialog.triggerMenuRef = e.currentTarget.href;
    	    
    	    if(e.target.className == "alertNotification"){
    	    	exitDialog.trigger = "alert";
    	    	exitDialog.alertId = e.currentTarget.id;
    	    }else 
    	    	exitDialog.trigger = "menu";
  
			exitDialog.showDialog();
    }
        
}

$().ready(function() {
	window.menuHeader = new Header();
	menuHeader.init();
});
