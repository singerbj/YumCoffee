define(function (require) {
    var Backbone = require("backbone");

    var Router = Backbone.Router.extend({
        routes: {
           '': 'home',
           'coffee': 'coffee',
           'coffee/new': 'editCoffee',
           'coffee/edit/:id': 'editCoffee',
           'rating': 'rating',
           'rating/new': 'editRating',
           'rating/edit/:id': 'editRating'
        }
    });    

    return new Router();
});
