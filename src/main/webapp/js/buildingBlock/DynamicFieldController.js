function DynamicFieldController() {
	
	var that = this;
	var fieldsTable;
	var nEditingField  = [];	
	var idBB;
	that.objectTemplate = {};
	that.template = "/blueloop-backend/static/js/buildingBlock/view/dynamicFieldView.ejs";
	
	that.init = function() {
		that.objectTemplate = {tableFields:false,btnsEdit:false,descriptionField:false,typeField:false,
								unitField:false,requiredField:false,btnsAction:false,required:false,labelError:false,
								description:"",type:"text",unit:"",cancel:"",msgError:"",dataMode:""};
		bindEvents();
    }
	
	function bindEvents() {
		
		$(document).on("click", "#editFields", function() {
			$("#editFieldsModal").modal("show");
			that.idBB = $(this).parent().find("#id").val();
			createTableFields();
			getFieldsByBB(that.idBB);
			resizeTableField();
		});
		
		$(document).on('click', '#newField', function(e){
			createNewFieldRow(e);
		 });
		
		$(document).on('click', '#editField', function(e){
			editField(e,this);
		});
		
		$(document).on('click', '#cancelField', function(e){
			deleteNewRowField(e,this);
		});
		
		$(document).on('click', '#saveField', function(e){			
			var errors = validateFields(this);
			if ( !errors ){
				editField(e,this);
				editBBController.setOperatingParameters(getBuildingBlock(that.idBB),new Object);
			}
		});
		
		$(document).on('click', '#deleteField', function(e){
			deleteRowField(e,this);				
		});
		
		$(document).on('change', 'select#typeField', function(e){
			var tr = $(this).parents('tr')[0];		
			var selectUnit = $(tr).find("select#unitField");

			if($(this).find("option:selected").val().trim() == 'number'){
				$(selectUnit).removeAttr("disabled");
			}else{
				$(selectUnit).attr("disabled", true);	
				$(selectUnit).find('option')[0].selected = 'selected'
			} 			
		});
	}
	
	function createTableFields(){
		$("#tableBBFields_wrapper").remove();

		$("#bbFields").append(new EJS({url:that.template}).render(cloneDataForm(["tableFields"])));
	}
	
	function getFieldsByBB(idBB){
		
		var bb = getBuildingBlock(idBB)
		var fields = JSON.parse(bb.config);
		var fieldsArray =[];
		
		$.each( fields, function( key, field ) {

			fields[key].action = new EJS({url:that.template}).render(cloneDataForm(["btnsEdit"]));
			
			if(fields[key].required == "true"){
				fields[key].required = "Yes"
			}else{
				fields[key].required = "No";
			}
			fieldsArray.push(fields[key])
		});

		setTbodyFieldsTable(fieldsArray);
		var rows = fieldsTable.fnGetNodes();
		
		$.each( rows, function( key, row ) {
			nEditingField.push(row);
		});
	}
	
	function setTbodyFieldsTable(listFields){	
		fieldsTable = $('#tableBBFields').dataTable( {
			"bScrollY": "100px",
			"bScrollCollapse": true,
			"bPaginate": false,
			"bProcessing": true,
			"aaData": listFields,
			"bDestroy": true,
			"bJQueryUI": true,
			"sRowSelect": "single",
			"oTableTools": {"sRowSelect": "single"},
			"aoColumnDefs": [
			                 { "bSortable": false, "aTargets": [ 2,3,4,5 ] },
			                 { "aTargets": [ 0 ], "bVisible": false }
							],
			"aoColumns": [
			              { mData: 'id', "sClass": "id hidden-phone",},
			              { mData: 'description', "sClass": "center required"},
			              { mData: 'type', "sClass": "center required"},
			              { mData: 'unit', "sClass": "center required"},
			              { mData: 'required', "sClass": "center required"},
			              { mData: 'action', "sClass": "center required" },
			              ],
	        'iDisplayLength': -1
		});	
	}
	
	function createNewFieldRow(e){
		e.preventDefault();
		var aiNew = fieldsTable.fnAddData({
			id:null,
			description: new EJS({url:that.template}).render(cloneDataForm(["descriptionField"])),
			type: new EJS({url:that.template}).render(cloneDataForm(["typeField"])),
			unit: new EJS({url:that.template}).render(cloneDataForm(["unitField"])), 
			required: new EJS({url:that.template}).render(cloneDataForm(["requiredField"])),
			action: new EJS({url:that.template}).render(cloneDataForm(["btnsAction"],{dataMode:'data-mode="new"'})),
		});
		var nRow  = fieldsTable.fnGetNodes(aiNew[0]);
		nEditingField.push(nRow)
	}

	function editRowField(oTable, nRow) {  
		var aData = oTable.fnGetData(nRow);
		var jqTds = $('>td', nRow);

		jqTds[0].innerHTML = new EJS({url : that.template}).render(cloneDataForm([ "descriptionField" ], {description:aData.description}));
		jqTds[1].innerHTML = new EJS({url:that.template}).render(cloneDataForm(["typeField"],{type:aData.type})); 
		jqTds[2].innerHTML = new EJS({url:that.template}).render(cloneDataForm(["unitField"],{type:aData.type,unit:aData.unit}));
		if(aData.required == "Yes"){
			 jqTds[3].innerHTML = new EJS({url:that.template}).render(cloneDataForm(["requiredField","required"]));
		}else{
			 jqTds[3].innerHTML = new EJS({url:that.template}).render(cloneDataForm(["requiredField"]));
		}
		jqTds[4].innerHTML = new EJS({url:that.template}).render(cloneDataForm(["btnsAction"],{cancel:"cancel"}));
		resizeTableField();
	}

	function deleteNewRowField(e,context){
	    e.preventDefault();
	    if ( $(context).attr("data-mode") == "new" ) {
	        var nRow = $(context).parents('tr')[0];
	    	fieldsTable.fnDeleteRow(nRow);
	    	var index = nEditingField.indexOf(nRow);
	    	nEditingField.splice(index, 1);
	    }else{
	    	var nRow = $(context).parents('tr')[0];
	    	$.each( nEditingField, function( key, row ) {
	    		if ( row == nRow ){
	    			restoreRow(fieldsTable, row);
	    		}
	    	});	
	    }
	}

	function editField(e,context){
		
		e.preventDefault();

		/* Get the row as a parent of the link that was clicked on */
		var nRow = $(context).parents('tr')[0];
	     
		if ( $(context).attr("id") == "saveField") {
			$.each( nEditingField, function( key, row ) {
				if ( row == nRow ){
					saveRowField(fieldsTable, row);
					resizeTableField();
				}
			});
		}else{
			$.each( nEditingField, function( key, row ) {
				if (row != nRow) {
					restoreRow(fieldsTable, row);
			        editRowField(fieldsTable, nRow);
			        resizeTableField();
				}else{
					editRowField(fieldsTable, nRow);
					resizeTableField();
				}
			});
		}
	}

	function resizeTableField(){
		$('#tableBBFields tr th').each(function(index,col){
			 if ( index == 0 ){
				 $(col).css("width","20%");
			 }else if ( index == 6 ){
				 $(col).css("width","15%");
			 }
		});
	}

	function saveRowField(oTable, nRow) {
		var jqInputs  = $('input', nRow);
		var jqInputs2  = $('select', nRow);
	    var aData = oTable.fnGetData(nRow);

	    var dataField = new Object();
	    dataField.id              	= aData.id;
	    dataField.bb	           	= that.idBB;
	    dataField.description     	= jqInputs[0].value;
	    dataField.type       		= jqInputs2[0].value;
	    dataField.unit       		= jqInputs2[1].value;
	    dataField.required      	= jqInputs2[2].value;
	    
		var data = {field:dataField};
		var field = ajaxCall('POST', '/blueloop-backend/buildingBlock/saveFieldByBB/', JSON.stringify(data), 'application/json; charset=utf-8', "json", false);
		dataField.id 		 	= field.id;
		dataField.description 	= field.description;
		dataField.required 		= field.required;
		dataField.type 			= field.type;
		dataField.unit 			= field.unit;
		dataField.action		= new EJS({url:that.template}).render(cloneDataForm(["btnsEdit"]));
	    oTable.fnUpdate(dataField,nRow);
	    oTable.fnDraw();
	    toastr.success(json.field.saved);
	    resizeTableField();
	    createTableFields();
	    getFieldsByBB(that.idBB);
	}

	function deleteRowField(e,context){
		e.preventDefault();
		
		var inFormula = validateFieldInFormula(context);
		if (inFormula){
			toastr.error(json.field.usedInFormula);
			return;
		}
		bootbox.confirm(json.general.deleteRow, function (e) {
		    if (e) {
		    	var nRow            = $(context).parents('tr')[0];   
				var aData           = fieldsTable.fnGetData(nRow);
				var jsonObject      = new Object();
				jsonObject.idField 	= aData.id;
				jsonObject.bb		= that.idBB;
				var dataAjax = ajaxCall('GET','/blueloop-backend/buildingBlock/deleteFieldByBB/', jsonObject, "text/json", "json", false);
				fieldsTable.fnDeleteRow(nRow);
				var index = nEditingField.indexOf(nRow);
				nEditingField.splice(index, 1);
				toastr.success(json.field.removed);
				editBBController.setOperatingParameters(getBuildingBlock(that.idBB),new Object);
		    } else {
		        return;
		    }
		});
	}
	
	function restoreRow(oTable, nRow) {
	    var aData = oTable.fnGetData(nRow);
	    
	    oTable.fnUpdate(aData,nRow);
	    oTable.fnDraw();
	}
	
	function validateFields(context){
		var nRow = $(context).parents('tr')[0];
		var jqInputs  = $('input', nRow);
		var errors = false;		
		if ( jqInputs[0].value == "" ){
			$(jqInputs[0]).parent().find("label").remove();
			$(jqInputs[0]).parent().append(new EJS({url:that.template}).render(cloneDataForm(["labelError"],{msgError:json.general.fieldRequired}))); 	
			errors = true;
		}		
		return errors;
	}
	
	function validateFieldInFormula(context){
		var nRow            = $(context).parents('tr')[0];   
		var aData           = fieldsTable.fnGetData(nRow);
		var jsonObject      = new Object();
		jsonObject.idField 	= aData.id;
		jsonObject.bb		= that.idBB;
		var result = ajaxCall('GET','/blueloop-backend/buildingBlock/validateFieldInFormula/', jsonObject, "text/json", "json", false);
		return result.inFormula;
	}
	
	function getBuildingBlock(idBB){
		var jsonObject = new Object();
		jsonObject.id = idBB;
		var data = ajaxCall('GET','/blueloop-backend/buildingBlock/getBuildingBlock/', jsonObject, "text/json", "json", false);
		var bb = data.bb;
		bb.config 	= data.config;
		bb.filePath = data.filePath;
		bb.creator.name = data.creator;
		bb.owner.name 	= data.owner;
		bb.community	= data.community;
		bb.countries	= data.countries;
		bb.defCountry	= data.defaultCountry;

		return bb;
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
	window.dinamycFieldController = new DynamicFieldController();
	dinamycFieldController.init();
});