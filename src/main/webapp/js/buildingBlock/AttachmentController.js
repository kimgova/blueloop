function AttachmentController() {
		
	var idBuildingBlock;
	var attachFromDropboxTable;
	var listAttachDropbox;
	var listAttachInventory = [{"id":1,"fileName":"Entradas.xls","date":"22-01-2015 13:22:00","user":"Daniela Salas"},{"id":1,"fileName":"Salidas.xls","date":"22-01-2015 14:22:00","user":"Kimberly Godínez"},{"id":1,"fileName":"Compras.xls","date":"22-01-2015 07:22:40","user":"Andrés Hernández"}];
	var attachFromDiskTable;
	var listAttachDisk;
	var that = this;
	
	that.init = function() {
		bindEvents();
    }
	
	function bindEvents() {	
		$(document).off('click', '#deleteAttachDropbox');
		$(document).on('click', '#deleteAttachDropbox', function(e){
			deleteRowAttach(e,this, 0);
		});	
		
		$(document).off('click', '#deleteAttachDisk');
		$(document).on('click', '#deleteAttachDisk', function(e){
			deleteRowAttach(e,this, 1);
		});	
		
		$(document).off('click', '#saveAttach');
		$(document).on('click', '#saveAttach', function(e){
			attachmentController.editDiskFile(e,this,1);
		});
		
		$(document).off('click', '#editAttach');
		$(document).on('click', '#editAttach', function(e){
			attachmentController.editRowDiskFile(e,this,1);
		});
		
		$(document).off('click', '#saveAttachDropbox');
		$(document).on('click', '#saveAttachDropbox', function(e){
			attachmentController.editDiskFile(e,this,0);
		});
		
		$(document).off('click', '#editAttachDropbox');
		$(document).on('click', '#editAttachDropbox', function(e){
			attachmentController.editRowDiskFile(e,this,0);
		});
		
		$(document).off('click', '#downloadAttach');
		$(document).on('click', '#downloadAttach', function(e) {
			e.preventDefault();
			var url = ($(this).attr("href"));
			url = "/blueloop-backend/" + url.substr(url.indexOf("repos/"),url.length);
			var fileName = $(this).attr("download");
			downloadFile(url, fileName);		
		});
		
		$(document).on('click', '#applyFile', function(e){
			processInventoryFile();
		});	
		
		$(document).on("change", "#inputFileAttachment", function() {
			$("#formUploadBBAttachment").ajaxSubmit({
	            async: true,
	            url: "/blueloop-backend/BBAttachment/uploadFile",
	            success: function (data) {
	                if(data.error){
	                    toastr.error(data.error);
	                }else{
	                    attachmentController.saveDiskAttachment(data.fileName, data.fileSize);
	                }
	            },
	            error: function(httpRequest, textStatus, errorThrown) { 
	 	     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
	 	     	   toastr.error(httpRequest.responseJSON.error);
	 	     	}
	        });
		});
		
		$(document).on("change", "#inputFileInventory", function() {			
			var params = {};
			params.typeFile = $('input[name="typeFile"]:checked').val();
			params.idBB = $('#bbSelected').val();
			$( "#applyFile" ).prop( "disabled", true );
			$("#formUploadInventoryFile").ajaxSubmit({ 
				data: params,
	            async: true,
	            url: "/blueloop-backend/loadFile/uploadInventoryFile",
	            success: function (data) { 
	            	$( "#applyFile" ).prop( "disabled", false );
	            	$( "#typeFileSelected" ).val(params.typeFile);
	            	$( "#typeFileSelected" ).html(data.fileName);
	            	toastr.success(data.message);
	            },
	            error: function(httpRequest, textStatus, errorThrown) { 
	 	     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
	 	     	   toastr.error(httpRequest.responseJSON.error);
	 	     	}
	        });

		});
		
	}
	
	function downloadFile(url, fileName) {
		var link = document.createElement('a');
		link.href = url;		
		if (link.download !== undefined){	   
            var fName = fileName; //Set HTML5 download attribute. This will prevent file from opening if supported.
            link.download = fName;
        }
        if (document.createEvent) {  //Dispatching click event.
            var e = document.createEvent('MouseEvents');
            e.initEvent('click' ,true ,true);
            link.dispatchEvent(e);
            return true;
        }        
        var query = '?download';     
        window.open(url + query);      
	}
		
	that.createTableAttachFromDropbox = function(idBB){
		idBuildingBlock = idBB;
		$("#attachFromDropbox").html("");
		$("#attachFromDropbox").append($(new EJS({url:'/blueloop-backend/static/js/ejsTemplates/attachmentsTables.ejs'}).render({type:"Dropbox"})));
		getAttachByDropbox(idBB);
		setDropboxChooserBtn();		
	
		$("#attachDiskTable").html("");
		$("#attachDiskTable").append($(new EJS({url:'/blueloop-backend/static/js/ejsTemplates/attachmentsTables.ejs'}).render({type:"Disk"})));
		getAttachByDisk(idBB);			
	}	
	
	that.createTableUploadInventory = function(idBB){
		idBuildingBlock = idBB;
		getListUploadFiles();
		setTbodyUploadInventory();		
		resizeTableUpInvent();
	}
	
	function resizeTableUpInvent(){
		$('#uploadInventory').removeAttr("style");
		$('#uploadInventory tr th').each(function(index,col){
			 if ( index == 1 ){
				 $(col).css("width","50%");
			 }else if ( index == 2 ){
				 $(col).css("width","25%");
			 }else if ( index == 3 ){
				 $(col).css("width","25%");
			 }else{
				 $(col).css("width","0%");
			 }
		});
	}
	
	function setDropboxChooserBtn(){		
		options = {	success: function(files) { // Required. Called when a user selects an item in the Chooser.
									saveDropboxAttachment(files); },
					linkType: "preview", // or "direct"
					multiselect: false, // or true
					extensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.png', '.jpg', '.gif', '.txt', '.odt'],
			};	
		var button = Dropbox.createChooseButton(options);
		document.getElementById("btnDropboxChooser").appendChild(button);
	}

	function getAttachByDropbox(idBB){
		var jsonObject = new Object();
		jsonObject.idBB = idBB;
		listAttachDropbox = ajaxCall('GET','/blueloop-backend/BBAttachment/getAllDropboxAttach/', jsonObject, "text/json", "json", false);
		
		for(i=0; i<listAttachDropbox.length;++i){
			var link = listAttachDropbox[i].link;
			listAttachDropbox[i].link   = new EJS({url:'/blueloop-backend/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"linkDropbox", link:link});
			listAttachDropbox[i].action = new EJS({url:'/blueloop-backend/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"editDropbox"}) + 
											new EJS({url:'/blueloop-backend/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"deleteDropbox"});
			if(listAttachDropbox[i].fileName.length > 18){
				listAttachDropbox[i].name = new EJS({url:'/blueloop-backend/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"filename", name:listAttachDropbox[i].fileName.substring(0, 18) + "...", fileName:listAttachDropbox[i].fileName});
			}else{
				listAttachDropbox[i].name = listAttachDropbox[i].fileName;
			}
		}
		setTbodyDropboxAttachment(listAttachDropbox);		
	}

	function getAttachByDisk(idBB){
		var jsonObject = new Object();
		jsonObject.idBB = idBB;
		listAttachDisk = ajaxCall('GET','/blueloop-backend/BBAttachment/getAllDiskAttach/', jsonObject, "text/json", "json", false);
		
		for(i=0; i<listAttachDisk.length;++i){
			var link = listAttachDisk[i].link;
			
			listAttachDisk[i].link   = new EJS({url:'/blueloop-backend/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"linkDisk", link:link});
			listAttachDisk[i].action = new EJS({url:'/blueloop-backend/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"download", link:link, fileName:listAttachDisk[i].fileName}) +
									   new EJS({url:'/blueloop-backend/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"editDisk"}) + 
									   new EJS({url:'/blueloop-backend/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"deleteDisk"});
			if(listAttachDisk[i].fileName.length > 18){
				listAttachDisk[i].name = new EJS({url:'/blueloop-backend/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"filename", name:listAttachDisk[i].fileName.substring(0, 18) + "...", fileName:listAttachDisk[i].fileName});
			}else{
				listAttachDisk[i].name = listAttachDisk[i].fileName;
			}
		}
		setTbodyDiskAttachment();		
	}
	
	//Function to set starting DataTable	
	function setTbodyDropboxAttachment(){	
		if (attachFromDropboxTable){
			attachFromDropboxTable.destroy();	
		}
				
		attachFromDropboxTable = $('#attachDropbox').DataTable({		
			"autoWidth"		: false,
			"scrollCollapse": true,
			"paging"		: false,
			"processing"	: true,
			"data"			: listAttachDropbox,
			"destroy"		: true,
			"jQueryUI"		: false,
			"select"		: "single",
			"columnDefs"	: [{"orderable": false, "targets": [0,2,3]},
			              	   {"targets": [0], "visible": false }],
			"columns"		: [{"data": 'id'},
			           		   {"data": 'name'},
			           		   {"data": 'description'},
			           		   {"data": 'link'},
			           		   {"data": 'action'}]
		});	
	}
	
	function getListUploadFiles(){
		var jsonObject = new Object();
		jsonObject.idBB = idBuildingBlock;
		listAttachInventory = ajaxCall('GET','/blueloop-backend/LoadFile/getListUploadFiles/', jsonObject, "text/json", "json", false);
		$("#bbSelected").val(idBuildingBlock);
	}
	
	function setTbodyUploadInventory(){	
		if (uploadInventoryTable){
			//uploadInventoryTable.fnDestroy();		
		}		
		uploadInventoryTable = $('#uploadInventory').DataTable({		
			"autoWidth"		: false,
			"scrollCollapse": true,
			"paging"		: false,
			"processing"	: true,
			"data"			: listAttachInventory,
			"destroy"		: true,
			"jQueryUI"		: false,
			"select"		: "single",
			"columnDefs"	: [{"orderable": false, "targets": [0]},
			              	   {"targets": [0], "visible": false }],
			"columns"		: [{"data": 'id'},
			           		   {"data": 'fileName'},
			           		   {"data": 'uploadDate'},
			           		   {"data": 'user'}]
		});	
		setRadios();
	}

	function setRadios(){
	    $('input').iCheck({
	 	    checkboxClass: 'icheckbox_square-blue',
	 	    radioClass: 'iradio_square-blue',
	 	    increaseArea: '20%'
	 	 });
	}
	
	function setTbodyDiskAttachment(){	
		attachFromDiskTable = $('#attachDisk').DataTable({		
			"autoWidth"		: false,
			"scrollCollapse": true,
			"paging"		: false,
			"processing"	: true,
			"data"			: listAttachDisk,
			"destroy"		: true,
			"jQueryUI"		: false,
			"select"		: "single",
			"columnDefs"	: [{"orderable": false, "targets": [0,2]},
			              	   {"targets": [0], "visible": false}],
			"aoColumns"		: [{"data": 'id'},
			           		   {"data": 'name'},
			           		   {"data": 'description'},
			           		   {"data": 'action'}]
		});	
	}
	
	function saveDropboxAttachment(files) {
		var Attach = new Object();
	    Attach.type     = 0;
	    Attach.idBB     = idBuildingBlock;
	    Attach.fileName = files[0].name;
	    Attach.link     = files[0].link;

		var result = ajaxCall('POST', '/blueloop-backend/BBAttachment/saveAttachFromDropbox/', JSON.stringify(Attach), 'application/json; charset=utf-8', "json", false);
		var link = result.link;
		result.link   = new EJS({url:'/blueloop-backend/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"linkDropbox", link:link});
		result.action = new EJS({url:'/blueloop-backend/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"saveDropbox"});
		result.description = new EJS({url:'/blueloop-backend/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"description", description:""});
		if(files[0].name.length > 18){
			result.name = new EJS({url:'/blueloop-backend/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"filename", name:files[0].name.substring(0, 18) + "...", fileName:files[0].name});
		}else{
			result.name = files[0].name;
		}
		listAttachDropbox.push(result);
		toastr.success(json.file.attachmentAdded);
		setTbodyDropboxAttachment();
	}
	
	that.saveDiskAttachment = function(fileName, fileSize){
		var Attach = new Object();
		Attach.type     = 1;
		Attach.idBB     = idBuildingBlock;
		Attach.fileName = fileName;
	    Attach.fileSize = fileSize;

		var result = ajaxCall('POST', '/blueloop-backend/BBAttachment/saveAttachFromDisk/', JSON.stringify(Attach), 'application/json; charset=utf-8', "json", false);
		var link = result.link;	
		result.link   = new EJS({url:'/blueloop-backend/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"linkDisk", link:link});
		result.action = new EJS({url:'/blueloop-backend/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"saveDisk"});
		if(fileName.length > 18){
			result.name = new EJS({url:'/blueloop-backend/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"filename", name:fileName.substring(0, 18) + "...", fileName:fileName});
		}else{
			result.name = fileName;
		}
		result.description = new EJS({url:'/blueloop-backend/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"description", description:""});
		listAttachDisk.push(result);
		toastr.success(json.file.attachmentAdded);
		setTbodyDiskAttachment();
	}
	
	that.editRowDiskFile = function(e, context, type){
		var aData;
		var nRow = $(context).parents('tr')[0];
		var jqTds = $('>td', nRow);
		if(type == 1){
			aData = attachFromDiskTable.row(nRow).data();
			jqTds[2].innerHTML = new EJS({url:'/blueloop-backend/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"saveDisk"});
		}else{
			aData = attachFromDropboxTable.row(nRow).data();
			jqTds[3].innerHTML = new EJS({url:'/blueloop-backend/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"saveDropbox"});
		}
		jqTds[1].innerHTML = new EJS({url:'/blueloop-backend/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"description", description:aData.description});
		
	}
	
	that.editDiskFile = function(e, context, type){
		var aData;
		var nRow = $(context).parents('tr')[0];
		var jqInputs  = $('input', nRow);
		if(type == 1){
			aData = attachFromDiskTable.row(nRow).data();
		}else{
			aData = attachFromDropboxTable.row(nRow).data();
		}
		
		var result = ajaxCall('POST', '/blueloop-backend/BBAttachment/editAttachment/', JSON.stringify({id:aData.id,description:jqInputs[0].value}), 'application/json; charset=utf-8', "json", false);
		
		var link = result.link;
		result.link   = new EJS({url:'/blueloop-backend/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"linkDisk", link:link});
		if(result.fileName.length > 18){
			result.name = new EJS({url:'/blueloop-backend/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"filename", name:result.fileName.substring(0, 18) + "...", fileName:result.fileName});
		}else{
			result.name = result.fileName;
		}
		
		if(type == 1){
			result.action = new EJS({url:'/blueloop-backend/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"download", link:link, fileName:result.fileName}) +
							new EJS({url:'/blueloop-backend/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"editDisk"}) + 
							new EJS({url:'/blueloop-backend/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"deleteDisk"});
			
			attachFromDiskTable.row(nRow).data(result);
			attachFromDiskTable.draw();
		}else{
			result.link   = new EJS({url:'/blueloop-backend/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"linkDisk", link:link.substr(0,10) + "..."});
			result.action = new EJS({url:'/blueloop-backend/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"editDropbox"}) + 
							new EJS({url:'/blueloop-backend/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"deleteDropbox"});

			attachFromDropboxTable.row(nRow).data(result);
			attachFromDropboxTable.draw();
		}
		toastr.success(json.file.descriptionSaved);
	}

	function deleteRowAttach(e,context,from){ // param 'from': 0-dropbox, 1:disk
		e.preventDefault();		
		bootbox.confirm(json.general.deleteRow, function (e) {
		    if (e) {
		    	nRow = $(context).parents('tr')[0];
		    	if(from == 0){
		    		var aData = attachFromDropboxTable.row(nRow).data();
		    	}else{
		    		var aData = attachFromDiskTable.row(nRow).data();
		    	}
				var jsonObject      = new Object();
				jsonObject.idAttach = aData.id;
				var dataAjax = ajaxCall('GET','/blueloop-backend/BBAttachment/deleteAttach/', jsonObject, "text/json", "json", false);
				if(from == 0){
					attachFromDropboxTable.rows(nRow).remove().draw();
					listAttachDropboxRemove(aData.id);
				}else{
					attachFromDiskTable.rows(nRow).remove().draw();
					listAttachDiskRemove(aData.id);
				}
				toastr.success(json.file.attachmentRemoved);
		    } else {
		        return;
		    }
		});
	}
		
	function listAttachDropboxRemove(pid) {		
		for(var i=0; i < listAttachDropbox.length; i++){
			if(listAttachDropbox[i].id === pid) {
				listAttachDropbox.splice(i,1);       
		    }
		}			
	}	
	
	function listAttachDiskRemove(pid) {		
		for(var i=0; i < listAttachDisk.length; i++){
			if(listAttachDisk[i].id === pid) {
				listAttachDisk.splice(i,1);       
		    }
		}			
	}
	
	function processInventoryFile(){
		$("#applyFile").prop("disabled", true); //poner en true
		
		var jsonObject 		= new Object();
		jsonObject.typeFile = $("#typeFileSelected").val();
		jsonObject.fileName = $("#typeFileSelected").html();
		jsonObject.idBB 	= idBuildingBlock;		
		var data = ajaxCall('GET','/blueloop-backend/LoadFile/processInventoryFile/', jsonObject, "text/json", "json", false);
		
		if(data.success){
			$("#typeFileSelected").val(""); 
			$("#typeFileSelected").html(""); 
			toastr.success(data.message);
		}else{
			toastr.error(data.message);
		}
	}

	return that;
}

$().ready(function() {
	window.attachmentController = new AttachmentController();
	attachmentController.init();
});