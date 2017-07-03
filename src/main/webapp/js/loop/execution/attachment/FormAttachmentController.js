var FormAttachmentController = {
		
	setlistener: function() {
		$(document).off('click', '#deleteAttachDropbox');
		$(document).on('click', '#deleteAttachDropbox', function(e){
			FormAttachmentController.deleteRowAttach(e,this, 0);
		});	
		
		$(document).off('click', '#deleteAttachDisk');
		$(document).on('click', '#deleteAttachDisk', function(e){
			FormAttachmentController.deleteRowAttach(e,this, 1);
		});	
		
		$(document).off('click', '#downloadAttach');
		$(document).on('click', '#downloadAttach', function(e) {			
			var url = ($(this).attr("href"));
			url = "/blueloop/" + url.substr(url.indexOf("repos/"),url.length);
			var fileName = $(this).parent().parent().find('td:first-child').html().trim();
			FormAttachmentController.downloadFile(url, fileName);		
		});	
		
		$(document).on("change", "#inputFileAttachment", function() {
			$("#formUploadCBBAttachment").ajaxSubmit({
	            async: true,
	            url: "/blueloop/CBBAttachment/uploadFile",
	            success: function (data) { 
	            	FormAttachmentController.saveDiskAttachment(data.fileName, data.fileSize);
	            },
	            error: function(httpRequest, textStatus, errorThrown) { 
	 	     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
	 	     	   toastr.error(httpRequest.responseJSON.error);
	 	     	}
	        });

		});
		
		this.setDropboxChooserBtn();
	},
	
	getAttachaments: function(CBBjsonId) {
		this.getAttachByDropbox(CBBjsonId);
		this.getAttachByDisk(CBBjsonId);
		this.setlistener();
		this.resizeTable();
	},
	
	getAttachByDropbox: function(CBBjsonId){
		var jsonObject = new Object();
		jsonObject.jsonId = CBBjsonId;
		var result = ajaxCall('GET','/blueloop/CBBAttachment/getAllDropboxAttach/', jsonObject, "text/json", "json", false);
		this.listAttachDropbox = result.listAttachments;
		
		if(result.cbb == undefined){
			$("#attachFormContainer").find("#attachFromDropbox").attr("style","visibility:hidden;");
			$("#attachFormContainer").find("#attachFromDisk").attr("style","visibility:hidden;");
			$("#nodataAtt").remove(); 
			$("#attachFormContainer").append('<div id="nodataAtt" class="form-group"><label class="control-label">No data found</label></div>');
		}else{
			this.idcbb = result.cbb.id; 
			
			for(i=0; i<this.listAttachDropbox.length;++i){
				var link = this.listAttachDropbox[i].link;
				this.listAttachDropbox[i].link   = new EJS({url:'/blueloop/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"linkDropbox", link:link});
				this.listAttachDropbox[i].action = new EJS({url:'/blueloop/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"deleteDropbox"});
			}
			
			if (result.access)
				if (sessionUser.get("id") == result.access[0].user.id){
					$("#btnDropboxChooser"	 ).attr("style", "display:block;");
					$("#btnFileSystemChooser").attr("style", "display:block;");
					$(".panel-heading").attr("style", "margin-bottom: 0px;");
				}else{
					$("#btnDropboxChooser"	 ).attr("style", "display:none;");
					$("#btnFileSystemChooser").attr("style", "display:none;");
					$(".panel-heading").attr("style", "margin-bottom: 25px;");
				}
	
			$("#attachFormContainer").find("#attachFromDropbox").attr("style","visibility:visible;");
			$("#attachFormContainer").find("#attachFromDisk").attr("style","visibility:visible;");
			$("#nodataAtt").remove(); 
			this.setTableDropboxAttachment();
		}
	},
	getAttachByDisk: function(CBBjsonId){
		
		var jsonObject = new Object();
		jsonObject.jsonId = CBBjsonId;
		var result = ajaxCall('GET','/blueloop/CBBAttachment/getAllDiskAttach/', jsonObject, "text/json", "json", false);
		this.listAttachDisk = result.listAttachments;
		
		for(i=0; i<this.listAttachDisk.length;++i){
			var link = this.listAttachDisk[i].link;
			this.listAttachDisk[i].link   = new EJS({url:'/blueloop/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"linkDisk", link:link});
			this.listAttachDisk[i].action = new EJS({url:'/blueloop/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"download", link:link, fileName:this.listAttachDisk[i].fileName}) +
											new EJS({url:'/blueloop/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"deleteDisk"});
		}
		this.setTableDiskAttachment();		
	},
	
	setDropboxChooserBtn: function(){
		options = {	success: function(files) { // Required. Called when a user selects an item in the Chooser.
								FormAttachmentController.saveDropboxAttachment(files);	},
					linkType: "preview", // or "direct"
					multiselect: false, // or true
					extensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.png', '.jpg', '.gif', '.txt', '.odt'],
		};	
		$("#btnDropboxChooser").html("");
		var button = Dropbox.createChooseButton(options);
		document.getElementById("btnDropboxChooser").appendChild(button);
	},
	
	setTableDropboxAttachment: function(){	
		this.attachFromDropboxTable = $('#attachDropbox').dataTable({		
			"bScrollY": "100px",
			"bScrollCollapse": true,
			"bPaginate": false,
			"bProcessing": true,
			"aaData": this.listAttachDropbox,
			"bDestroy": true,
			"bJQueryUI": false,
			"sRowSelect": "single",
			"oTableTools": {"sRowSelect": "single"},
			"aoColumnDefs": [{ "bSortable": false, "aTargets": [ 1,2,3 ] },
			                 { "aTargets": [ 0 ], "bVisible": false }],
			"aoColumns": [{ mData: 'id', "sClass": "" },
			              { mData: 'fileName', "sClass": ""},
			              { mData: 'link', "sClass": ""},
			              { mData: 'action', "sClass": "" }],
	        'iDisplayLength': -1
		});	
	},

	setTableDiskAttachment: function(){			
		this.attachFromDiskTable = $('#attachDisk').dataTable({		
			"bScrollY"		 	: "100px",
			"bScrollCollapse"	: true,
			"bPaginate"		 	: false,
			"bProcessing"		: true,
			"aaData"			: this.listAttachDisk,
			"bDestroy"			: true,
			"bJQueryUI"			: false,
			"sRowSelect"		: "single",
			"oTableTools"		: {"sRowSelect": "single"},
			"aoColumnDefs"		: [{"bSortable": false, "aTargets": [1,2]},
			              		   	{"aTargets": [ 0 ], "bVisible": false} ],
			"aoColumns"			: [{mData: 'id', "sClass": "id"},
			           			   {mData: 'fileName', "sClass": ""},
			           			   {mData: 'action', "sClass": "" } ],
	        'iDisplayLength': -1
		});	
	},
	
	saveDropboxAttachment: function(files) {
		var Attach = new Object();
	    Attach.type     = 0;
	    Attach.idCBB     = this.idcbb;
	    Attach.fileName = files[0].name;
	    Attach.link     = files[0].link;

		var result = ajaxCall('POST', '/blueloop/CBBAttachment/saveAttachFromDropbox/', JSON.stringify(Attach), 'application/json; charset=utf-8', "json", false);
		var link = result.link;
		result.link   = new EJS({url:'/blueloop/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"linkDropbox", link:link}); 
		result.action = new EJS({url:'/blueloop/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"deleteDropbox"});
		this.listAttachDropbox.push(result);
		toastr.success(json.file.attachmentAdded);
		this.setTableDropboxAttachment();
		this.resizeTable();
	}, 
	
	saveDiskAttachment: function(fileName, fileSize){
		var Attach = new Object();
		Attach.type     = 1;
		Attach.idCBB     = this.idcbb;
		Attach.fileName = fileName;
	    Attach.fileSize = fileSize;

		var result = ajaxCall('POST', '/blueloop/CBBAttachment/saveAttachFromDisk/', JSON.stringify(Attach), 'application/json; charset=utf-8', "json", false);
		var link = result.link;	
		result.link   = new EJS({url:'/blueloop/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"linkDisk", link:link});
		result.action = new EJS({url:'/blueloop/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"download", link:link, fileName:result.fileName}) +
						new EJS({url:'/blueloop/static/js/ejsTemplates/btnsAttachments.ejs'}).render({type:"deleteDisk"});
		this.listAttachDisk.push(result);
		toastr.success(json.file.attachmentAdded);
		this.setTableDiskAttachment();
		this.resizeTable();
	},
	
	deleteRowAttach: function(e,context,from){ // param 'from': 0-dropbox, 1:disk
		e.preventDefault();		
		bootbox.confirm(json.general.deleteRow, function (e) {
		    if (e) {
		    	nRow = $(context).parents('tr')[0];
		    	if(from == 0)	var aData = FormAttachmentController.attachFromDropboxTable.fnGetData(nRow);
		    	else    		var aData = FormAttachmentController.attachFromDiskTable.fnGetData(nRow);
				var jsonObject      = new Object();
				jsonObject.idAttach = aData.id;
				var dataAjax = ajaxCall('GET','/blueloop/CBBAttachment/deleteAttach/', jsonObject, "text/json", "json", false);
				if(from == 0){
					FormAttachmentController.attachFromDropboxTable.fnDeleteRow(nRow);
					FormAttachmentController.listAttachDropboxRemove(aData.id);
				}else{
					FormAttachmentController.attachFromDiskTable.fnDeleteRow(nRow);
					FormAttachmentController.listAttachDiskRemove(aData.id);
				}
				toastr.success(json.file.attachmentRemoved);
		    } else {
		        return;
		    }
		});
	},
	
	listAttachDropboxRemove: function(pid) {		
		for(var i=0; i < FormAttachmentController.listAttachDropbox.length; i++){
			if(FormAttachmentController.listAttachDropbox[i].id === pid) {
				FormAttachmentController.listAttachDropbox.splice(i,1);       
		    }
		}			
	},	
	
	listAttachDiskRemove: function(pid) {		
		for(var i=0; i < FormAttachmentController.listAttachDisk.length; i++){
			if(FormAttachmentController.listAttachDisk[i].id === pid) {
				FormAttachmentController.listAttachDisk.splice(i,1);       
		    }
		}			
	},
	
	downloadFile: function(url, fileName) {
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
	},
	
	resizeTable: function(){
		$("#attachDropbox").css("width", "100%");
		$("#attachDisk").css("width", "100%");
	}
}