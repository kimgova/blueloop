/**
 * Class: Menu.js
 * Date: 06/08/14
 * Description:
 */

function Menu() {

	var that = this;
	that.view = $(".sidebar-menu");
    
	that.init = function() {
		$(that.view).find('a').click(lnkAction);
    }
    
    function lnkAction(e) {  
    	 if (!e) e = window.event;
    	    if (e.preventDefault) {
    	        e.preventDefault();
    	    }    	    
    	    exitDialog.trigger = "menu";
    	    exitDialog.triggerMenuRef = e.currentTarget.href;
			exitDialog.showDialog();
    }
        
}

$().ready(function() {
	window.menu = new Menu();
	menu.init();
});
