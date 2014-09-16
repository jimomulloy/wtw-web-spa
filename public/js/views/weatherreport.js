wtw.WeatherReportView = Backbone.View.extend({

    childViews : {},

    initialize : function() {
        // this.model.on("change", this.updateModel, this);
    },

    render : function() {
        this.$el.html(this.template(this.model.toJSON()));

        var sources = this.model.getWeatherSources();
        for (var i = 0; i < sources.length; i++) {
            this.renderSource(sources[i]);
        }
        return this;
    },

    renderSource : function(source) {
        var sourceModel = new Backbone.Model({
            source : source,
            recordings : this.model.getWeatherRecordings(source),
            forecasts : this.model.getWeatherForecasts(source),
            pastRecordings : this.model.getWeatherRecordings(source),
            retroForecasts : this.model.getWeatherForecasts(source),
            score : {}
        });
        this.childViews[source] = new wtw.WeatherSourceView({
            model : sourceModel
        });
        this.childViews[source].delegateEvents();
        console.log('Weather report render view for source:' + source);
        this.$el.append(this.childViews[source].render().el);
    },

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
        //this.render();
    },

});