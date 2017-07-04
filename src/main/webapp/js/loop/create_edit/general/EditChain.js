/* ========================================================================
 * Begin of Create Loop Module
 * ======================================================================== */

$().ready(function() {
	
	json = JSON.parse(localStorage.getItem('jsLanguage'));
	$('.dropdown-toggle').dropdown();
	var idChain = $("#idChain").html();
	localStorage.setItem('firstTime','edit');
	localStorage.setItem('chainId',idChain);
	
	window.chain = new Chain();
	chain.init();
	
	$.fn.serializeObject = function()
	{
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
	
	setStyleProperties();
	
	$("#editTitleChain").click(function(){
		chain.openNameDialog($("#titleChain").text());
	});

	FormController.createForm("valve", "valve", true,false,false,{},0);
	FormController.createForm("responsible", "responsible", true,false,false,{},0);
	
	$("#add_btn").click(function(e){
		window.bbPanelView.openBBPanel(e);
	});
	
});

/* ========================================================================
 * Global Styles
 * ======================================================================== */
function setStyleProperties(){

	$('.search-bb-box').popover();
    
    $('#container').addClass("sidebar-closed");
    $("#sidebar").addClass("mini-menu");

    $('.tooltips').tooltip();
    
    $('.accordion_toolkit').accordion({ 
    	active: 0,
    	collapsible: true,
    	animate: 200,
    	heightStyle: "fill"
    });
    
}