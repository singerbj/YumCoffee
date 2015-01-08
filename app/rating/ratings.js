define(function (require) {
    var _ = require("underscore");    
    var $ = require("jquery");
    var Backbone = require("backbone");
    var serializeObject = require("serializeObject");
    var router = require("router");

    var Ratings = Backbone.Collection.extend({
        url: "/rating"
    });

    return Ratings;
});	
