Backbone.View.prototype.close = function() {
    console.log('Closing view ' + this);
    if (this.beforeClose) {
        this.beforeClose();
    }
    this.remove();
    this.unbind();
};

var wtw = {

    gmap : {},

    views : {},

    models : {},

    loadTemplates : function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
            if (wtw[view]) {
                deferreds.push($.get('tpl/' + view + '.html', function(data) {
                    wtw[view].prototype.template = _.template(data);
                }, 'html'));
            } else {
                alert(view + " not found");
            }
        });

        $.when.apply(null, deferreds).done(callback);
    }

};

wtw.Config = {
    Local : {
        wtw_url : 'localhost:4000'
    },
    Dev : {
        wtw_url : 'localhost:4000'
    },
    Production : {
        wtw_url : 'www.jimomulloy.co.uk:4000'
    }
}

wtw.ConfigHandler = {
    getValue : function(key) {
        var env;
        switch (window.location.hostname) {
        case "localhost":
        case "127.0.0.1":
            env = 'Dev';
            break;
        case "dev.yourdomain.com":
            env = 'Dev';
            break;
        case "www.jimomulloy.co.uk":
            env = 'Production';
            break;
        default:
            throw ('Unknown environment: ' + window.location.hostname);
        }
        console.log("Get Config from env:"+env);
        return wtw.Config[env][key];
    }
};

wtw.Router = Backbone.Router.extend({

    routes : {
        "" : "home",
        "home" : "home",
        "weather" : "weather",
        "organon" : "organon",
        "mcloud" : "mcloud",
        "contact" : "contact",
        "employees/:id" : "employeeDetails"
    },

    initialize : function() {
        wtw.shellView = new wtw.ShellView();
        $('body').html(wtw.shellView.render().el);
        // Close the search dropdown on click anywhere in the UI
        $('body').click(function() {
            $('.dropdown').removeClass("open");
        });
        this.$content = $("#main-container");
        wtw.shellView.selectMenuItem('home-menu');
    },

    weather : function() {
        // Since the weather view never changes, we instantiate it and render it
        // only once
        wtw.weatherReport = new wtw.WeatherReport();
        if (!wtw.weatherView) {
            wtw.weatherView = new wtw.WeatherView({
                model : wtw.weatherReport
            });
            wtw.weatherView.render();
            this.$content.html(wtw.weatherView.el);
            //wtw.weatherView.googleMapsInitialize();
        } else {
            wtw.weatherView.delegateEvents();
            this.$content.html(wtw.weatherView.el);
        }
        wtw.shellView.selectMenuItem('weather-menu');
    },

    home : function() {
        // Since the home view never changes, we instantiate it and render it
        // only once
        if (!wtw.homeView) {
            wtw.homeView = new wtw.HomeView();
            wtw.homeView.render();
            this.$content.html(wtw.homeView.el);
        } else {
            wtw.homeView.delegateEvents(); // delegate events when the view is
            // recycled 
            this.$content.html(wtw.homeView.el);
        }
        wtw.shellView.selectMenuItem('home-menu');
    },

    contact : function() {
        if (!wtw.contactView) {
            wtw.contactView = new wtw.ContactView();
            wtw.contactView.render();
            this.$content.html(wtw.contactView.el);
        } else {
            wtw.contactView.delegateEvents(); // delegate events when the view is
            // recycled 
            this.$content.html(wtw.contactView.el);
        }
        wtw.shellView.selectMenuItem('contact-menu');
    },

    organon : function() {
        if (!wtw.organonView) {
            wtw.organonView = new wtw.OrganonView();
            wtw.organonView.render();
            this.$content.html(wtw.organonView.el);
            wtw.organonView.configScreen();
        } else {
            wtw.organonView.delegateEvents(); // delegate events when the view is
            // recycled
            this.$content.html(wtw.organonView.el);
        }
        wtw.shellView.selectMenuItem('organon-menu');
    },

    mcloud : function() {
        if (!wtw.mcloudView) {
            wtw.mcloudView = new wtw.McloudView();
            wtw.mcloudView.render();
            this.$content.html(wtw.mcloudView.el);
        } else {
            wtw.organonView.delegateEvents(); // delegate events when the view is
            // recycled
            this.$content.html(wtw.mcloudView.el);
        }
        wtw.shellView.selectMenuItem('mcloud-menu');
    },

    employeeDetails : function(id) {
        var employee = new wtw.Employee({
            id : id
        });
        var self = this;
        employee.fetch({
            success : function(data) {
                console.log(data);
                // Note that we could also 'recycle' the same instance of
                // EmployeeFullView
                // instead of creating new instances
                self.$content.html(new wtw.EmployeeView({
                    model : data
                }).render().el);
            }
        });
        wtw.shellView.selectMenuItem();
    }

});

$(document).on(
        "ready",
        function() {
            wtw.loadTemplates([ "WeatherView", "WeatherReportView", "WeatherSourceView", "WeatherRecordingView", "WeatherPastView", "WeatherForecastView", "WeatherScoreView", "WeatherSummaryView",
                    "WeatherBarometerView", "HomeView", "ContactView", "ShellView", "EmployeeView", "EmployeeSummaryView", "EmployeeListItemView", "OrganonView", "McloudView" ], function() {
                wtw.router = new wtw.Router();
                Backbone.history.start();
                wtw.shellView.selectMenuItem('home-menu');
            });
        });
