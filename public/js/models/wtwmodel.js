wtw.WeatherReport = Backbone.Model.extend({

    urlRoot : 'http://localhost:4000/api/report',

    getWeatherRecordings : function(source) {
        console.log("!!getWeatherRecordings for source:" + source);
        var sourceMap = this.get("sourceMap");
        var recordings = sourceMap[source].recordings;
        console.log("!!getWeatherRecordings for source:" + source + ", length:" + recordings.length);
        return recordings;
    },

    getWeatherForecasts : function(source) {
        console.log("!!getWeatherForecasts for source:" + source);
        var sourceMap = this.get("sourceMap");
        var forecasts = sourceMap[source].forecasts;
        return forecasts;
    },

    getWeatherSources : function() {
        var sourceMap = this.get("sourceMap");
        var weatherSources = [];
        for ( var key in sourceMap) {
            weatherSources.push(key);
        }
        return weatherSources;
    },

    url : function() {
        return this.urlRoot + '/lat/' + this.get("latitude") + '/long/' + this.get("longitude");
    },

    initialize : function() {
    },

    defaults : {
        latitude : 0,
        longitude : 0,
        region : 0,
        date : 0,
        sourceMap : {}
    },

    validate : function(attrs, options) {
    },

    timeConverter : function(UNIX_timestamp) {
        var a = new Date(UNIX_timestamp);
        return a.toString();
        /*var months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
        var year = a.getFullYear();
        var month = months[a.getMonth() - 1];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ',' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
        return time;*/
    },
    
    getHour : function(UNIX_timestamp) {
        var a = new Date(UNIX_timestamp);
        var hours = a.getHours();
        if (hours < 10)  hours = '0'+hours;
        return hours;
    },
    
    getDay : function(UNIX_timestamp) {
        var a = new Date(UNIX_timestamp);
        var days = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ];
        var day = days[a.getDay()];
        return day;
    },


    parse : function(data, xhr) {
        console.log("!!parse wtwmodel:" + JSON.stringify(data));
        var dataSourceMap = data.sourceMap;
        var sourceMap = {};
        var weatherSources = [];
        var weatherRecordings = [];
        var weatherForecasts = [];
        for ( var key in dataSourceMap) {
            var recordings = dataSourceMap[key].recordings;
            weatherRecordings = [];
            for (var i = 0; i < recordings.length; i++) {
                var weather = this.parseRecording(recordings[i]);
                weatherRecordings.push(weather);
            }
            var forecasts = dataSourceMap[key].forecasts;
            weatherForecasts = [];
            for (i = 0; i < forecasts.length; i++) {
                var forecast = this.parseForecast(forecasts[i]);
                weatherForecasts.push(forecast);
            }
            sourceMap[key] = {};
            sourceMap[key].recordings = weatherRecordings;
            sourceMap[key].forecasts = weatherForecasts;
        }

        return {
            latitude : data.latitude.toFixed(4),
            longitude : data.longitude.toFixed(4),
            region : data.region,
            date : data.date,
            dateFormatted : this.timeConverter(data.date),
            sourceMap : sourceMap
        };
    },

    parseRecording : function(data) {
        var condition = new wtw.WeatherCondition({
            text : data.condition.text,
            code : data.condition.code,
            icon : data.condition.icon,
            minTemp : data.condition.minTemp.toFixed(2),
            maxTemp : data.condition.maxTemp.toFixed(2),
            temp : data.condition.maxTemp.toFixed(2),
            fromTime : data.condition.fromTime,
            toTime : data.condition.toTime,
            fromTimeFormatted : this.timeConverter(data.condition.fromTime),
            toTimeFormatted : this.timeConverter(data.condition.toTime)
        });
        var atmosphere = new wtw.WeatherAtmosphere({
            humidity : data.atmosphere.humidity,
            visibility : data.atmosphere.visibility,
            pressure : data.atmosphere.pressure,
            rising : data.atmosphere.rising
        });
        var wind = new wtw.WeatherWind({
            chill : data.wind.chill,
            direction : data.wind.direction,
            speed : data.wind.speed
        });
        var precipitation = new wtw.WeatherPrecipitation({
            text : data.precipitation.text,
            code : data.precipitation.code,
            rate : data.precipitation.rate
        });
        return new wtw.WeatherRecord({
            source : data.source,
            region : data.region,
            writeTime : data.writeTime,
            sourceTime : data.sourceTime,
            sourceDay : this.getDay(data.sourceTime),
            sourceHour : this.getHour(data.sourceTime),
            writeDay : this.getDay(data.writeTime),
            writeHour : this.getHour(data.writeTime),
            writeTimeFormatted : this.timeConverter(data.writeTime),
            sourceTimeFormatted : this.timeConverter(data.sourceTime),
            condition : condition,
            atmosphere : atmosphere,
            wind : wind,
            precipitation : precipitation
        });

    },

    parseForecast : function(data) {
        var periodToHours = new Date(data.periodFrom).getHours()+(data.periodTo - data.periodFrom)/(1000*60*60);
        if (periodToHours < 10)  periodToHours = '0'+periodToHours;
        var condition = new wtw.WeatherCondition({
            text : data.condition.text,
            code : data.condition.code,
            icon : data.condition.icon,
            minTemp : data.condition.minTemp.toFixed(2),
            maxTemp : data.condition.maxTemp.toFixed(2),
            temp : data.condition.maxTemp.toFixed(2),
            fromTime : data.condition.fromTime,
            toTime : data.condition.toTime,
            fromTimeFormatted : this.timeConverter(data.condition.fromTime),
            toTimeFormatted : this.timeConverter(data.condition.toTime)
        });
        var atmosphere = new wtw.WeatherAtmosphere({
            humidity : data.atmosphere.humidity,
            visibility : data.atmosphere.visibility,
            pressure : data.atmosphere.pressure,
            rising : data.atmosphere.rising
        });
        var wind = new wtw.WeatherWind({
            chill : data.wind.chill,
            direction : data.wind.direction,
            speed : data.wind.speed
        });
        var precipitation = new wtw.WeatherPrecipitation({
            text : data.precipitation.text,
            code : data.precipitation.code,
            rate : data.precipitation.rate
        });
        return new wtw.WeatherForecast({
            periodFrom : data.periodFrom,
            periodTo : data.periodTo,
            periodFromFormatted : this.timeConverter(data.periodFrom),
            periodToFormatted : this.timeConverter(data.periodTo),
            periodFromDay : this.getDay(data.periodFrom),
            periodFromHour : this.getHour(data.periodFrom),
            periodToFormatted : this.timeConverter(data.periodTo),
            periodToDay : this.getDay(data.periodTo),
            periodToHour : this.getHour(data.periodTo),
            periodDay : this.getDay(data.periodFrom),
            periodHour : this.getHour(data.periodFrom)+"-"+periodToHours,
            source : data.source,
            region : data.region,
            writeTime : data.writeTime,
            sourceTime : data.sourceTime,
            sourceDay : this.getDay(data.sourceTime),
            sourceHour : this.getHour(data.sourceTime),
            writeDay : this.getDay(data.writeTime),
            writeHour : this.getHour(data.writeTime),
            writeTimeFormatted : this.timeConverter(data.writeTime),
            sourceTimeFormatted : this.timeConverter(data.sourceTime),
            condition : condition,
            atmosphere : atmosphere,
            wind : wind,
            precipitation : precipitation
        });

    },

});

wtw.WeatherRecord = Backbone.Model.extend({

    urlRoot : 'http://rest-service.guides.spring.io/greeting',

    url : function() {
        return "http://api.wunderground.com/api/7eaec3b21b154448/conditions/q/" + this.get("zip") + ".json";
    },

    initialize : function() {
    },

    defaults : {
        source : "",
        region : 0,
        writeTime : 0,
        sourceTime : 0,
        condition : null,
        atmosphere : null,
        wind : null,
        precipitation : null
    },

    validate : function(attrs, options) {
    },

});

wtw.WeatherForecast = Backbone.Model.extend({
    url : function() {
        return "http://api.wunderground.com/api/7eaec3b21b154448/conditions/q/" + this.get("zip") + ".json";
    },

    initialize : function() {
    },

    defaults : {
        periodFrom : 0,
        periodTo : 0,
        source : "",
        region : 0,
        writeTime : 0,
        sourceTime : 0,
        condition : null,
        atmosphere : null,
        wind : null,
        precipitation : null
    },

    validate : function(attrs, options) {
    },

});

wtw.WeatherCondition = Backbone.Model.extend({
    url : function() {
        return "http://api.wunderground.com/api/7eaec3b21b154448/conditions/q/" + this.get("zip") + ".json";
    },

    initialize : function() {
    },

    defaults : {
        text : "",
        code : "",
        icon : "",
        minTemp : 0,
        maxTemp : 0,
        fromTime : 0,
        toTime : 0
    },

    validate : function(attrs, options) {
    },

});

wtw.WeatherAtmosphere = Backbone.Model.extend({
    url : function() {
        return "http://api.wunderground.com/api/7eaec3b21b154448/conditions/q/" + this.get("zip") + ".json";
    },

    initialize : function() {
    },

    defaults : {
        humidity : 0,
        visibility : 0,
        pressure : 0,
        rising : ""
    },

    validate : function(attrs, options) {
    },

});

wtw.WeatherWind = Backbone.Model.extend({

    url : function() {
        return "http://api.wunderground.com/api/7eaec3b21b154448/conditions/q/" + this.get("zip") + ".json";
    },

    initialize : function() {
    },

    defaults : {
        chill : 0,
        direction : 0,
        speed : 0
    },

    validate : function(attrs, options) {
    },

});

wtw.WeatherPrecipitation = Backbone.Model.extend({

    url : function() {
        return "http://api.wunderground.com/api/7eaec3b21b154448/conditions/q/" + this.get("zip") + ".json";
    },

    initialize : function() {
    },

    defaults : {
        text : "",
        code : "",
        rate : 0
    },

    validate : function(attrs, options) {
    },

});