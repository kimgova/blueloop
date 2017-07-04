var companyModel = Backbone.Model.extend({

  defaults: {
      id            :null,
      path          :"",
      company_name  :"",
      country_id    :"",
      country_name  :"",
      city_id       :"",
      city_name     :"", 
      email         :"",
      language_id   :"",
      language_name :"",
      phone         :""
  }

});