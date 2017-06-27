function DayOffController() {
	
	var dayOffTable;
	var nEditingDayOff  = [];
	var that = this;
	var idSelectedBB;
	that.objectTemplate = {};
	that.template = "/blueloop-backend/static/js/buildingBlock/view/daysOffView.ejs";
	
	that.init = function() {
		that.objectTemplate = {tableDayOff:false,editDayOff:false,deleteDayOff:false,nameInputForm:false,startDateForm:false,finishDateForm:false,
								saveDayOff:false,cancelDayOff:false,labelError:false,editStartDate:false,editFinishDate:false,
								aDataName:"",date:"",cancel:"",dataMode:""};
		bindEvents();
    }
	
	function bindEvents() {
		
		//Days Off Module Actions
		$(document).on('click', '#dayOffNew', function(e){
			createNewDayOffRow(e);
		 });
		
		$(document).on('click', '#editDayOff', function(e){
			editDayOff(e,this);
		});
		
		$(document).on('click', '#cancelDayOff', function(e){
			deleteNewRowDayOff(e,this);
		});
		
		$(document).on('click', '#saveDayOff', function(e){
			var errors = validateFieldDayOff(this);
			if ( !errors ){	editDayOff(e,this);	}
		});
		
		$(document).on('click', '#deleteDayOff', function(e){
			deleteRowDayOff(e,this);
		});

	}
	
	/*Building Block DaysOff Module */
	that.createTableDayOff = function(idBB){
		idSelectedBB = idBB;
		$("#daysOff .row").remove();

		$("#daysOff").append(new EJS({url:that.template}).render(cloneDataForm(["tableDayOff"])));
		getDayOffByBB(idBB);
	}

	function getDayOffByBB(idBB){
		var jsonObject = new Object();
		jsonObject.idBB = idBB;
		var listDayOff = ajaxCall('GET','/blueloop-backend/dayOff/getAllDayOffByBB/', jsonObject, "text/json", "json", false);

		for(i=0; i<listDayOff.length;++i){
			listDayOff[i].action = new EJS({url:that.template}).render(cloneDataForm(["editDayOff","deleteDayOff"]));
			
			var reasonText = DAYOFF_REASON[listDayOff[i].reason.name].text;
			var reasonValue = DAYOFF_REASON[listDayOff[i].reason.name].value;
			listDayOff[i].reason = reasonText;
			listDayOff[i].reasonId = reasonValue;
		}
		setTbodyDayOffTable(listDayOff);
		var rows = dayOffTable.rows();
		$.each( rows, function( key, row ) {
			nEditingDayOff.push(row);
		});
	}

	//Function to set starting DataTable	
	function setTbodyDayOffTable(listDayOff){	
		dayOffTable = $('#tableDayOffByBB').DataTable( {
			"autoWidth"		: false,
		    "scrollCollapse": true,
		    "processing"	: true,
			"data"			: listDayOff,
			"destroy"		: true,
		    "jQueryUI"		: false,
		    "paging"		: false,
		    "select"		: false,
			"columnDefs": [{ "orderable": false, "targets": [ 5 ] },
			               { "targets": [ 0,1,6  ], "visible": false },
	              		   { "className": "center", "targets": [ 1,2,3,4,5 ] }],
			"columns": 	  [{ "data": 'id'},
			              { "data": 'idBuildingB'},
			              { "data": 'reason'},
			              { "data": 'startDate'},
			              { "data": 'finishDate'},
			              { "data": 'action'},
			              { "data": 'reasonId'}]
		});	
	}

	function createNewDayOffRow(e){
		e.preventDefault();
		var newData = {
			id:null, 
			idBuildingB:$("#idBB").val(),
			reason: new EJS({url:that.template}).render(cloneDataForm(["nameInputForm"],{reasonId:0})),
			startDate: new EJS({url:that.template}).render(cloneDataForm(["startDateForm"])),
			finishDate: new EJS({url:that.template}).render(cloneDataForm(["finishDateForm"])),
			action: new EJS({url:that.template}).render(cloneDataForm(["saveDayOff", "cancelDayOff"], {dataMode:'data-mode="new"'})),
			reasonId:0
		};
		var aiNew = dayOffTable.row.add(newData).draw().node();
		nEditingDayOff.push(aiNew)
		window.prettyPrint && prettyPrint();
		setDatePicker();
	}

	function setDatePicker(){
		var startdDayOff = $('.start').datetimepicker({
			format: 'dd/mm/yyyy hh:ii',
		    autoclose: true,
		    todayBtn: true,
		    pickerPosition: "bottom-left"
		});
		var endDayOff = $('.end').datetimepicker({
			format: 'dd/mm/yyyy hh:ii',
		    autoclose: true,
		    todayBtn: true,
		    pickerPosition: "bottom-left"
		});
		
		var startDate = new Date();
	    var endDate = new Date();
	    var nRow,jqInputs;
	    startdDayOff.on('changeDate', function(ev){
	    	nRow      = $(this).parents('tr')[0];
	    	jqInputs  = $('input', nRow);
	    	$(jqInputs[0]).parent().find("label").remove();
	    	$(jqInputs[1]).parent().find("label").remove();
	        if (ev.date.valueOf() > endDate.valueOf()){
	    		$(jqInputs[0]).parent().append(new EJS({url:that.template}).render(cloneDataForm(["labelError"],{'msgError':json.error.invalidStartDate})));
	    		resizeTableDayOff();
	        } else {
	            startDate = new Date(ev.date);
	            resizeTableDayOff();
	        }
	        $('.start').datepicker('hide');
	    });
	    endDayOff.on('changeDate', function(ev){
	    	nRow      = $(this).parents('tr')[0];
	    	jqInputs  = $('input', nRow);
	    	$(jqInputs[1]).parent().find("label").remove();
	    	$(jqInputs[0]).parent().find("label").remove();
	        if (ev.date.valueOf() < startDate.valueOf()){
	    		$(jqInputs[1]).parent().append(new EJS({url:that.template}).render(cloneDataForm(["labelError"],{'msgError':json.error.invalidEndDate})));
	    		resizeTableDayOff();
	        } else {
	        	endDate = new Date(ev.date);
	        	$(jqInputs[0]).parent().find("label").remove();
	        	resizeTableDayOff();
	        }
	        $('.end').datepicker('hide');
	    });
	}

	function deleteNewRowDayOff(e,context){
	    e.preventDefault();
	    if ( $(context).attr("data-mode") == "new" ) {
	        var nRow = $(context).parents('tr')[0];
	        dayOffTable.rows(nRow).remove().draw();
	    }else{
	    	var nRow = $(context).parents('tr')[0];
	    	$.each( nEditingDayOff, function( key, row ) {
	    		if ( row == nRow ){
	    			restoreRow(dayOffTable, row);
	    		}
	    	});
	    }
	    resizeTableDayOff();
	}

	function editDayOff(e,context){
		
		e.preventDefault();
		/* Get the row as a parent of the link that was clicked on */
		var nRow = $(context).parents('tr')[0];
		if ( $(context).attr("id") == "saveDayOff") {
			$.each( nEditingDayOff, function( key, row ) {
				if ( row == nRow ){
					saveRowDayOff(dayOffTable, row);
				}
			});
			return;
		}else{
			$.each( nEditingDayOff, function( key, row ) {
				if (row != nRow) {
					restoreRow(dayOffTable, row);
					editRowDayOff(dayOffTable, nRow);
				}else{
					editRowDayOff(dayOffTable, nRow);
				}
			});
		}
	}

	//Function makes a row editable 
	function editRowDayOff(oTable, nRow) {
	    var aData = oTable.row(nRow).data();
	    var jqTds = $('>td', nRow);
	    jqTds[0].innerHTML = new EJS({url:that.template}).render(cloneDataForm(["nameInputForm"],{reasonId:aData.reasonId}));
	    jqTds[1].innerHTML = new EJS({url:that.template}).render(cloneDataForm(["editStartDate"],{date:aData.startDate})); 
	    jqTds[2].innerHTML = new EJS({url:that.template}).render(cloneDataForm(["editFinishDate"],{date:aData.finishDate}));
		jqTds[3].innerHTML =  new EJS({url:that.template}).render(cloneDataForm(["saveDayOff", "cancelDayOff"], {'cancel':'cancel'}));
//		$('.dpYears').datepicker();	
		resizeTableDayOff();
		nEditingDayOff  = [];
		nEditingDayOff.push(nRow);
		
		setDatePicker();
	}

	function saveRowDayOff(oTable, nRow) {
	    var jqInputs  = $('input', nRow);
	    var jqSelects = $('select', nRow);
	    var aData = oTable.row(nRow).data();
	    
	    var dataDayOff = new Object();
	    dataDayOff.id              = aData.id;
	    dataDayOff.idBuildingB     = idSelectedBB;
	    dataDayOff.reason          = $(jqSelects[0]).find("option:selected").text();
	    dataDayOff.reasonId        = $(jqSelects[0]).find("option:selected").val();
	    dataDayOff.startDate       = jqInputs[0].value;
	    dataDayOff.finishDate      = jqInputs[1].value;
	    
		var data = {dayOff:dataDayOff};
		var dayOff = ajaxCall('POST', '/blueloop-backend/dayOff/saveDayOffByBB/', JSON.stringify(data), 'application/json; charset=utf-8', "json", false);
		dataDayOff.id = dayOff.id;
		dataDayOff.idBuildingB = idSelectedBB;
		dataDayOff.action     = new EJS({url:that.template}).render(cloneDataForm(["editDayOff","deleteDayOff"]));

	    oTable.row(nRow).data(dataDayOff);
	    oTable.draw();
	    toastr.success(json.bb.daysOffSaved);
	    resizeTableDayOff();
	}

	function resizeTableDayOff(){
		$('#tableDayOffByBB tr th').each(function(index,col){
			 if ( index == 0 ){
				 $(col).css("width","25%");
			 }else if ( index == 1 ){
				 $(col).css("width","30%");
			 }else if ( index == 2 ){
				 $(col).css("width","30%");
			 }else if ( index == 3 ){
				 $(col).css("width","15%");
			 }
		});
	}

	function deleteRowDayOff(e,context){
		e.preventDefault();
		
		bootbox.confirm(json.general.deleteRow, function (e) {
			if (e) {
				var nRow            = $(context).parents('tr')[0];   
				var aData           = dayOffTable.row(nRow).data();
				var jsonObject      = new Object();
				jsonObject.idDayOff = aData.id;
				jsonObject.idBB     = idSelectedBB;
				var dataAjax = ajaxCall('GET','/blueloop-backend/dayOff/deleteDayOffByBB/', jsonObject, "text/json", "json", false);
				dayOffTable.rows(nRow).remove().draw();
				toastr.success(json.bb.daysOffRemoved);
			} else {
				return;
			}
		});
	}

	function  validateFieldDayOff(context){
		var nRow = $(context).parents('tr')[0];
		var jqInputs  = $('input', nRow);
		var errors = false;
		
		if ( jqInputs[0].value == "" ){
			$(jqInputs[0]).parent().find("label").remove();
			$(jqInputs[0]).parent().append(new EJS({url:that.template}).render(cloneDataForm(["labelError"],{'msgError':json.general.fieldRequired}))); 	
			errors = true;
		}else if ( $(jqInputs[0]).parent().find("label").hasClass("error") ){
			errors = true;
		}
		
		if ( jqInputs[1].value == "" ){
			$(jqInputs[1]).parent().find("label").remove();
			$(jqInputs[1]).parent().append(new EJS({url:that.template}).render(cloneDataForm(["labelError"],{'msgError':json.general.fieldRequired}))); 	
			errors = true;
		}else if ( $(jqInputs[1]).parent().find("label").hasClass("error") ){
			errors = true;
		}
		
		return errors;
	}

	function restoreRow(oTable, nRow) {
	    var aData = oTable.row(nRow).data();
	    oTable.row(nRow).data(aData);
	    oTable.draw();
	}

	function cloneDataForm(actProperty, values) {
		var cloneObject = _.clone(that.objectTemplate);
		_.each(values,function(val,property){
			cloneObject[property] = val;
		});
		
		_.each(actProperty,function(act,i){
				cloneObject[act] = true;	
		});
		
		return cloneObject;
	}
	
	return that;
}

$().ready(function() {
	window.dayOffController = new DayOffController();
	dayOffController.init();
});