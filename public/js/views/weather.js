wtw.WeatherView = Backbone.View.extend({

    initialize : function() {
        // this.model.on("change", this.updateModel, this);
    },

    summaryView : {},

    barometerView : {},

    reportView : {},

    render : function() {
        // var data = _.clone(this.model.attributes);
        // data.id = this.model.id;
        this.$el.html(this.template(this.model.toJSON()));
        if (this.model.get("region") != 0) {
            this.reportView = new wtw.WeatherReportView({
                model : this.model
            });
            this.reportView.$el = this.$('#wtw-report-container');
            this.reportView.render();
            this.reportView.delegateEvents();
            var currentWeather = undefined;
            var recordings = [];
            var sources = this.model.getWeatherSources();
            for (var i = 0; i < sources.length; i++) {
                recordings = this.model.getWeatherRecordings(sources[i]);
                if (recordings.length > 0) {
                    currentWeather = recordings[0];
                }
            }
            if (currentWeather != undefined) {
                this.model.getWeatherRecordings[0];
                var currentWeather = recordings[0];
                this.summaryView = new wtw.WeatherSummaryView({
                    model : currentWeather
                });
                this.summaryView.$el = this.$('#wtw-summary-container');
                this.summaryView.render();
                this.summaryView.delegateEvents();

                this.barometerView = new wtw.WeatherBarometerView({
                    model : currentWeather
                });
                this.barometerView.$el = this.$('#wtw-barometer-container');
                this.barometerView.render();
                this.barometerView.delegateEvents();
            }
        }
        return this;
    },

    // report : function(event) {
    // app.navigate("wtw/report", true);
    // return false;
    // },

    events : {
        "change input" : "change",
        "click #submit" : "report",
        "click #geolocate" : "geolocate"
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
        // this.render();
        if (this.model.get("region") != 0) {
            this.reportView = new wtw.WeatherReportView({
                model : this.model
            });
            this.reportView.$el = this.$('#wtw-report-container');
            this.reportView.render();
            this.reportView.delegateEvents();

            var currentWeather = undefined;
            var recordings = [];
            var sources = this.model.getWeatherSources();
            for (var i = 0; i < sources.length; i++) {
                recordings = this.model.getWeatherRecordings(sources[i]);
                if (recordings.length > 0) {
                    currentWeather = recordings[0];
                }
            }
            if (currentWeather != undefined) {
                this.summaryView = new wtw.WeatherSummaryView({
                    model : currentWeather
                });
                this.summaryView.$el = this.$('#wtw-summary-container');
                this.summaryView.render();
                this.summaryView.delegateEvents();

                this.barometerView = new wtw.WeatherBarometerView({
                    model : currentWeather
                });
                this.barometerView.$el = this.$('#wtw-barometer-container');
                this.barometerView.render();
                this.barometerView.delegateEvents();
            }
        }
    },

    // This line would be better in your view's initialize, replacing company
    // with this.
    // company.listenTo(company.model, "change", company.render);

    report : function() {
        console.log('report:' + this.googleMap);
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
        $('#wtw_progress_overlay').show();
        this.model.fetch({
            success : function(response, xhr) {
                _thisView.updateModel();
                $('#wtw_progress_overlay').hide();
            },
            error : function(errorResponse) {
                console.log("Inside weather report error");
                console.log(errorResponse)
                $('#wtw_progress_overlay').hide();
            }
        });
        return false;
    },

    googleMap : {},

    marker : undefined,

    googleMapsInitialize : function() {
        var _thisView = this;
        var latLng = new google.maps.LatLng(51.4667, -0.4545);
        var settings = {
            zoom : 10,
            center : latLng,
            mapTypeControl : false,
            mapTypeControlOptions : {
                style : google.maps.MapTypeControlStyle.DROPDOWN_MENU
            },
            navigationControl : true,
            navigationControlOptions : {
                style : google.maps.NavigationControlStyle.SMALL
            },
            mapTypeId : google.maps.MapTypeId.TERRAIN
        };
        this.googleMap = new google.maps.Map(document.getElementById("map_canvas"), settings);
        wtw.gmap = this.googleMap;

        google.maps.event.addListener(this.googleMap, 'click', function(event) {
            var thisGoogleMap = _thisView.googleMap;
            $('#latitude').val(event.latLng.lat());
            $('#longitude').val(event.latLng.lng());
            var location = event.latLng;
            thisGoogleMap.setCenter(location);
        });

        google.maps.event.addListener(this.googleMap, 'idle', function(event) {
            var thisGoogleMap = _thisView.googleMap;
            _thisView.model.set("swlatitude", thisGoogleMap.getBounds().Ca.k);
            _thisView.model.set("swlongitude", thisGoogleMap.getBounds().ta.j);
            _thisView.model.set("nelatitude", thisGoogleMap.getBounds().Ca.j);
            _thisView.model.set("nelongitude", thisGoogleMap.getBounds().ta.k);
            _thisView.clearMarkRegions();
            if ((thisGoogleMap.getBounds().Ca.j - thisGoogleMap.getBounds().Ca.k) < 4.0) {
                _thisView.getRegions();
            }
        });

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError);
        }
        // startws();

    },

    regionMarkers : [],

    regionCircles : [],

    clearMarkRegions : function() {
        var _thisView = this;
        for (var i = 0; i < _thisView.regionMarkers.length; i++) {
            _thisView.regionMarkers[i].setMap(null);
            _thisView.regionMarkers[i] = null;
        }
        _thisView.regionMarkers = [];
        for (var i = 0; i < _thisView.regionCircles.length; i++) {
            _thisView.regionCircles[i].setMap(null);
            _thisView.regionCircles[i] = null;
        }
        _thisView.regionCircles = [];

    },

    markRegions : function() {
        var _thisView = this;
        var _thisModel = this.model;
        var regions = _thisModel.get("regions");
        var activeRegions = _thisModel.get("activeRegions");

        _thisView.clearMarkRegions();

        var active = false;

        for (i = 0; i < regions.length; i++) {
            var regionData = regions[i];
            active = false;
            if ($.inArray(regionData.region, activeRegions) != -1) {
                active = true;
            }
            var latLng = new google.maps.LatLng(regionData.latitude, regionData.longitude);

            var marker = new google.maps.Marker({
                position : latLng,
                map : wtw.gmap,
                animation : google.maps.Animation.DROP,
                title : "Region: " + JSON.stringify(regionData.region)
            });

            _thisView.regionMarkers.push(marker);
            var strokeColor = '#0000FF';
            if (active) {
                strokeColor = '#FF0000';
            }
            var populationOptions = {
                strokeColor : strokeColor,
                strokeOpacity : 0.8,
                strokeWeight : 2,
                fillColor : '#008833',
                fillOpacity : 0.25,
                map : wtw.gmap,
                center : latLng,
                radius : 20000
            };

            // Add the circle for this city to the map.
            var circle = new google.maps.Circle(populationOptions);

            google.maps.event.addListener(circle, 'click', function(event) {
                var thisGoogleMap = _thisView.googleMap;
                $('#latitude').val(event.latLng.lat());
                $('#longitude').val(event.latLng.lng());
                var location = event.latLng;
                thisGoogleMap.setCenter(location);
            });

            _thisView.regionCircles.push(circle);

        }

    },

    getActiveRegions : function() {
        var _thisView = this;
        var _thisModel = this.model;
        console.log("!!getActiveRegions:");
        var thisUrl = 'http://localhost:4000/api/activeRegions';
        $.ajax({
            type : "GET",
            url : thisUrl,
            dataType : "json",
            success : function(response) {
                if (!response.error) {
                    _thisModel.set("activeRegions", response);
                    _thisView.clearMarkRegions();
                    _thisView.markRegions();

                } else {
                    this.trigger("!!gotActiveRegions error", response.error.description);
                }
            },
            error : function(error) {
                this.trigger("!!gotActiveRegions comms error", response.error.description);
            },

            context : this
        });
    },

    getRegions : function() {
        var _thisView = this;
        var _thisModel = this.model;
        console.log("!!getRegions:");
        var thisUrl = 'http://localhost:4000/api/regions' + '/swlat/' + this.model.get("swlatitude") + '/swlong/' + this.model.get("swlongitude") + '/nelat/' + this.model.get("nelatitude")
                + '/nelong/' + this.model.get("nelongitude");
        console.log("!!getRegions:" + thisUrl);
        $.ajax({
            type : "GET",
            url : thisUrl,
            dataType : "json",
            success : function(response) {
                if (!response.error) {
                    _thisModel.set("regions", response);
                    _thisView.getActiveRegions();
                    //_thisView.clearMarkRegions();
                    //_thisView.markRegions();

                } else {
                    this.trigger("!!gotRegions error", response.error.description);
                }
            },
            error : function(error) {
                this.trigger("!!gotRegions comms error", response.error.description);
            },

            context : this
        });
    },

    startws : function() {
        var socket = new WebSocket("ws://api.cosm.com:8080");
        socket.onopen = function() {
            socket.send('{"method" : "subscribe", "resource" : "/feeds/129364", "headers" : {"X-ApiKey" : "AvKdOy4jlZ7QNRoJjwS_F6q30m-SAKw5S0JEdzZrT3NMZz0g"}}');
        }
        socket.onclose = function() {
            // try to reconnect in 5 seconds
            setTimeout(function() {
                startws()
            }, 5000);
        };

        socket.onmessage = function(msg) {
            var response = JSON.parse(msg.data);
            if ("body" in response) {
                var streams = response.body.datastreams;
                for (var i = 0; i < streams.length; i++) {
                    st = streams[i];
                    var prev = $("#" + st.id);
                    var clone = prev.clone();
                    clone.css('position', 'absolute');
                    clone.css('left', prev.position().left);
                    clone.css('top', prev.position().top);
                    $('body').append(clone);
                    prev.hide();
                    if (st.unit) {
                        prev.text(st.current_value + " " + st.unit.symbol);
                    } else {
                        prev.text(st.current_value);
                    }
                    clone.fadeOut(300, function() {
                        clone.remove();
                    });
                    prev.fadeIn(300);
                }
            }
        };

    },

    geolocate : function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError);
        } else {
            alert("Browser does not support geolocation");
        }
    },

    geoSuccess : function(position) {
        $('#latitude').val(position.coords.latitude);
        $('#longitude').val(position.coords.longitude);
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        // this.mapPlaceMarker(latLng);
        var location = latLng;

        wtw.gmap.setCenter(location);
    },

    geoError : function(error) {
        switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("Geolocate PERMISSION_DENIED: " + error.message);
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Geolocate POSITION_UNAVAILABLE: " + error.message);
            break;
        case error.TIMEOUT:
            alert("Geolocate TIMEOUT: " + error.message);
            break;
        default:
            alert("Geolocate code " + error.code + ': ' + error.message);
            break;
        }

    }

});