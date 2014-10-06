wtw.WeatherBarometerView = Backbone.View.extend({
    
    initialize : function() {
        // this.model.on("change", this.updateModel, this);
    },

    render : function() {
        this.$el.html(this.template(this.model.toJSON()));
        console.log("!set pressure:"+this.model.get("pressure"));
        console.log("!set pressure model :"+JSON.stringify(this.model));
        this.setPressure(this.model.get("pressure"));
        return this;
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
        this.render();
    },

    errorMessage: function (error) {
      $(".wtw-current-error-message .message").html(error);
    },

    toggleDisplay: function () {
      $(".wtw-current-error-message").toggle();
      $(".wtw-current-widget-display").toggle();
    },
    
    setPressure: function(myData){;
        // Angles for sin() and cos() start at 3 o'clock;
        // subtract HALF_PI to make them start at the top
        // 30miliBar = HALF_PI
        pressure = (myData - 1000) * (TWO_PI / 120) - HALF_PI;

        if (myData > pmax)
            pmax = myData;
        if (myData < pmin)
            pmin = myData;

        barometer.redraw();
    }

});