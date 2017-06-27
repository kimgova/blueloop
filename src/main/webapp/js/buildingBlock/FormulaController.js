function FormulaController() {
	
	var that = this;
	var idField;
	var idBB;
	var BBnFieldsData  = [];
	var formulaField;
	var listFormulaElements = [];
	var tempSelectedInput;
	var tempCursorPos;
	that.objectTemplate = {};
	that.template = "/blueloop-backend/static/js/buildingBlock/view/formulaView.ejs";
	
	that.init = function() {
		that.objectTemplate = {taginput:false,elementHtml:false,elemId:"",elemFull:"",elemLbl:"",size:"1",value:""};
		bindEvents();
		setQuickSearchs();
    }
	
	that.initField = function(obj) {
		var result = getFormula();
		that.formulaField = obj;
		that.formulaField.empty();
		that.tempSelectedInput = null;
		that.tempCursorPos = null;
		if(!result.formula){
			that.formulaField.append( new EJS({url:that.template}).render(cloneDataForm(["taginput"])) );
			bindFieldEvents();
		}else{
			buildFormula(result.formula.split(/[{}]/))
		}
    }
	
	that.setIdField = function(id){
		idField = id;
	}
	
	that.setIdBB = function(id){
		idBB = id;
	}
	
	that.setData = function(){
		getBBs();
	}
	
	that.getData = function(){
		return BBnFieldsData;
	}
	
	function getFormula(){
		var jsonObject = new Object();
		jsonObject.idField = idField;
		jsonObject.idBB = idBB;
		var result = ajaxCall('GET','/blueloop-backend/buildingBlock/getFormula/', jsonObject, "text/json", "json", false);
		return result;
	}
	
	function bindEvents() {
		$(document).on('click', '#addToFormula', function(e){			
			field 			  	= new Object();
			field.bbId 			= $("#selectBB").val();
			field.bbName 	  	= $("#selectBB option:selected").text();				
			field.categoryId 	= $("#selectCategory").val();
			field.categoryName	= $("#selectCategory option:selected").text();
			field.fieldId  	  	= $("#selectField").val();
			field.fieldName 	= $("#selectField option:selected").text();
			if(field.fieldId == null)
				toastr.error(json.formula.errorSelect);
			else
				addToFormula(field);		
		});
		
		$(document).on('change', '#selectCategory', function(e){
			getFields($("#selectBB").val(),$("#selectCategory").val());
		});
		
		$(document).on('change', '#selectBB', function(e){
			getFields($("#selectBB").val(),$("#selectCategory").val());
		});
		
		$(document).on('click', '#saveFormula', function(e){
			saveFormula();
		});
	}
	
	function bindFieldEvents(){
		that.formulaField.find("input").keyup(function() {
        	if (!this.savesize) this.savesize=this.size;
        	this.size=Math.max(this.savesize,this.value.length);
        	getInputCursorPos(this);
        });
		
		that.formulaField.find("input").click(function() {
        	that.tempSelectedInput = this;
        	getInputCursorPos(this);
        });
		
		that.formulaField.find("a").click(function() {
        	$(this).parent().next().remove();
        	$(this).parent().remove();
        });
	}
		
	function setQuickSearchs(){
		var qsbb 		= $('input#searchBB').quicksearch('select#selectBB option');
		var qscategory 	= $('input#searchCategory').quicksearch('select#selectCategory option');
		var qsfield 	= $('input#searchField').quicksearch('select#selectField option');
	}
		
	function getBBs(){
		$("#selectBB").html("");
		$("#selectField").html("");
		BBnFieldsData = [];
		
		var data = ajaxCall('GET','/blueloop-backend/buildingBlock/getMyNetworkBB/', null, "text/json", "json", false);
		$(data).each(function(i,item){
			$("#selectBB").append($('<option>', {value: item.bb.id,text : item.bb.name}));

			addBBnFieldsData(item.bb.id,item.bb.name,2,"Operating parameter",JSON.parse(item.config));
//			addBBnFieldsData(item.bb.id,item.bb.name,1,"General", new Object());  //TO DO: get fields of general category in the query
			addBBnFieldsData(item.bb.id,item.bb.name,3,"Inventory", new Object());//TO DO: get fields of inventory category in the query			
		});		
	}
	
	function addBBnFieldsData(bbid,bbname,categoryid,categoryname,arrayfields){
		fieldsData 			  	= new Object();
		fieldsData.bbId 		= bbid;
		fieldsData.bbName 	  	= bbname;				
		fieldsData.categoryId 	= categoryid;
		fieldsData.categoryName	= categoryname;
		fieldsData.fields  	  	= arrayfields;
		BBnFieldsData.push(fieldsData);
	}
	
	function addToFormula(objField){
		var element = setFormulaElement(objField);
		var elementHtml = new EJS({url:that.template}).render(cloneDataForm(["elementHtml"],
									{elemId:element.id,elemFull:element.full,elemLbl:element.lbl}));
		var inputHtml = new EJS({url:that.template}).render(cloneDataForm(["taginput"]));
		if(that.tempSelectedInput){
			var inputSize = $(that.tempSelectedInput).val().length;
			if(inputSize > that.tempCursorPos){
				var newInputSize = inputSize - that.tempCursorPos;
				var val = $(that.tempSelectedInput).val().slice(that.tempCursorPos,inputSize);
				
				elementHtml += new EJS({url:that.template}).render(cloneDataForm(["taginput"],
										{size:newInputSize,value:val}));
				
				$(that.tempSelectedInput).val($(that.tempSelectedInput).val().slice(0,that.tempCursorPos));
				
				if(that.tempCursorPos == 0){
					$(that.tempSelectedInput).attr('size',1)
				}else{
					$(that.tempSelectedInput).attr('size',that.tempCursorPos)
				}
			}else{
				elementHtml += inputHtml;
			}
			$(elementHtml).insertAfter($(that.tempSelectedInput).parent())
			$(that.tempSelectedInput).focus()
		}else{
			elementHtml += inputHtml;
			that.formulaField.append(elementHtml);
		}
		bindFieldEvents();
	}
	
	function getInputCursorPos(input){
		var el = $(input).get(0);  
        var pos = 0;  
        if ('selectionStart' in el) {  //Chrome & Firefox
            pos = el.selectionStart;  
        } else if ('selection' in document) {  //IE
            el.focus();  
            var Sel = document.selection.createRange();  
            var SelLength = document.selection.createRange().text.length;  
            Sel.moveStart('character', -el.value.length);  
            pos = Sel.text.length - SelLength;  
        }  
        that.tempCursorPos = pos;
	}
	
	function setFormulaElement(objField){
		var element = new Object();
		element.id = listFormulaElements.length
		listFormulaElements.push("{'bb':'" + objField.bbId + "','cat':'" + objField.categoryId + "','field':'" + objField.fieldId + "'}")
		element.lbl = objField.bbName.slice(0,3) + "." + objField.categoryName.slice(0,3) + "." + objField.fieldName.slice(0,3)
		element.full = objField.bbName + "." + objField.categoryName + "." + objField.fieldName;
		return element
	}
	
	function buildFormula(formulaArray){
		_.each(formulaArray,function(ele,i){
			if(ele.slice(0,1) == "'" ){
				if(i == 0){
					addInput("");
				}
				var field = setFormulaElement(buildField(ele));
				addField(field);
				if(i == (formulaArray.length - 1)){
					addInput("");
				}
			}else{
				addInput(ele);
			}
		});
		bindFieldEvents();
		var lastInput = $(that.formulaField).find("input:last").focus();
	}
	
	function buildField(ele){
		var objEle = JSON.parse('{' + ele.replace(/'/g, '\"') + '}');
		var fullObj = new Object();
		_.each(BBnFieldsData,function(bb,i){
			if(bb.bbId == objEle.bb && bb.categoryId == objEle.cat){
				fullObj.bbId = bb.bbId;
				fullObj.bbName = bb.bbName;
				fullObj.categoryId = bb.categoryId;
				fullObj.categoryName = bb.categoryName;
				_.each(bb.fields,function(field,i){
					if(field.id == objEle.field){
						fullObj.fieldId = field.id;
						fullObj.fieldName = field.description;
					}
				});
			}
		});
		return fullObj;
	}
	
	function addField(element){
		var elementHtml = new EJS({url:that.template}).render( cloneDataForm(["elementHtml"],
									{elemId:element.id,elemFull:element.full,elemLbl:element.lbl}) );
		that.formulaField.append(elementHtml);
	}
	
	function addInput(ele){
		var size = 1;
		if(ele.length > 0){
			size = ele.length;
		}
		var elementHtml = new EJS({url:that.template}).render(cloneDataForm(["taginput"],
									{size:size,value:ele}));
		that.formulaField.append(elementHtml);
	}
	
	function getFields(idbb,idcategory){
		$("#selectField").html("");
		for(var i=0; i < BBnFieldsData.length; i++){
			if(BBnFieldsData[i].bbId == idbb && BBnFieldsData[i].categoryId == idcategory) {
				$.each(BBnFieldsData[i].fields, function(j, field){
					if(field.type == "number" && !(idField == field.id && idBB == idbb))
						$("#selectField").append($('<option>', {value: field.id, text: field.description}));
				});	
			}
		}
	}
	
	function saveFormula(){
		var formula = "";
		_.each(that.formulaField.children(),function(ele,i){
			if($(ele).attr("class") == "taginput"){
				formula += $(ele).find("input").val();
			}else{
				formula += listFormulaElements[$(ele).attr('id')];
			}
		});
		
		var jsonObject = new Object();
		jsonObject.idField = idField;
		jsonObject.idBB = idBB;
		jsonObject.formula = formula;
		var result = ajaxCall('GET','/blueloop-backend/buildingBlock/saveFormula/', jsonObject, "text/json", "json", false);
		
		if(result.success){
			$("#formulaEditorModal").modal("hide");
			$("#dynamic-bb-form").find("input#"+idField).val(result.value);
			toastr.success(json.formula.saved);
			
			$("#dynamic-bb-form").find("input#"+idField).attr('disabled','disabled');
			$("#dynamic-bb-form").find("input#"+idField).parent().parent().find(".removeFormula").removeAttr('disabled');
			
		}else{
			if(result.value == "format"){
				toastr.error(json.formula.errorFormat);
			}else if(result.value == "circular") {
				toastr.error(json.formula.circularReference);
			}else{
				toastr.error(json.formula.generalError);
			}
		}
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
	
	that.removeFormula = function (){
		var messageconfirm = "";		
		var jsonObject     = new Object();
		jsonObject.idField = idField;
		jsonObject.bb      = idBB;		
		var used = ajaxCall('GET','/blueloop-backend/buildingBlock/validateFieldInFormula/', jsonObject, "text/json", "json", false);
		
		if(used.inFormula){
			messageconfirm = json.formula.inFormula + json.formula.confirmRemove;
		}else{ 
			messageconfirm = json.formula.confirmRemove;
		}
		
		bootbox.confirm(messageconfirm, function (e) {
		    if (e){
				var result = ajaxCall('GET','/blueloop-backend/buildingBlock/removeFormula/', jsonObject, "text/json", "json", false);
				if(result.success){
					toastr.success(json.formula.removed);
					$("#dynamic-bb-form").find("input#"+idField).val("");
					$("#dynamic-bb-form").find("input#"+idField).removeAttr('disabled');
					$("#dynamic-bb-form").find("input#"+idField).parent().parent().find(".removeFormula").attr('disabled','disabled');
				}else{
					toastr.error(json.formula.errorRemove);
				}
		    } else {
		        return;
		    }
		});		
	}
	
	return that;
}

$().ready(function() {
	window.formulaController = new FormulaController();
	formulaController.init();
});