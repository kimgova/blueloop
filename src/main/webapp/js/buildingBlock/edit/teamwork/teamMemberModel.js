var teamMemberModel = Backbone.Model.extend({

  defaults: {
	  id:null,
      name: "",
      user_id:null,
      company: "",
      role: "",
      bbPermissions:{},
      value:null
  }

});