wtw.WeatherSourceView = Backbone.View.extend({

    tagName : 'div',

    className : 'col-md-4',

    childCurrentView : {},
    childForecastViews : [],
    childPastViews : [],
    childRetroViews : [],
    childScoreView : {},

    initialize : function() {
        // this.model.on("change", this.updateModel, this);
    },

    render : function() {
        this.$el.html(this.template(this.model.toJSON()));

        var yesterday = new Date().getTime() - (1000 * 60 * 60 * 24);
        var hourAgo = new Date().getTime() - (1000 * 60 * 60);
        var source = this.model.get("source");
        var currentWeather = this.model.get("recordings")[0];
        var recordings = this.model.get("recordings");
        var forecasts = this.model.get("forecasts");
        var pastRecordings = this.model.get("pastRecordings");
        var retroForecasts = this.model.get("retroForecasts");
        var score = this.model.get("score");

        this.childCurrentView = new wtw.WeatherRecordingView({
            model : currentWeather
        });
        this.$('#wtw-current-container' + source).append(this.childCurrentView.render().$el);
        var cond = currentWeather.get("condition");
        this.childCurrentView.delegateEvents;

        for (var i = forecasts.length-1; i >= 0; i--) {
            if (forecasts[i].get("writeTime") > yesterday) {
                this.childForecastViews[i] = new wtw.WeatherForecastView({
                    model : forecasts[i]
                });
                this.$('#wtw-forecast-container' + source).append(this.childForecastViews[i].render().$el);
                this.childForecastViews[i].delegateEvents();
            }
        }

        for (var i = 0; i < pastRecordings.length; i++) {
            if (pastRecordings[i].get("writeTime") < hourAgo) {
                this.childPastViews[i] = new wtw.WeatherPastView({
                    model : pastRecordings[i]
                });
                this.$('#wtw-past-container' + source).append(this.childPastViews[i].render().$el);
                this.childPastViews[i].delegateEvents();
            }
        }

        for (var i = 0; i < retroForecasts.length; i++) {
            if (retroForecasts[i].get("writeTime") <= yesterday) {
                this.childRetroViews[i] = new wtw.WeatherForecastView({
                    model : retroForecasts[i]
                });
                this.$('#wtw-retro-container' + source).append(this.childRetroViews[i].render().$el);
                this.childRetroViews[i].delegateEvents();
            }
        }

        this.childScoreView = new wtw.WeatherScoreView({
            model : currentWeather
        });
        this.$('#wtw-score-container' + source).append(this.childScoreView.render().$el);
        this.childScoreView.delegateEvents();
        return this;
    },

    // report : function(event) {
    // app.navigate("wtw/report", true);
    // return false;
    // },

    events : {
        "change input" : "change",
        "click #submit" : "report"
    },

    change : function(event) {
        var target = event.target;
        console.log('changing ' + target.id + ' from: ' + target.defaultValue + ' to: ' + target.value);
        // You could change your model on the spot, like this:
        // var change = {};
        // change[target.name] = target.value;
        // this.model.set(change);
    },

    updateModel : function() {
        this.render();
    },

});