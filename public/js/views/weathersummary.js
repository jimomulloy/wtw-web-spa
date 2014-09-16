wtw.WeatherSummaryView = Backbone.View.extend({
    
    initialize : function() {
        //this.model.on("change", this.updateModel, this);
    },

    render : function() {
        this.$el.html(this.template(this.model.toJSON()));
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

});