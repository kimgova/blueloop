singleChatModel = Backbone.Model.extend({
	  defaults: {
		  userId:"",
		  chatId:"",
	      firstName: "",
	      lastName: "",
	      channel: "",
	      type: "",
	      pic: "",
	      status: "", // is connected, away, busy
	      path: "",
	      state: 0, //0: closed, 1:opened
	      count: 0
	  }
});