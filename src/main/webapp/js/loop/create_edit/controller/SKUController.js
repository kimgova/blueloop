function SKUController() {
	
    var that = this;
    that.listSKUs = [];
    that.SKUsTable;
    that.nEditingSKUs=[];
    that.view = $("#formChainSKU");
    that.counter = 0;
    that.template = "/blueloop-backend/static/js/loop/create_edit/view/SKUTableElements.ejs";
    that.units = [];
    that.types = [];
    that.skuDataForm = {};
    
    that.init = function() {
    	that.units = [];
    	that.types = [];
    	var dataUnits = that.getMeasureUnits();

    	_.each(dataUnits,function(unit,i){
    		that.units.push({value:unit.id,description:unit.name});
    	});
    	
    	that.skuDataForm = {isIdentifier:false,isDescription:false,isUnit:false,isType:false,newBtns:false,
    			addBtns:false,editBtns:false,value:"",types:that.types,units:that.units};
    	
		if (localStorage.getItem('chainId') != 0) {
			getChainSavedSKUs();
		}
		setBtnsSettings();
    }
    
    that.getUnitName = function(id){
    	var unitName = ''
    	_.each(that.units,function(unit,i){
    		if(unit.value == id){
    			unitName = unit.description; 
    		}
    	});
    	return unitName;
    }
    
	that.openDialog = function(){		
		$(that.view).modal( "show" );
		loadSKUForm();
	}	
	
	that.getSkuData = function(){		
		var skus = [];
		_.each(that.listSKUs,function(item,i){
			skus.push({id:item.id,identifier:item.identifier,description:item.description,unit:item.unit,type:item.type});
	    });
		return skus;	
	}	
	
	that.getMeasureUnits = function(){
		var skulist = ajaxCall('GET', '/blueloop-backend/sku/getAllMeasureUnits/', undefined, "text/json", "json", false);
		return skulist;
	}
	
	function cloneDataForm(actProperty,value){
		var cloneSKU = jQuery.extend({},that.skuDataForm);
		cloneSKU[actProperty] = true;
		if(value != undefined){
			cloneSKU["value"] = value;
		}
		return cloneSKU;
	}
	    
	function setBtnsSettings() {   	
		$(document).off('click', '#SKUNew');
		$(document).on('click', '#SKUNew', function(e){
			createNewSKURow(e);
		 });
		
		$(document).off('click', '#saveSKU');
		$(document).on('click', '#saveSKU', function(e){
			var errors = validateFieldSKUForm(this);
			if ( !errors ){	editSKU(e,this);}
		});
		
		$(document).off('click', '#cancelSKU');
		$(document).on('click', '#cancelSKU', function(e){
			deleteNewRowSKU(e,this);
		});
		
		$(document).off('click', '#editSKU');
		$(document).on('click', '#editSKU', function(e){
			editSKU(e,this);
		});
		
		$(document).off('click', '#deleteSKU');
		$(document).on('click', '#deleteSKU', function(e){			
			deleteRowSKU(e,this);			
		});		
    }


	function listSKUsAdd(pid, pidentifier, pdescription, punitId, punitName, ptype) {
		var btns = new EJS({url: that.template}).render(cloneDataForm("addBtns"));
		that.listSKUs.push({id:pid,identifier:pidentifier,description:pdescription,unit:punitId,unitName: punitName, type:ptype,action:btns});
	}
	
	function listSKUsUpdate(pid, pidentifier, pdescription, punit, punitName, ptype){
		for(var i=0; i < that.listSKUs.length; i++){
			if(that.listSKUs[i].id === pid) {
				that.listSKUs[i].identifier  = pidentifier;
				that.listSKUs[i].description = pdescription;
				that.listSKUs[i].unit 		 = punit;
				that.listSKUs[i].unitName	 = punitName;
				that.listSKUs[i].type 		 = ptype;
				return true;
		    }
		}
		return false;
	}
	
	function listSKUsValidateRepeated(pid, pidentifier, pdescription){
		for(var i=0; i < that.listSKUs.length; i++){
			if(that.listSKUs[i].id != pid) {
				if(that.listSKUs[i].identifier.toUpperCase().trim() === pidentifier.toUpperCase().trim()) {
					return false;
			    }
			}
		}
		return true;
	}
	
	function listSKUsRemove(pid) {		
		for(var i=0; i < that.listSKUs.length; i++){
			if(that.listSKUs[i].id === pid) {
		    	that.listSKUs.splice(i,1);       
		    }
		}			
	}

    function getChainSavedSKUs(){    	
    	that.listSKUs=[];
    	var jsonObject = new Object();
    	jsonObject.id = localStorage.getItem('chainId');
    	var data = ajaxCall('GET', '/blueloop-backend/sku/getAllSkusByChain/', jsonObject, "text/json", "json", false);
    	$.each( data, function( key, sku ) {
    		listSKUsAdd(sku.id, sku.identifier, sku.description, sku.unit.id, that.getUnitName(sku.unit.id), sku.type); 			
	    });	 
	}
    
    function loadSKUForm() {	
		if(that.listSKUs){
			setTbodySKUTable();
			that.rows = that.SKUsTable.rows();
			that.nEditingSKUs=[];
			$.each( that.rows, function( key, row ) {
				that.nEditingSKUs.push(row);
			});
		}
		setBtnsSettings();
	}
    
    function setTbodySKUTable() {
    	that.SKUsTable = null;
		that.SKUsTable = $('#tableSKUs').DataTable( {
			"autoWidth"		: false,
			"scrollCollapse": true,
			"processing"	: true,
			"data"			: that.listSKUs,
			"destroy"		: true,
			"jQueryUI"		: false,
			"paging"		: true,
			"select"		: "single",
			"columnDefs"	: [	{ "orderable": false, "targets": [ 3,4,5 ] },
			              		{ "targets" : [ 0,3 ], "visible": false },
			              		{ "className": "center", "targets": [ 5 ] }],
			"columns"		: [ { "data": 'id'},
						        { "data": 'identifier'},
						        { "data": 'description'},
						        { "data": 'unit'},
						        { "data": 'unitName'},						            
						        { "data": 'action'}]
		});	
	}
    
    function createNewSKURow(e){
		e.preventDefault();
		that.counter++;
		var newData = {
			id			: "n_" + that.counter, 
			identifier	: new EJS({url: that.template}).render(cloneDataForm("isIdentifier")),
			description	: new EJS({url: that.template}).render(cloneDataForm("isDescription")), 
			unitName	: new EJS({url: that.template}).render(cloneDataForm("isUnit")), 
			type		: new EJS({url: that.template}).render(cloneDataForm("isType")),
			action		: new EJS({url: that.template}).render(cloneDataForm("newBtns")),
			unit		: '' 
		};
		var aiNew = that.SKUsTable.row.add(newData).draw().node();
		that.nEditingSKUs.push(aiNew)
	}
	
	function validateFieldSKUForm(context){
		var nRow = $(context).parents('tr')[0];
		var jqInputs  = $('input', nRow);
		var errors = false;
		
		_.each(jqInputs,function(input,i){
			if ( $(input).val() == "" ){
				$(input).parent().parent().find("label").css("display","block");
				errors = true;
			}
    	});
		
		return errors;
	}
	
	function editSKU(e,context){		
		e.preventDefault();
		var nRow = $(context).parents('tr')[0];
		if ( $(context).attr("id") == "saveSKU") {
			$.each(that.nEditingSKUs, function( key, row ) {
				if ( row == nRow ){
					saveRowSKU(that.SKUsTable, row);
				}
			});
			return;
		}else{
			$.each(that.nEditingSKUs, function( key, row ) {
				if (row != nRow) {
					restoreRow(that.SKUsTable, row);
					editRowSKU(that.SKUsTable, nRow);
				}else{
					editRowSKU(that.SKUsTable, nRow);
				}
			});
		}
	}
	
	function saveRowSKU(oTable, nRow) {
	    var jqInputs  = $('input', nRow);
	    var jqSelects = $('select', nRow);
	    var aData = oTable.row(nRow).data();
    
	    var dataSKU = new Object();
	    dataSKU.id           = aData.id;
	    dataSKU.identifier   = jqInputs[0].value;
	    dataSKU.description  = jqInputs[1].value;
	    dataSKU.unit 		 = jqSelects[0].value;
	    dataSKU.unitName	 = $(jqSelects[0]).find("option:selected").text().trim();
	    dataSKU.type 		 = "FP";
	    dataSKU.action 		 = new EJS({url: that.template}).render(cloneDataForm("addBtns")) ;

	    if(listSKUsValidateRepeated(dataSKU.id, dataSKU.identifier, dataSKU.description) == true){
	    
		    if(listSKUsUpdate(dataSKU.id, dataSKU.identifier, dataSKU.description, dataSKU.unit, dataSKU.unitName, dataSKU.type) == false){
		    	listSKUsAdd("n_"+that.counter, dataSKU.identifier, dataSKU.description, dataSKU.unit, dataSKU.unitName, dataSKU.type); 
		    }
		    
		    that.counter = that.listSKUs.length;
		    changeBtnSkuIcon();
		    oTable.row(nRow).data(dataSKU);
		    oTable.draw();
		    toastr.success(json.sku.saved);
		    
	    }else{
	    	toastr.error(json.sku.repeated);	
	    }
	    
	}
	
	function deleteNewRowSKU(e,context){
	    e.preventDefault();
	    if ( $(context).attr("data-mode") == "new" ) {
	        var nRow = $(context).parents('tr')[0];
	        that.SKUsTable.rows(nRow).remove().draw();
	    }else{
	    	var nRow = $(context).parents('tr')[0];
	    	$.each( that.nEditingSKUs, function( key, row ) {
	    		if ( row == nRow ){
	    			restoreRow(that.SKUsTable, row);
	    		}
	    	});
	    }
	}

	function editRowSKU(oTable, nRow) {
	    var aData = oTable.row(nRow).data();
	    var jqTds = $('>td', nRow);
	    jqTds[0].innerHTML	= new EJS({url: that.template}).render(cloneDataForm("isIdentifier",aData.identifier));
		jqTds[1].innerHTML	= new EJS({url: that.template}).render(cloneDataForm("isDescription",aData.description)); 
		jqTds[2].innerHTML	= new EJS({url: that.template}).render(cloneDataForm("isUnit",aData.unit));
		jqTds[3].innerHTML	= new EJS({url: that.template}).render(cloneDataForm("editBtns"));
	    
	    that.nEditingSKUs  = [];
	    that.nEditingSKUs.push(nRow);
	}
	
	function restoreRow(oTable, nRow) {
	    var aData = oTable.row(nRow).data();	  
	    oTable.row(nRow).data(aData);
	    oTable.draw();
	}
	
	function deleteRowSKU(e,context){
		e.preventDefault();		
		bootbox.confirm(json.sku.removeConfirm, function (e) {
		    if (e) {
		    	var nRow  = $(context).parents('tr')[0];   
				var aData = that.SKUsTable.row(nRow).data();
				listSKUsRemove(aData.id);				
				that.SKUsTable.rows(nRow).remove().draw();
				that.counter = that.listSKUs.length;
				toastr.success(json.sku.removed);
				changeBtnSkuIcon();
		    } else {
		        return;
		    }
		});
	}
       
	function changeBtnSkuIcon(){
		if(that.counter != 0){
			$("#btnSku").removeClass('btnRed');
		}else{
			$("#btnSku").addClass('btnRed');
		}
		
	}
    return that;
}

