

require.config({
    paths: {
        jquery: 'lib/jquery',
        q: 'lib/q',
        underscore: 'lib/underscore',
        backbone: 'lib/backbone',

        serializeObject: 'app/helpers/serializeObject',

        coffee: 'app/coffee/coffee',
        coffees: 'app/coffee/coffees',
        coffeeController: 'app/coffee/controller',

        rating: 'app/rating/rating',
        ratings: 'app/rating/ratings',
        ratingController: 'app/rating/controller',

        router: 'app/router',
    }
});

require(['coffeeController', 'ratingController', 'router', 'backbone'],function(coffee, rating, router, Backbone){
	router.on('route:home', function(){
        router.navigate("#/coffee", true);
    });
    router.on('route:coffee', function(){
        coffee.coffeeList.render();
    });
    router.on('route:editCoffee', function(id){
        coffee.editCoffee.render({id: id});
    });
    router.on('route:rating', function(){
        rating.ratingList.render();
    });
    router.on('route:editRating', function(id){
        rating.editRating.render({id: id});
    });

    Backbone.history.start();
});
