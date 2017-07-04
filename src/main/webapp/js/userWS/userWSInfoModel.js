userWSInfoModel = Backbone.Model.extend({

  defaults: {
	  id:"",
	  path: "", //picture path
      firstName: "",
      lastName: "",
      lastSeen: "", 
      email: "",
      phone:"",
      areaCode: "",
      company:"",
      country: "",
      department: "",
      occupation: "",
  }

});