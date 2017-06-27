var peopleMainView = Backbone.View.extend({
    
	template: '/blueloop-backend/static/js/people/template/peopleMainViewTemplate.ejs',
	
    initialize: function (){

		this.render();
		
		this.gridTopbar = new peopleTopbarView();
		this.renderGridTopbar();

		window.peopleGrid = new peopleGridView();
    	this.renderPeopleGrid();
	},
	
    render: function() {
    	this.$el = $(new EJS({url: this.template }).render());
    	$('#grid-section').append(this.$el);
        return this;
    },
    
    renderGridTopbar : function(){
    	this.$el.find('#people-grid-topbar').append(this.gridTopbar.render().$el);
    },
    
    renderPeopleGrid: function() {
       this.$el.find('#people-grid-container').append(peopleGrid.render().$el);
    }
    
    
   
});

$().ready(function() {
	window.peopleView = new peopleMainView();
    $('[data-toggle="tooltip"]').tooltip();
	
	$('#people-grid').on('scroll', function() {
        if($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight) {
            peopleGrid.load();
        }
    });
});