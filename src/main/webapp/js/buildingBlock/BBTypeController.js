/**
 * 
 */

function BBTypeController() {
	
	var that = this;
	that.typesTable = {};
	that.nEditingType  = [];
	that.listBBTypes = [];
	that.objectTemplate = {};
	that.template = "/blueloop-backend/static/js/buildingBlock/view/BBTypesTableView.ejs";
	
	that.init = function() {
		that.objectTemplate = {tableBBTypes:false,img:false,editBBType:false,deleteBBType:false,nameInput:false,descriptionInput:false,
				chooseImgEdit:false,chooseImg:false,gridliImg:false,btnSave:false,btnCancel:false,selectedImg:false,updateImgEdit:false,aDataName:"",
				aDataDescription:"",imgPath:"",cancel:"",dataMode:""};
		bindEvents();
	}
	
	function bindEvents() {
		
		$(document).on('click', '#newBBType', function(e){
			createNewBBTypeRow(e);
		});
		
		$(document).on('click', '#editBBType', function(e){
			editBBType(e,this);
			$('#bbSelect').trigger("chosen:updated");
		});
		
		$(document).on('click', '#cancelBBType', function(e){
			deleteNewRowBBType(e,this);
		});
		
		$(document).on('click', '#saveBBType', function(e){
			editBBType(e,this);
			createBBController.onChangeCategory($("#bbCategory").val());
			createBBController.changeBBForm($("#bbSelect").val());
		});
		
		$(document).on('click', '#deleteBBType', function(e){
			deleteRowBBType(e,this);
		});

		$(document).on('click', '#chooseImgBBType', function(e){
			setValueRowInModalImg(this);
			
			$("#image_chooser_modal").remove();	
			var modalView = new imageChooserModalView({context:bbTypeController, imageType:1});
	    	modalView.render().$el.modal({backdrop: 'static',keyboard: false});
		});
	}
	
	that.setSelectedImage = function(modelImage){
		$("#selectedImgBBTypeDiv").remove();
		$(new EJS({url:that.template}).render(cloneDataForm(["selectedImg"], 
					{'imgPath':modelImage.get("filePath"),
					 'aDataName':modelImage.get("key")}))).appendTo("#bbModalSelectImg");
		
		updateRowBBTypeWithImg(modelImage);
	}
	
	that.getTypesBB = function(bbCategory){
		var jsonObject = new Object();
		jsonObject.category = bbCategory;
		var data = ajaxCall('GET','/blueloop-backend/buildingBlockType/getAllBBTypeByCategory/', jsonObject, "text/json", "json", false);
		that.listBBTypes = [];
		$.each(data.listBBType, function(key,bb){
			listBBTypeAdd(bb.id,bb.name,bb.description,bb.fileName,data.filePath,bb.owner.id);
		});
		
		getTypesByCategory();
	}
	
	function getTypesByCategory(){
		setTbodyBBTypesTable(that.listBBTypes);
		var rows = that.typesTable.rows();
		$.each(rows, function( key, row ){
			that.nEditingType.push(row);
		});
	}
	
	
	function listBBTypeAdd(pid, pname, pdescription, pfileName, pfilePath,pOwner) {
		var filePath = new EJS({url:that.template}).render(cloneDataForm(["img"], {'imgPath':pfilePath + pfileName}));
		if(pOwner == 1){
			that.listBBTypes.push({id:pid,name:pname,description:pdescription,fileName:pfileName,filePath:filePath,action:""});
		}else{
			var btns = new EJS({url:that.template}).render(cloneDataForm(["deleteBBType","editBBType"]));
			that.listBBTypes.push({id:pid,name:pname,description:pdescription,fileName:pfileName,filePath:filePath,action:btns});
		}
	}
	
	function setTbodyBBTypesTable(listBBTypes){	
		that.typesTable = $('#tableBBTypes').DataTable({
			"autoWidth"		: false,
			"scrollCollapse": true,
			"processing"	: true,
			"data"			: listBBTypes,
			"destroy"		: true,
			"jQueryUI"		: false,
			"paging"		: false,
			"select"		: "single",
			"columnDefs"	: [{"orderable": false, "targets": [ 4,5 ]}, {"visible": false, "targets": [ 0,3 ] }],
			"columns"		: [{"data": 'id'},
				              {"data": 'name'},
				              {"data": 'description'},
				              {"data": 'fileName'},
				              {"data": 'filePath'},
				              {"data": 'action'}]
		});
	}
	
	function createNewBBTypeRow(e){
		e.preventDefault();
		var newData = {
			id:null,
			name: new EJS({url:that.template}).render(cloneDataForm(["nameInput"])),
			description: new EJS({url:that.template}).render(cloneDataForm(["descriptionInput"])),
			fileName:'BBType1.png',
			filePath: new EJS({url:that.template}).render(cloneDataForm(["chooseImg"])),
			action: new EJS({url:that.template}).render(cloneDataForm(["btnSave","btnCancel"],{dataMode:'data-mode="new"'}))	
		}
		var aiNew = that.typesTable.row.add(newData).draw().node();
		that.nEditingType.push(aiNew);
	}

	function editRowBBType(oTable, nRow) { 
		var aData = oTable.row(nRow).data();
		var jqTds = $('>td', nRow);

		jqTds[0].innerHTML = new EJS({url:that.template}).render(cloneDataForm(["nameInput"], {'aDataName':aData.name}));
		jqTds[1].innerHTML = new EJS({url:that.template}).render(cloneDataForm(["descriptionInput"], {'aDataDescription':aData.description}));
		jqTds[2].innerHTML = new EJS({url:that.template}).render(cloneDataForm(["chooseImgEdit"], {'imgPath':aData.filePath}));
		jqTds[3].innerHTML = new EJS({url:that.template}).render(cloneDataForm(["btnSave","btnCancel"],{dataMode:'data-mode="edit"'}));
		
		that.nEditingType  = [];
		that.nEditingType.push(nRow);
	}

	function deleteNewRowBBType(e,context){
	    e.preventDefault();
	    if ( $(context).attr("data-mode") == "new" ) {
	        var nRow = $(context).parents('tr')[0];
	        that.typesTable.fnDeleteRow(nRow);
	    	var index = that.nEditingType.indexOf(nRow);
	    	that.nEditingType.splice(index, 1);
	    }else{
	    	var nRow = $(context).parents('tr')[0];
	    	$.each(that.nEditingType, function( key, row ) {
	    		if ( row == nRow ){
	    			restoreRow(that.typesTable, row);
	    		}
	    	});	
	    }
	}

	function editBBType(e,context){
		e.preventDefault();
		/* Get the row as a parent of the link that was clicked on */
		var nRow = $(context).parents('tr')[0];
		
		if ( $(context).attr("id") == "saveBBType") {
			$.each( that.nEditingType, function( key, row ) {
				if ( row == nRow ){
					saveRowBBType(that.typesTable, row);
				}
			});
		}else{
			$.each( that.nEditingType, function( key, row ) {
				if (row != nRow) {
					restoreRow(that.typesTable, row);
					editRowBBType(that.typesTable, nRow);
				}else{
					editRowBBType(that.typesTable, nRow);
				}
			});
		}
	}

	function saveRowBBType(oTable, nRow) {
		var jqInputs = $('input, img', nRow);
		var aData 	= oTable.row(nRow).data();
		if ( $(jqInputs[2]).attr("filename") ){
			aData.fileName = $(jqInputs[2]).attr("filename");
			aData.filePath = $(jqInputs[2]).attr("src");	
		}
		
		var dataBBType 			= new Object();
		dataBBType.id 			= aData.id;
		dataBBType.name			= jqInputs[0].value;
		dataBBType.description	= jqInputs[1].value;
		dataBBType.category		= $('#bbCategory').val();
		dataBBType.fileName = aData.fileName;

		if(that.validate(dataBBType.name,dataBBType.description,dataBBType.fileName)){
			var data = ajaxCall('GET', '/blueloop-backend/buildingBlockType/saveBBType/', dataBBType, 'application/json; charset=utf-8', "json", false);
			if(data){
				dataBBType.id 		 	= data.bbType.id;
				dataBBType.name 		= data.bbType.name;
				dataBBType.description 	= data.bbType.description;
				dataBBType.filePath		= new EJS({url:that.template}).render(cloneDataForm(["img"], {'imgPath':data.filePath}));
				dataBBType.action		= new EJS({url:that.template}).render(cloneDataForm(["editBBType","deleteBBType"]));
				oTable.row(nRow).data(dataBBType);
				oTable.draw();
				toastr.success(json.bbType.saved);
			}else{
				toastr.error("An error has ocurred");
			}
		}
	}
	
	that.validate = function(typeName, typeDescription, typeFilename){
		var valid = true;
		if(typeName.trim() == ""){
			valid = false;
			toastr.error("Must enter the name of the BB Type");
		}else if(typeDescription.trim() == ""){
			valid = false;
			toastr.error("Must enter the description of the BB Type");
		}else if(typeFilename.trim().indexOf("BBType1") != -1){
			valid = false;
			toastr.error("Must pick a default image of BB Type");
		}
		return valid;
	}

	function deleteRowBBType(e,context){
		e.preventDefault();
		bootbox.confirm(json.general.deleteRow, function (e) {
			if (e) {
				var nRow            = $(context).parents('tr')[0];   
				var aData           = that.typesTable.row(nRow).data();
				var dataAjax = ajaxCall('GET','/blueloop-backend/buildingBlockType/deleteBBType/', {idBBType:aData.id}, "text/json", "json", false);
				that.typesTable.rows(nRow).remove().draw();
				toastr.success(json.bbType.removed);
				$('#bbSelect').trigger("chosen:updated");
				createBBController.onChangeCategory($("#bbCategory").val());
				createBBController.changeBBForm($("#bbSelect").val());
			} else {
				return;
			}
		});
	}
	
	function restoreRow(oTable, nRow) {
		var aData = oTable.row(nRow).data();
		oTable.row(nRow).data(aData);
		oTable.draw();
	}	


	function updateRowBBTypeWithImg(modelImage){
		$("#tableBBTypes tbody tr").each(function (index,row) {
			if ( $("#fnGetPositionBBType").val() == index ){
				var ntr = $(this).find("#chooseImgBBType").parents('tr')[0];
				var aData = that.typesTable.row( ntr ).data();
				var jqInputs = $('input', ntr);
				var jqTds = $('>td', ntr);

				jqTds[0].innerHTML = new EJS({url:that.template}).render(cloneDataForm(["nameInput"],{'aDataName':jqInputs[0].value}));
				jqTds[1].innerHTML = new EJS({url:that.template}).render(cloneDataForm(["descriptionInput"],{'aDataDescription':jqInputs[1].value}));
				
				jqTds[2].innerHTML = new EJS({url:that.template}).render(cloneDataForm(["updateImgEdit"],{'aDataName':modelImage.get("key"),imgPath:modelImage.get("filePath")}));
				jqTds[3].innerHTML = new EJS({url:that.template}).render(cloneDataForm(["btnSave","btnCancel"],{cancel:'cancel'}));
			}
		});
	}
	
	function setValueRowInModalImg(context){
		var nRow = $(context).parents('tr')[0];
		var rowPosition = null;

		$("#tableBBTypes tbody tr").each(function (index,row) {
			if ( nRow == row ){
				rowPosition = index;
			}
		});
		$("#fnGetPositionBBType").val(rowPosition);
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