var orderValveActivityModel = Backbone.Model.extend({

  defaults: {
	  id:0,
	  idValveOrder:0,
      description:"",
      imagePath:"",
      attachments:[],
      type: "",
      status:'', //checked or ""
      manualCheck:"", //disabled or ""
      requireManualCheck:true,
      requireAttachments:false,
      responsible:""
  }

});