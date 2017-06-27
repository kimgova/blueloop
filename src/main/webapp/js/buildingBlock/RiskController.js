function RiskController() {
    var that = this;
    var risksTable;
    var nEditingRisk = [];    
    var idSelectedBB;
    that.objectTemplate = {};
    that.template = "/blueloop-backend/static/js/buildingBlock/view/riskView.ejs";
    that.staticImgUrl = "";
    that.$imgForm = $(new EJS({url: "/blueloop-backend/static/js/buildingBlock/view/BBRiskImgGridView.ejs"}).render({}));
    
    that.init = function() {
        that.objectTemplate = {inputRiskName:false,inputSeason:false,inputProbability:false,inputResilience:false,btnsEdit:false,
                                btnSave:false,btnCancel:false,inputFilePath:false,inputStatus:false,inputCheckbox:false,img:false,
                                imgUpdate:false,figcaption:false,modalImg:false,labelError:false,forlbl:"",checked:"",disabled:"",
                                filePath:"",fileName:"",value:"",dataMode:""};
        bindEvents();
    }
    
    function bindEvents() {
        $(document).on('click', '#riskNew', function(e){
            createNewRiskRow(e);
        });
        
        $(document).on('click', '.cancelRisk', function(e){
            deleteNewRowRisk(e,this);
        });
        
        $(document).on('click', '.editRisk', function(e){
            editRisk(e,this);
        });

        $(document).on('click', '#chooseImgRisk', function(e){
            $("#image_chooser_modal").remove();    
            var modalView = new imageChooserModalView({context:window.riskController, imageType:3});
            modalView.render().$el.modal({backdrop: 'static',keyboard: false});
            setValueRowInModalImg(this);
        });
        
        $(document).on('click', '.saveRisk', function(e){
            $("#spinnerResilience").validate();
            var errors = validateFieldRisk(this);
            if ( !errors ){
                editRisk(e,this);
            }
        });
        
        $(document).on('click', '#deleteRisk', function(e){
            deleteRowRisk(e,this,true);
        });
        
    }
    
    that.createTableRisks = function(idBB){
        idSelectedBB = idBB;
        getRiskByBB(idBB);
    }

    function getRiskByBB(idBB){
        var jsonObject = new Object();
        jsonObject.idBB = idBB;
        var data = ajaxCall('GET','/blueloop-backend/bbRisk/getAllRisksByBB/', jsonObject, "text/json", "json", false);
    
        var listRisks = data.listRisks;
        that.staticImgUrl = data.staticImgUrl;
        for(i=0; i<listRisks.length;++i){
            listRisks[i].filePath = new EJS({url:that.template}).render(cloneDataForm(["img"],{filePath:that.staticImgUrl,fileName:listRisks[i].fileName}));
            listRisks[i].action   = new EJS({url:that.template}).render(cloneDataForm(["btnsEdit"]));
            if ( listRisks[i].status == "0" ){
                listRisks[i].status = new EJS({url:that.template}).render(cloneDataForm(["inputCheckbox"],{disabled:'disabled'}));
            }else{
                listRisks[i].status = new EJS({url:that.template}).render(cloneDataForm(["inputCheckbox"],{checked:'checked',disabled:'disabled'}));
            }
            
            var seasonText="";
            $.each(MONTHS, function(j, item){
                if(listRisks[i].season[item.value] != "" && listRisks[i].season[item.value] != undefined){
                    seasonText += item.text + " | ";
                }
            });
            listRisks[i].seasonText = seasonText;  
        }
        setTbodyRisksTable(listRisks);
        var rows = risksTable.rows();
        $.each(rows, function(key,row) {
            $("[name='risk_switch']",row).bootstrapSwitch();
            nEditingRisk.push(row);
        });
    }

    function setTbodyRisksTable(listRisks){    
        risksTable = $('#tableRisksByBB').DataTable( {
            "autoWidth"        : false,
            "scrollCollapse": true,
            "paging"        : false,
            "processing"    : true,
            "data"            : listRisks,
            "destroy"        : true,
            "jQueryUI"        : false,
            "select"        : false,
            "columnDefs"        : [{ "orderable": false, "targets": [ 0,6 ] },
                                     { "visible": false, "targets": [ 7,8,9 ] },
                                     { "className": "center", "targets": [ 0,1,2,3,4,5,6 ] }],
            "aoColumns"            : [{ "data": 'filePath'},
                                      { "data": 'name'},
                                      { "data": 'seasonText'},
                                      { "data": 'probability'},
                                      { "data": 'resilienceIndex'},
                                      { "data": 'status'},
                                      { "data": 'action'},
                                      
                                      { "data": 'id'},
                                      { "data": 'idBuildingB'},
                                      { "data": 'fileName'},
                                      { "data": 'season'}]
        });    
    }

    function createNewRiskRow(e){
         e.preventDefault();
         var random_id = Math.random().toString(36).substr(2, 5);
         var newData = {
             id:null, 
             idBuildingB:idSelectedBB,
             name:new EJS({url:that.template}).render(cloneDataForm(["inputRiskName"])),
             season:{},
             probability:new EJS({url:that.template}).render(cloneDataForm(["inputProbability"],{value:"0"})),
             resilienceIndex:new EJS({url:that.template}).render(cloneDataForm(["inputResilience"],{value:"0"})),
             status:new EJS({url:that.template}).render(cloneDataForm(["inputStatus"])),
             fileName:'images/risks/risksGeneral/Road Closure.png',
             filePath:new EJS({url:that.template}).render(cloneDataForm(["inputFilePath"])),
             action:new EJS({url:that.template}).render(cloneDataForm(["btnSave","btnCancel"],{dataMode:'data-mode="new"'})),
             seasonText:new EJS({url:that.template}).render(cloneDataForm(["inputSeason"],{season:{},random_id:random_id})),
         };
         var aiNew = risksTable.row.add(newData).draw().node();
         nEditingRisk.push(aiNew);
         $("[name='risk_switch']",aiNew).bootstrapSwitch('state', false);
         $(aiNew).find('.dropdown-menu').click(function(e) {
            e.stopPropagation();
        });
         
         setSpinner("#spinnerResilience", 1, 0, 100, "n"); 
         setSpinner("#spinnerProbability", 10, 0, 100, "n");
    }

    //Function makes a row editable 
    function editRowRisk(oTable, nRow) {
        var random_id = Math.random().toString(36).substr(2, 5);
        var aData = oTable.row(nRow).data(); 
        var jqTds = $('>td', nRow);
        jqTds[0].innerHTML = new EJS({url:that.template}).render(cloneDataForm(["figcaption","img"],{fileName:aData.fileName,filePath:that.staticImgUrl}));
        jqTds[1].innerHTML = new EJS({url:that.template}).render(cloneDataForm(["inputRiskName"]));
        jqTds[2].innerHTML = new EJS({url:that.template}).render(cloneDataForm(["inputSeason"],{season:aData.season,random_id:random_id}));
        jqTds[3].innerHTML = new EJS({url:that.template}).render(cloneDataForm(["inputProbability"],{value:"0"}));
        jqTds[4].innerHTML = new EJS({url:that.template}).render(cloneDataForm(["inputResilience"],{value:"0"}));
        jqTds[5].innerHTML = new EJS({url:that.template}).render(cloneDataForm(["inputStatus"]));
        jqTds[6].innerHTML = new EJS({url:that.template}).render(cloneDataForm(["btnSave","btnCancel"]))
        
        $("[name='risk_switch']",nRow).bootstrapSwitch('state', false);
        
        if($(aData.status).attr("checked") == "checked"){
            jqTds[5].innerHTML = new EJS({url:that.template}).render(cloneDataForm(["inputStatus"],{checked:'checked'}));
            $("[name='risk_switch']",nRow).bootstrapSwitch('state', true);
        }
        $(jqTds[1]).find('input').val(aData.name);
        $(jqTds[3]).find('input').val(aData.probability);
        $(jqTds[4]).find('input').val(aData.resilienceIndex);
        
        jqTds[7].innerHTML =  aData.season;
        
       $('.dropdown-menu').click(function(e) {
            e.stopPropagation();
        });
        
        setSpinner("#spinnerResilience", 1, 0, 100, "n"); 
        setSpinner("#spinnerProbability", 10, 0, 100, "n");
    
        nEditingRisk  = [];
        nEditingRisk.push(nRow);
    }

    function deleteNewRowRisk(e,context){
        e.preventDefault();
        if($(context).attr("data-mode") == "new") {
            var nRow = $(context).parents('tr')[0];
            risksTable.rows(nRow).remove().draw();
        }else{
            var nRow = $(context).parents('tr')[0];
            $.each(nEditingRisk, function(key, row){
                if(row == nRow){
                    restoreRow(risksTable, row);
                }
            });    
        }
    }

    function editRisk(e,context){
        e.preventDefault();        
        var nRow = $(context).parents('tr')[0]; /* Get the row as a parent of the link that was clicked on */
         
        if($(context).attr("id") == "saveRisk"){
            $.each(nEditingRisk, function(key,row){
                if(row == nRow){
                    saveRowRisk(risksTable, row);
                }
            });
        }else{
            $.each(nEditingRisk, function(key,row){
                if(row != nRow) {
                    restoreRow(risksTable, row);
                    editRowRisk(risksTable, nRow);
                }else{
                    editRowRisk(risksTable, nRow);
                }
            });
        }
        $("[name='risk_switch']",nRow).bootstrapSwitch();
    }

    function saveRowRisk(oTable, nRow) {
        var jqInputs = $('input:not(:checkbox.season-check)', nRow);
        var jqImg    = $('img', nRow);
        var aData    = oTable.row(nRow).data();
        var dataRisk = new Object();
        dataRisk.id              = aData.id;
        dataRisk.idBuildingB     = idSelectedBB;
        dataRisk.name            = jqInputs[0].value;
        dataRisk.probability     = jqInputs[1].value;
        dataRisk.resilienceIndex = jqInputs[2].value;
        dataRisk.status          = "0";
        if($("[name='risk_switch']", nRow).bootstrapSwitch('state')){
             dataRisk.status = "1";
        }
        if($(jqImg[0]).attr("filename")){
            aData.fileName = $(jqImg[0]).attr("filename");
        }
        dataRisk.fileName = aData.fileName;
        
        var jqCheckboxes  = $('input:checkbox.season-check:checked', nRow);
        var jqNotChecked  = $('input:checkbox.season-check:not(:checked)', nRow);
        var seasonObject = {};
        $.each(jqCheckboxes, function(i,element){
            seasonObject[$(element).attr("value")]="checked"; 
        });
        $.each(jqNotChecked, function(i,element){
            seasonObject[$(element).attr("value")]=""; 
        });
        dataRisk.season = seasonObject;
        
        var seasonText="";
        $.each(MONTHS, function(j, item){
            if(dataRisk.season[item.value] != "" && dataRisk.season[item.value] != undefined){
                seasonText += item.text + " | ";
            }
        });
        dataRisk.seasonText = seasonText;
        
        var result = ajaxCall('POST', '/blueloop-backend/bbRisk/saveRiskByBB/', JSON.stringify({risk:dataRisk}), 'application/json; charset=utf-8', "json", false);
        var risk   = result.BbRisk;
        dataRisk.id = risk.id;
        dataRisk.idBuildingB = risk.bb.id;
        dataRisk.filePath    = new EJS({url:that.template}).render(cloneDataForm(["img"],{filePath:that.staticImgUrl,fileName:risk.fileName}));
        dataRisk.status      = new EJS({url:that.template}).render(cloneDataForm(["inputCheckbox"],{disabled:'disabled'}));
        dataRisk.action      = new EJS({url:that.template}).render(cloneDataForm(["btnsEdit"]));
        if(risk.status == "1"){
            dataRisk.status = new EJS({url:that.template}).render(cloneDataForm(["inputCheckbox"],{checked:'checked',disabled:'disabled'}));
        }
        $("[name='risk_switch']",nRow).bootstrapSwitch();
        oTable.row(nRow).data(dataRisk);
        oTable.draw();
        toastr.success(json.risk.created);
    }

    that.setSelectedImage = function(modelImage){
        $("#selectedImgRiskDiv").remove();
        updateRowRiskWithImg(modelImage);
    }

    function updateRowRiskWithImg(modelImage){
        $("#tableRisksByBB tbody tr").each(function (index,row) {
            if ( $("#fnGetPositionRisk").val() == index ){
                var ntr = $(this).find("#chooseImgRisk").parents('tr')[0];
                var aData       = risksTable.row( ntr ).data();
                var jqInputs    = $('input:not(:checkbox.season-check)', ntr);
                var jqTds       = $('>td', ntr);
                jqTds[0].innerHTML = new EJS({url:that.template}).render(cloneDataForm(["figcaption","imgUpdate"],
                                                {fileName:modelImage.get("key"),filePath:modelImage.get("filePath")}));
                jqTds[6].innerHTML = new EJS({url:that.template}).render(cloneDataForm(["btnSave","btnCancel"]));
            }
        });
    }

    function deleteRowRisk(e,context){
        e.preventDefault();
        bootbox.confirm(json.general.deleteRow, function (e) {
            if(e){
                var nRow          = $(context).parents('tr')[0];   
                   var aData         = risksTable.row(nRow).data();
                var jsonObject    = new Object();
                jsonObject.idRisk = aData.id;
                jsonObject.idBB   = idSelectedBB;
                var dataAjax      = ajaxCall('GET','/blueloop-backend/bbRisk/deleteRiskByBB/', jsonObject, "text/json", "json", false);
                if(dataAjax.message != undefined){
                    toastr.error(json.risk.noDeleed+" "+dataAjax.message);
                }else{
                    risksTable.rows(nRow).remove().draw();
                    toastr.success(json.risk.deleted);
                }
            }
        });
    }
    
    function setValueRowInModalImg(context){
        var nRow = $(context).parents('tr')[0];
        var rowPosition = null;
        $("#tableRisksByBB tbody tr").each(function (index,row) {
            if(nRow == row){
                rowPosition = index;
            }
        });
        $("#fnGetPositionRisk").val(rowPosition);
    }

    function validateFieldRisk(context){
        var nRow = $(context).parents('tr')[0];
        var jqInputs  = $('input:not(:checkbox.season-check)', nRow);
        var errors = false;
        $("label.error").remove();
        
        if (jqInputs[0].value == ""){ //name
            $(jqInputs[0]).parent().append( new EJS({url:that.template}).render(cloneDataForm(["labelError"],{forlbl:"nameRisk"})) );
            errors = true;
        }        
        
        if ($('input:checkbox.season-check:checked', nRow).length == 0){ //season
            var jqCheckboxes  = $('input:checkbox.season-check', nRow);
            var td = $(jqCheckboxes[0]).parents('td').last();
            td.append( new EJS({url:that.template}).render(cloneDataForm(["labelError"],{forlbl:""})) );
            errors = true;
        }        
        
        return errors;
    }
    
    function restoreRow(oTable, nRow){
        var aData = oTable.row(nRow).data();
        oTable.row(nRow).data(aData);
        oTable.draw();
        $("[name='risk_switch']",nRow).bootstrapSwitch();
    }
    
    function setSpinner(elem, pStep, pMin, pMax, pNumberFormat ){
        $( elem ).spinner({
            step: pStep,
               min: pMin, 
               max: pMax,
               numberFormat: pNumberFormat,
               increment:true,
               decimals: 1
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
    window.riskController = new RiskController();
    riskController.init();
});