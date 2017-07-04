var fileModel = Backbone.Model.extend({

    defaults : {
        process:PROCESS_STATUS.SELECCION,
        client_id: null,
        client_name:"",
        file_name:"",
        upload_date:"",
        bb_id:null
    }

});