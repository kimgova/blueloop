var forecastInstanceModel = Backbone.Model.extend({

  defaults: {
	  id:0,
      forecastChain: [],
      name: "",
      status:"",
      createDate: new Date(),
      signOffDate: null,
      autorizedBy:[],
      percentageComplete: "",
      month:'',
      year:'',
      userLeader: false
  }

});