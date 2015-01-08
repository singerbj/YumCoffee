define(function (require) {
    var _ = require("underscore");    
    var $ = require("jquery");
    var Backbone = require("backbone");
    var serializeObject = require("serializeObject");
    var router = require("router");
    var Coffees = require("coffees");

    

    var Rating = Backbone.Model.extend({
        urlRoot: "/rating"
    });
    
    return Rating;
});