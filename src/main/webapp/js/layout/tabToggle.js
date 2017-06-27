$( document ).ready(function() {
	
	var transitionTime = "fast";
	var maxRight = "15%";
	var minRight = "0";
	var tabName = "";
	var panelName = "";

	$.each($('.left-panel-btn'), function(index, tab) {
		$(tab).on('click', function(e) {
			e.preventDefault();
		});
		$(tab).css("margin-top", ((index) * 3) + "%");
	});

	$('#tab_intern').toggle(function() {
		$('#tab_intern').stop().animate({
			right : maxRight
		}, transitionTime, function() {
			$('#panel_toolkit').addClass('expandida');
		});

		$('#panel_toolkit').show().stop().animate({
			width : maxRight
		}, transitionTime);
	},

	function() {
		$('#panel_toolkit').show().stop().animate({
			width : minRight
		}, transitionTime);

		$('#tab_intern').stop().animate({
			right : minRight
		}, transitionTime, function() {
			$('#panel_toolkit').removeClass('expandida');
		});
	});

	//NewUI: This function went to js/layout/header/view/userNavBarView.js
	$('#tab_chat').toggle(function() {
		$('#tab_chat').stop().animate({
			right : maxRight
		}, transitionTime, function() {
			$('#panel_chat_menu').addClass('expandida');
			$("#tab_chat").css("background", "#2A3542");
		});

		$('#panel_chat_menu').show().stop().animate({
			width : maxRight
		}, transitionTime);
	},

	function() {
		$('#panel_chat_menu').show().stop().animate({
			width : minRight
		}, transitionTime);

		$('#tab_chat').stop().animate({
			right : minRight
		}, transitionTime, function() {
			$('#panel_chat_menu').removeClass('expandida');
		});
	});

});
