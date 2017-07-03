/**
 * Class: ExitDialog.js
 * Date: 06/08/14
 * Description:
 */

function ExitDialog() {

	var that = this;
	var $template;
	that.trigger;
	that.triggerMenuRef;
	that.alertId;
    
	that.init = function() {
		$template = $(new EJS({url: "/blueloop/static/js/loop/create_edit/view/ExitModalView.ejs"}).render({}));
		$template.delegate('button', 'click', btnAction);
    }
    
    function btnAction(e) {
    	switch ($(e.target).attr('id')){    		
			case "saveChain":
				chain.saveChain();
//				FormController.saveInBD(chain.getId());
				if(that.trigger == "menu" )
					window.location.assign(that.triggerMenuRef);
				else{
					if(that.trigger == "execution")
						window.location.assign("/blueloop/chain/execution/" + $("#idChain").text().trim());
					else{
						if(that.trigger != "alert")
							window.location.assign("/blueloop/chain/list");						
						else{						
							updateAlert(that.alertId);
							window.location.assign(that.triggerMenuRef);						 
						}
					}
				}
					
			break;
			
			case "noSaveChain":
				if(that.trigger == "menu" )
					window.location.assign(that.triggerMenuRef);
				else{
					if(that.trigger == "execution")
						window.location.assign("/blueloop/chain/execution/" + $("#idChain").text().trim());
					else{
						if(that.trigger != "alert")
							window.location.assign("/blueloop/chain/list");						
						else{						
							updateAlert(that.alertId);
							window.location.assign(that.triggerMenuRef);						 
						}
					}
				}
				
			break;		
    	} 
    }
    function updateAlert(alertId) {		
    	var jsonObjectUA = new Object();
		jsonObjectUA.idUserAlert = alertId;
		var result = ajaxCall('GET', '/blueloop/user/changeNotificationAlertState/', jsonObjectUA, "text/json", "json", false);	
    }
    
    that.showDialog = function() {
    	$template.modal("show");
    }
    
    that.hideDialog = function() {
    	$template.modal("hide");
    }
}

$().ready(function() {
	window.exitDialog = new ExitDialog();
	exitDialog.init();
});
