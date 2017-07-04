var TeamMemberModel = Backbone.Model.extend({

  defaults: {
	  id:0,
	  idUser: 0,
      name: "",
      company: "",
      roles: {},
      layers: {},
      viewer: false,
      teamMember_id:0
  }

});