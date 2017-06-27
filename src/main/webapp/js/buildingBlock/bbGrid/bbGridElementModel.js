bbGridElementModel = Backbone.Model.extend({

  defaults: {
	  id:"",
      name: "",
      type: "",
      ownerName: "",
      responsible: "",
      company: "",
      email: "",
      phone: "",
      path: "",
      loops : "",
      ownership: "",
      lastUpdated: "",
      invited:false,
      archived:false
  }

});