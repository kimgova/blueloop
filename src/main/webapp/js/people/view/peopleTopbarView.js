var peopleTopbarView = Backbone.View.extend({
    
	template: '/blueloop/static/js/people/template/peopleTopbarViewTemplate.ejs',
    
    initialize: function (){
		this.render();
	},
    
    render: function() {
    	this.$el = $(new EJS({url: this.template }).render());
    	this.$el.find('#search-box input').keyup(this,this.search);
    	this.$el.find('#filter-connections li').click(this,this.filter);
        return this;
    },
    
    search: function(){
		var letters = $("#search-box input").val();
		peopleGrid.filterSearch(letters);
	},
	
	filter: function(e){
		e.preventDefault();
        var elementId = e.target.id;
        peopleGrid.filteredCollection(elementId);//////////
	}
});