//////////////////////////////////////////////////////////////////////////
//Serialize Form to Obj

$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

//////////////////////////////////////////////////////////////////////////

var Coffees = Backbone.Collection.extend({
    url: "/coffee"
});

var Coffee = Backbone.Model.extend({
    urlRoot: "/coffee"
});

//////////////////////////////////////////////////////////////////////////

var CoffeeList = Backbone.View.extend({
    el: '.page',
    render: function(){
        var that = this;
        var coffees = new Coffees();
        coffees.fetch({
            success: function(coffees){
                this.coffees = coffees.toJSON();
                var template = _.template($('#coffee-list-template').html());
                that.$el.html(template);
            }
        });
    }
});

var coffeeList = new CoffeeList();

//////////////////////////////////////////////////////////////////////////

var EditCoffee = Backbone.View.extend({
    el: '.page',
    render: function(){
        var that = this;
        var template = _.template($('#coffee-form-template').html());
        that.$el.html(template);
    },
    events: {
        'submit .coffeeForm': 'saveCoffee'
    },
    saveCoffee: function(ev){
        var coffeeDetails = $(ev.currentTarget).serializeObject();
        var coffee = new Coffee();
        coffee.save(coffeeDetails, {
            success: function(coffee){
                router.navigate('', {trigger: true});
            },
            error: function(coffee){
                router.navigate('', {trigger: true});
            }
        });
        return false;
    }
});

var editCoffee = new EditCoffee();

//////////////////////////////////////////////////////////////////////////

var Router = Backbone.Router.extend({
   routes: {
       '': 'home',
       'new': 'editCoffee'
   }
});

var router = new Router();
router.on('route:home', function(){
    coffeeList.render();
});
router.on('route:editCoffee', function(){
    editCoffee.render();
});

Backbone.history.start();
