var NoSkusView = Backbone.View.extend({
	
	template: '/blueloop/static/js/loop/execution/sequence/main/template/NoSkusContent.ejs',
	
	constructor : function (options) {
		_.extend(this, options);
	},

	render: function() {
		this.$el = $(new EJS({url: this.template}).render({arch:this.isArquitect, idLoop:this.idLoop}));
		return this;
	},
});