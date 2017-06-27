$(function(){
    window.prettyPrint && prettyPrint();
    $('.default-date-picker').datepicker({
    	format: 'mm-dd-yyyy'
    });
    $('.dpYears').datepicker();
    $('.dpMonths').datepicker();

// 	disabling dates
    var nowTemp = new Date();
    var now 	= new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
    var startDate = new Date();
    var endDate = new Date();

    var checkin = $('.dpd1').datepicker({
    	onRender: function(date) {
    		return date.valueOf() < now.valueOf() ? 'disabled' : '';
    	}
    }).on('changeDate', function(ev) {
		updateReportURL();        
        if(checkout.date){
            if (ev.date.valueOf() > checkout.date.valueOf()) {
                var newDate = new Date(ev.date)
                newDate.setDate(newDate.getDate() + 1);
                checkout.setValue(newDate);
            }
        }
        checkin.hide();
        $('.dpd2')[0].focus();
    }).data('datepicker');

    var checkout = $('.dpd2').datepicker({
    	onRender: function(date) {
       // 	return date.valueOf() <= checkin.date.valueOf() ? 'disabled' : '';
    		return date.valueOf() <= checkin.datepicker("getDate").valueOf() ? 'disabled' : '';
    	}
    }).on('changeDate', function(ev) {
		updateReportURL();        
        checkout.hide();
    }).data('datepicker');


	$(".reportGenerator").click(function(){        
		$('#valErrors').find("label").remove();
		$("#reportType").val($(this).attr("id"))
		$("#generateReportTitle").html($(this).attr("name") + " - " + json.report.labelReport);
		updateReportURL();        
	});

	function updateReportURL(){
		$("#btnGenerate").attr("href","/blueloop-backend/analysis/generateReport?" +
	        							"idChain=" + $("#selectReportLoop").val() +
				  						"&startDate=" + $('.dpd1').val() + 
				  						"&endDate=" + $('.dpd2').val() + 
				  						"&type=" + $("#reportType").val());
	}
	
	$(document).on('change', '#selectReportLoop', function(e){
		updateReportURL();  
	});
	
	$(document).on('click', '#btnGenerate', function(e){
		var errors = validateReport( );
		if ( errors ){ 	e.preventDefault();	}
	});
	
	function validateReport(){
		var errors = false;
		$('#valErrors').find("label").remove();
	
		if($('.dpd1').val() == ""){
			errors = true;			
			$('#valErrors').append(new EJS({url: '/blueloop-backend/static/js/ejsTemplates/btnsReports.ejs'}).render({type:"errorStart"})); 	
		}
			
		if($('.dpd2').val() == ""){
			errors = true;
			$('#valErrors').append(new EJS({url: '/blueloop-backend/static/js/ejsTemplates/btnsReports.ejs'}).render({type:"errorEnd"})); 	
		}
	
		if($('.dpd1').val() != "" && $('.dpd2').val() != ""){
			if(isFromBiggerThanTo($('.dpd1').val(), $('.dpd2').val())){
				errors = true;
				$('#valErrors').append(new EJS({url: '/blueloop-backend/static/js/ejsTemplates/btnsReports.ejs'}).render({type:"errorDates"})); 	
				}
		}			
		return errors;
	}

    function isFromBiggerThanTo(dtmfrom, dtmto){
       return new Date(dtmfrom).getTime() >=  new Date(dtmto).getTime() ;
    }
});