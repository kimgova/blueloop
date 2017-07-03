var forecastModuleView = {
		
		nodataTemplate:'/blueloop/static/js/loop/forecast/fcstChain/main/template/nodatafound.ejs',
		
		init:function (){
			if(localStorage.getItem("loopId") != "all"){
				this.setOneLoopPage(localStorage.getItem('loopId'));
			}else{
				this.setAllLoopsPage();
			}
		},
		
		setOneLoopPage:function(loopId){
			var listForecast = this.getAllForecastByLoop(loopId);
			if(listForecast.length == 0){
				this.showModelModal();
			}else{
				this.oneLoopView = new forecastOneLoopView({ model: {listForecast:listForecast}});
				this.oneLoopView.init();
				$("#forecasts").html(this.oneLoopView.render().$el);
			}
		},
		
		setAllLoopsPage:function(){
			var listForecast = this.getAllForecasts();
			if(listForecast.length > 0){
				this.allLoopView = new forecastAllLoopView({ model: {data:listForecast}});
				this.allLoopView.init();
				$("#forecasts").html(this.allLoopView.render().$el);	
			}else{
				$("#forecasts").html($(new EJS({url:this.nodataTemplate}).render()));
			}
			
		},
		
		getAllForecastByLoop:function(loopId){
			var dataReturned = $.ajax({
		        type: 'GET',
		        url: '/blueloop/forecast/getAllForescastByLoop/',
		        data: {id:loopId},
		        contentType: 'application/json; charset=utf-8',
		        dataType: 'json',
		        async: false,
		        success: function(data, textStatus) {
		        	data =  data;
		        },
		    	error: function(httpRequest, textStatus, errorThrown) { 
		     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
		     	   toastr.error(json.error.tryAgain);
		     	}
		    });
			return dataReturned.responseJSON;
		},
		
		getAllForecasts:function(){
			var dataReturned = $.ajax({
		        type: 'GET',
		        url: '/blueloop/forecast/getAllForescasts/',
		        data: {},
		        contentType: 'application/json; charset=utf-8',
		        dataType: 'json',
		        async: false,
		        success: function(data, textStatus) {
		        	data =  data;
		        },
		    	error: function(httpRequest, textStatus, errorThrown) { 
		     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
		     	   toastr.error(json.error.tryAgain);
		     	}
		    });
			return dataReturned.responseJSON;
		},
		
		showModelModal:function(){
			var modelView = new forecastModelView({ model:this.getAllForecastModels()});
			modelView.render().$el.modal({backdrop: 'static',keyboard: false});
		},
		
		getAllForecastModels:function(){
			var dataReturned = $.ajax({
		        type: 'GET',
		        url: '/blueloop/forecast/getAllForescastModels/',
		        data: {},
		        contentType: 'application/json; charset=utf-8',
		        dataType: 'json',
		        async: false,
		        success: function(data, textStatus) {
		        	data =  data;
		        },
		    	error: function(httpRequest, textStatus, errorThrown) { 
		     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
		     	   toastr.error(json.error.tryAgain);
		     	}
		    });
			return dataReturned.responseJSON;
		}
		
}

//$().ready(function() {
//	forecastModuleView.init();
//});