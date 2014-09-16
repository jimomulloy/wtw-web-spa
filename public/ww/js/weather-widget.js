var weatherModel = Backbone.Model.extend({
  initialize: function () {
    this.on("change", this.updateModel);
    this.attributes.zipCode = 22102;
  },
  updateModel: function () {
    var nameBreakup = this.attributes.channel.item.title.split(",");

    var cityBreakup = nameBreakup[0].split(" ");
    var cityName = "";
    var stateBreakup = nameBreakup[1].split(" ");

    for (var i = 2; i < cityBreakup.length; i++) {
      cityName += cityBreakup[i];
      if (i != cityBreakup.length-1) {
        cityName += " ";
      }
    }

    this.attributes.properName = cityName + ", " + stateBreakup[1];
    var imagePath = this.attributes.channel.item.description.split('"');
    this.attributes.imagePath = imagePath[1];
  }
});

var weatherWidget = Backbone.View.extend({
  el: "#js-widget",
  template: _.template($("#widget-template").html()),

  initialize: function () {

    this.currentModel = new weatherModel();
    this.makeCall();
    this.on("weatherCall:success", this.render);
    this.on("weatherCall:error", this.errorMessage);
  },

  events: {
    "change input#zipcode": "makeCall",
    "click .enter-zip": "toggleZip",
    "click .close-error": "toggleDisplay"
  },

  render: function () {
    $(this.el).html(this.template(this.currentModel));
  },

  toggleZip: function () {
    $("input#zipcode").toggle();
  },

  errorMessage: function (error) {
    $(".error-message .message").html(error);
  },

  toggleDisplay: function () {
    $(".error-message").toggle();
    $(".widget-display").toggle();
  },

  makeCall: function () {
    var inputZip = 22102;
    if (this.$("input#zipcode").val()) {
      var inputZip = this.$("input#zipcode").val();
      this.currentModel.set("zipCode", inputZip);
      this.toggleZip();
    }

    var thisUrl = "http://query.yahooapis.com/v1/public/yql?q=select%20item%20from%20weather.forecast%20where%20location%3D" + inputZip + "&format=json";

    $.ajax({
      type: "GET",
      url: thisUrl,
      dataType: "jsonp",
      success: function (response) {
        if (!response.error) {
          if (response.query.results.channel.item.title === "City not found") {
            this.trigger("weatherCall:error", response.query.results.channel.item.title);
            this.toggleDisplay();
          } else {
            this.currentModel.set(response.query.results);
            this.trigger("weatherCall:success");
          }
        } else {
          this.trigger("weatherCall:error", response.error.description);
          this.toggleDisplay();
        }
      },
      error: function (error) {
        this.trigger("weatherCall:error", response.error.description);
        this.toggleDisplay();
      },

      context: this
    });
  }
});

var exampleWidget = new weatherWidget();