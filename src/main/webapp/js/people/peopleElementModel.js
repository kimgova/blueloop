peopleElementModel = Backbone.Model.extend({

  defaults: {
	  id:"",
      firstName: "",
      lastName: "",
      department: "", //?
      email: "",
      status: "", // is connected, away, busy
      connection: "", //friend/not friend/pending
      request: "", //true/false
      path: "",
  }

});