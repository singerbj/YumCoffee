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
                window.coffees = _.sortBy(coffees.toJSON(), function(o) {
                    return o.id;
                });
                var template = _.template($('#coffee-list-template').html());
                that.$el.html(template);
            }
        });
    },
    events: {
        'click .delete': 'deleteCoffee'
    },
    deleteCoffee: function(ev){
        var coffeeid = parseInt($(ev.currentTarget)['0'].attributes['2'].value, 10);
        var coffee = new Coffee({id: coffeeid});
        var r = window.confirm("Are you sure?");
        if(r) {
            coffee.destroy({
                success: function () {
                    router.navigate('#/', {trigger: true});
                },
                error: function () {
                    router.navigate('#/', {trigger: true});
                }
            });
        }
    }
});

var coffeeList = new CoffeeList();

//////////////////////////////////////////////////////////////////////////

var EditCoffee = Backbone.View.extend({
    el: '.page',
    reset: function(){
        this.render();
    },
    render: function(options){
        var that = this;
        if(options.id) {
            var coffee = new Coffee({id: options.id});
            coffee.fetch({
                success: function(coffee) {
                    window.coffee = coffee.toJSON()[0];
                    var template = _.template($('#coffee-form-template').html());
                    that.$el.html(template);
                }
            });
        }else{
            window.coffee = null;
            var template = _.template($('#coffee-form-template').html());
            that.$el.html(template);
        }
    },
    events: {
        'submit .coffeeForm': 'saveCoffee'
    },
    saveCoffee: function(ev){
        var coffeeDetails = $(ev.currentTarget).serializeObject();
        var coffee = new Coffee();
        coffee.save(coffeeDetails, {
            success: function(){
                router.navigate('#/', {trigger: true});
            },
            error: function(){
                router.navigate('#/', {trigger: true});
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
       'new': 'editCoffee',
       'edit/:id': 'editCoffee'
   }
});

var router = new Router();
router.on('route:home', function(){
    coffeeList.render();
});
router.on('route:editCoffee', function(id){
    editCoffee.render({id: id});
});

Backbone.history.start();
