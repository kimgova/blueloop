function InOutActivitiesController() {

	var that = this;
	var idSelectedBB;
	var outputActivTable;
	var inputActivTable;
	var nEditingInput  = [];
	var nEditingOutput = [];
	that.objectTemplate = {};
	that.template = "/blueloop/static/js/buildingBlock/view/inOutActivitiesView.ejs";
	that.staticImgUrl = "";
	
	that.init = function() {
		that.objectTemplate = {btnCancel:false,btnSave:false,btnChooseImg:false,btnSaveOut:false,inputDes:false,img:false,btnDelete:false,
								btnEdit:false,selectInOutAct:false,dataMode:"",id:"",idBtn:"",filePath:"",fileName:"",value:""};
		bindEvents();
	}
	
	function bindEvents() {		
		$(document).on('click', '#inputActivityNew', function(e){
			createNewInputRow(e);
		 });
		
		$(document).on('click', '#cancelInputActi', function(e){
			deleteNewRow(e,this,true);
		});
		
		$(document).on('click', '#editInputActi', function(e){
			editInputRow(e,this);
		});
		
		$(document).on('click', '#saveInputActi', function(e){
			editInputRow(e,this);
		});
		
		$(document).on('click', '#deleteInputActi', function(e){
			deleteRow(e,this,true);
		});
			
		$(document).on('click', '#outputActivityNew', function(e){
			createNewOutputRow(e);
		});
		
		$(document).on('click', '#cancelOutputActi', function(e){
			deleteNewRow(e,this,false);
		});
		
		$(document).on('click', '#editOutputActi', function(e){
			editOutputRow(e,this);
		});
		
		$(document).on('click', '#saveOutputActi', function(e){
			editOutputRow(e,this);
		});
		
		$(document).on('click', '#deleteOutputActi', function(e){
			deleteRow(e,this,false);
		});
		
		$(document).on('click', '#chooseImgActInput', function(e){
			$("#image_chooser_modal").remove();	
	    	var modalView = new imageChooserModalView({context:window.inOutActivitiesController, imageType:2});
	    	modalView.render().$el.modal({backdrop: 'static',keyboard: false});
	    	
			setValueModalImgSelection(this,true);
		});
		
		$(document).on('click', '#chooseImgActOutput', function(e){
			$("#image_chooser_modal").remove();	
	    	var modalView = new imageChooserModalView({context:window.inOutActivitiesController, imageType:2});
	    	modalView.render().$el.modal({backdrop: 'static',keyboard: false});
	    	
			setValueModalImgSelection(this,false);
		});			
	}

	that.createTableActivities = function(idBB){
		idSelectedBB = idBB;	
		getActivityByBB(idBB);
	}

	function getActivityByBB(idBB){
		var jsonObject = new Object();
		jsonObject.idBB = idBB;
		var data = ajaxCall('GET','/blueloop/activityBuildingBlock/getAllActivitiesByBB/', jsonObject, "text/json", "json", false);
		var listActivities = data.listActivities;
		that.staticImgUrl = data.staticImgUrl;
		var listInputActivities  = [];
		var listOutputActivities = [];
		
		$(listActivities).each(function (index) {
			if (this.type == 0){     //input
				listInputActivities.push(this);
			}else if (this.type == 1){ 	//output
				listOutputActivities.push(this);
			};
		});
		moreInfoToTableActi(listActivities);
		setTbodyInputActivTable(listInputActivities);
		setTbodyOutputActivTable(listOutputActivities);	
	}

	function moreInfoToTableActi(listActivities){
		for(i=0; i<listActivities.length;++i){
			listActivities[i].filePath = new EJS({url:that.template}).render(cloneDataForm(["img"],{fileName:listActivities[i].fileName,
													filePath:that.staticImgUrl + listActivities[i].fileName}));
			if ( listActivities[i].type == 0 ){ 		//input
				listActivities[i].action = new EJS({url:that.template}).render(cloneDataForm(["btnDelete","btnEdit"],{id:"deleteInputActi",idBtn:'editInputActi'}));
			}else if ( listActivities[i].type == 1 ){ 	//output
				listActivities[i].action = new EJS({url:that.template}).render(cloneDataForm(["btnDelete","btnEdit"],{id:"deleteOutputActi",idBtn:'editOutputActi'}));
			}
		}
	}
	
	function setTbodyInputActivTable(listInputActivities){	
		inputActivTable = $('#tableInputActivities').DataTable( {
			"autoWidth"		: false,
			"scrollCollapse": true,
			"paging"		: false,
			"processing"	: true,
			"data"			: listInputActivities,
			"destroy"		: true,
			"jQueryUI"		: false,
			"select"		: false,
			"columnDefs"	: [	{ "orderable": false, "targets": [ 0,2,3,5,6 ] },
			              		{ "visible": false, "targets": [ 3,4,5,6 ] },
			              		{ "className": "center", "targets": [ 0,1,2 ] }],
			"columns"		: [	{ "data": 'filePath'},
								{ "data": 'description'},
								{ "data": 'action'},
								{ "data": 'id'},
			           			{ "data": 'idBuildingB'},
								{ "data": 'type'},
								{ "data": 'fileName'}]
		});
		var rowsInput = inputActivTable.rows();
		$.each( rowsInput, function( key, row ) {
			nEditingInput.push(row);
		});
	}
	

	function setTbodyOutputActivTable(listOutputActivities) {
		outputActivTable = $('#tableOutputActivities').DataTable( {
			"autoWidth"		: false,
			"scrollCollapse": true,
			"paging"		: false,
			"processing"	: true,
			"data"			: listOutputActivities,
			"destroy"		: true,
			"jQueryUI"		: false,
			"select"		: false,
			"columnDefs"	: [	{ "orderable": false, "targets": [ 0,2,3,5,6 ] },
			              		{ "visible": false, "targets": [ 3,4,5,6 ] },
			              		{ "className": "center", "targets": [ 0,1,2 ] }],
			"columns"		: [	{ "data": 'filePath'},
								{ "data": 'description'},
								{ "data": 'action'},
								{ "data": 'id'},
			           			{ "data": 'idBuildingB'},
								{ "data": 'type'},
								{ "data": 'fileName'}]
		});
		var rowsOutput = outputActivTable.rows();
		$.each(rowsOutput, function(key, row) {
			nEditingOutput.push(row);
		});
	}

	function createNewInputRow(e){
		e.preventDefault();
		var newData = {
			 id			 : null, 
			 action		 : new EJS({url:that.template}).render(cloneDataForm(["btnCancel","btnSave"],{dataMode:'data-mode="new"',id:"cancelInputActi"})),
			 description : new EJS({url:that.template}).render(cloneDataForm(["inputDes"])), 
			 fileName	 : 'images/activities/activitiesGeneral/Inspection.png',
			 filePath	 : new EJS({url:that.template}).render(cloneDataForm(["btnChooseImg"],{id:'chooseImgActInput'})),
			 idBuildingB : idSelectedBB, 
			 type:'0'
		 };

		var aiNew = inputActivTable.row.add(newData).draw().node();
		nEditingInput.push(aiNew);
	}

	function createNewOutputRow(e){
		 e.preventDefault();
		 var newData = {
			 id			 : null,
			 action		 : new EJS({url:that.template}).render(cloneDataForm(["btnCancel",'btnSaveOut'],{id:"cancelOutputActi",dataMode:'data-mode="new"'})), 
			 description : new EJS({url:that.template}).render(cloneDataForm(["inputDes"])), 
			 fileName	 : 'images/activities/activitiesGeneral/Inspection.png', 
			 filePath	 : new EJS({url:that.template}).render(cloneDataForm(["btnChooseImg"],{id:'chooseImgActOutput'})), 
			 idBuildingB : idSelectedBB, 
			 type		 : '1'
		 };
		 
	   var aiNew = outputActivTable.row.add(newData).draw().node();
	   nEditingOutput.push(aiNew);
	}

	function editRow(oTable, nRow, isInput) {
		var aData = oTable.row(nRow).data();
		
		var jqTds	= $('>td', nRow);
		jqTds[1].innerHTML = new EJS({url:that.template}).render(cloneDataForm(["inputDes"],{value:aData.description}));
		if ( isInput ){
			jqTds[0].innerHTML = new EJS({url:that.template}).render(cloneDataForm(["btnChooseImg","img"],{id:'chooseImgActInput',fileName:aData.fileName,
											filePath:that.staticImgUrl + aData.fileName}));
			jqTds[2].innerHTML = new EJS({url:that.template}).render(cloneDataForm(["btnCancel","btnSave"],{id:"cancelInputActi"}));
			
			nEditingInput  = [];
			nEditingInput.push(nRow);
		}else{
			jqTds[0].innerHTML = new EJS({url:that.template}).render(cloneDataForm(["btnChooseImg","img"],{id:'chooseImgActOutput',fileName:aData.fileName,
											filePath:that.staticImgUrl + aData.fileName}));
			jqTds[2].innerHTML = new EJS({url:that.template}).render(cloneDataForm(["btnCancel",'btnSaveOut'],{id:"cancelOutputActi"}));
			
			nEditingOutput  = [];
			nEditingOutput.push(nRow);
		}
		
		
	}

	function editInputRow(e,context){
		 e.preventDefault();
		 var nRow = $(context).parents('tr')[0];

		 if ( $(context).attr("id") == "saveInputActi") {
			 $.each( nEditingInput, function( key, row ) {
				 if (row == nRow){
					 saveRowActi(inputActivTable, row, true);
				 }
			 });
		 }else{
			 $.each( nEditingInput, function( key, row ) {
				 if (row != nRow) {
					 restoreRow(inputActivTable, row);
					 editRow(inputActivTable, nRow, true);
				 }else{
					 editRow(inputActivTable, nRow, true);
				 }
			 });
		 }
	}

	function editOutputRow(e,context){
		e.preventDefault();
	   	var nRow = $(context).parents('tr')[0];

		if ( $(context).attr("id") == "saveOutputActi") {
			$.each( nEditingOutput, function( key, row ) {
				if (row == nRow){
					saveRowActi(outputActivTable, row, false);
				}
			});
		}else{
			$.each( nEditingOutput, function( key, row ) {
				if (row != nRow) {
					restoreRow(outputActivTable, row);
					editRow(outputActivTable, nRow, false);
				}else{
					editRow(outputActivTable, nRow, false);
				}
			});
		}
	}

	function saveRowActi(oTable, nRow, isInput) {
		var jqInputs  = $('input', nRow);
		var jqImg  = $('img', nRow);
		
		if(isInput){
			var aData = inputActivTable.row(nRow).data();
		}else{
			var aData = outputActivTable.row(nRow).data();
		}
		
		var dataInputOut = new Object();
		dataInputOut.id		  = aData.id;
		dataInputOut.idBuildingB = idSelectedBB;
		dataInputOut.description = jqInputs[0].value;
		
		if( $(jqImg[0]).attr("filename") ){
			aData.fileName = $(jqImg[0]).attr("filename");
		}
		dataInputOut.fileName	= aData.fileName;
		if(isInput){
			dataInputOut.type   = 0;
			dataInputOut.action = new EJS({url:that.template}).render(cloneDataForm(["btnDelete","btnEdit"],{id:"deleteInputActi",idBtn:'editInputActi'}));
		}else{
			dataInputOut.type   = 1;
			dataInputOut.action = new EJS({url:that.template}).render(cloneDataForm(["btnDelete","btnEdit"],{id:"deleteOutputActi",idBtn:'editOutputActi'}));
		}
		var data = {activity:dataInputOut};
		var dataAjax = ajaxCall('POST', '/blueloop/activityBuildingBlock/saveActivityByBB/', JSON.stringify(data), 'application/json; charset=utf-8', "json", false);
		dataInputOut.id = dataAjax.id;
		dataInputOut.idBuildingB = dataAjax.buildingBlock.id;
		dataInputOut.filePath	=  new EJS({url:that.template}).render(cloneDataForm(["img"],{fileName:dataAjax.fileName,
											filePath:that.staticImgUrl + dataAjax.fileName}));
		
		oTable.row(nRow).data(dataInputOut);
	    oTable.draw();
		toastr.success(json.activity.created);
	}

	function deleteRow(e, context, isInput) {
		e.preventDefault();
		bootbox.confirm(json.activity.confirmDelete,function(e) {
			if (e) {
				var nRow = $(context).parents('tr')[0];
				if (isInput) {
					var aData = inputActivTable.row(nRow).data();
				} else {
					var aData = outputActivTable.row(nRow).data();
				}
				var jsonObject = new Object();
				jsonObject.idActivity = aData.id;
				jsonObject.idBB = idSelectedBB;
				var dataAjax = ajaxCall('GET','/blueloop/activityBuildingBlock/deleteActivityByBB/',jsonObject, "text/json", "json", false);
				if (dataAjax.message != undefined) {
					toastr.error(json.activity.notDeleted + " " + dataAjax.message);
				} else {
					if (isInput) {
						inputActivTable.rows(nRow).remove().draw();
					} else {
						outputActivTable.rows(nRow).remove().draw();
					}
					toastr.success(json.activity.deleted);
				}
			}
		});
	}

	function deleteNewRow(e, context, isInput) {
		e.preventDefault();
		var nRow = $(context).parents('tr')[0];
		if ($(context).attr("data-mode") == "new") {
			if (isInput) {
				inputActivTable.rows(nRow).remove().draw();
			} else {
				outputActivTable.rows(nRow).remove().draw();
			}
		} else {
			if (isInput) {
				$.each(nEditingInput, function(key, row) {
					if (row == nRow)
						restoreRow(inputActivTable, row);
				});
			} else {
				$.each(nEditingOutput, function(key, row) {
					if (row == nRow)
						restoreRow(outputActivTable, row);
				});
			}
		}
	}

	function restoreRow(oTable, nRow) {
		oTable.row(nRow).data(oTable.row(nRow).data());
	    oTable.draw();
	}

	function setValueModalImgSelection(context,isInput){
		var nRow = $(context).parents('tr')[0];
		var rowPosition = null;
		
		if(isInput){
			$("#tableInputActivities tbody tr").each(function(index,row){
				if(nRow == row)
					rowPosition = index;
			});
			$("#inputOutputAct").val("input");
		}else{
			$("#tableOutputActivities tbody tr").each(function (index,row) {
				if(nRow == row)
					rowPosition = index;
			});
			$("#inputOutputAct").val("output");
		}
		$("#fnGetPosition").val(rowPosition);
	}

	that.setSelectedImage = function(modelImage){
		$("#selectedInOutAct").remove();
		updateRowWithImg(modelImage);
	}
	
	function updateRowWithImg(modelImage){
		var tableInputOuput,inputOutputActivTable,button, img, chooseImgActInputOutput;

		if ($("#inputOutputAct").val() == "input"){
			tableInputOuput 	  	= '#tableInputActivities';
			inputOutputActivTable 	= inputActivTable;
			chooseImgActInputOutput = '#chooseImgActInput';
			img						= new EJS({url:that.template}).render(cloneDataForm(["btnChooseImg","img"],{id:'chooseImgActInput',fileName:modelImage.get("key"),filePath:modelImage.get("filePath")}));
			button					= new EJS({url:that.template}).render(cloneDataForm(["btnCancel","btnSave"],{id:"cancelInputActi"}));
		}else{
			tableInputOuput 		= '#tableOutputActivities';
			inputOutputActivTable 	= outputActivTable;
			chooseImgActInputOutput = '#chooseImgActOutput';
			img    					= new EJS({url:that.template}).render(cloneDataForm(["btnChooseImg","img"],{id:'chooseImgActOutput',fileName:modelImage.get("key"),filePath:modelImage.get("filePath")}));
			button 					= new EJS({url:that.template}).render(cloneDataForm(["btnCancel",'btnSaveOut'],{id:"cancelOutputActi"}));
		}
		
		$(tableInputOuput+" tbody tr").each(function (index,row) {
			if ( $("#fnGetPosition").val() == index ){
				var ntr = $(this).find(chooseImgActInputOutput).parents('tr')[0];
				var jqInputs  = $('input', ntr);
				var jqTds    = $('>td', ntr);
				jqTds[1].innerHTML = new EJS({url:that.template}).render(cloneDataForm(["inputDes"],{value:jqInputs[0].value}));
				jqTds[0].innerHTML = img;
				jqTds[2].innerHTML = button;
			}
		});
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
	window.inOutActivitiesController = new InOutActivitiesController();
	inOutActivitiesController.init();
});