wtw.WeatherScoreView = Backbone.View.extend({

    tagName : 'div',
    
    initialize : function() {
        //this.model.on("change", this.updateModel, this);
    },

    render : function() {
        //var data = _.clone(this.model.attributes);
        //data.id = this.model.id;
        this.$el.html(this.template(this.model.toJSON()));
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

    // This line would be better in your view's initialize, replacing company with this.
    //  company.listenTo(company.model, "change", company.render);

    report : function() {
        var _thisView = this;
        this.model.set({
            latitude : $('#latitude').val(),
            longitude : $('#longitude').val()
        });
        /*
         * if (this.model.isNew()) { var self = this;
         * app.wineList.create(this.model, { success : function() {
         * app.navigate('wines/' + self.model.id, false); } }); } else {
         * this.model.save(); }
         */
        this.model.fetch({
            success : function(response, xhr) {
                _thisView.updateModel();
            },
            error : function(errorResponse) {
                console.log("Inside weather report error");
                console.log(errorResponse)
            }
        });
        return false;
    },

});