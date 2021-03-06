/*
 * routes.js - module to provide routing
 */

// ------------ BEGIN MODULE SCOPE VARIABLES --------------
var configRoutes, wtwrs = require('./wtwrs');
// ------------- END MODULE SCOPE VARIABLES ---------------

// ---------------- BEGIN PUBLIC METHODS ------------------
configRoutes = function(app, server) {

    app.get('/api/report/lat/:lat/long/:long', function(request, response) {
        console.log("!!app.get /api/report/lat/:lat/long/:long");
        wtwrs.report(request, response);
        // response.json({ message: 'hooray! welcome to weather report!' });
    });

    app.get('/api/regions/swlat/:swlat/swlong/:swlong/nelat/:nelat/nelong/:nelong', function(request, response) {
        console.log("!!app.get /api/regions/swlat/:swlat/swlong/:swlong/nelat/:nelat/nelong/:nelong");
        wtwrs.regions(request, response);
        // response.json({ message: 'hooray! welcome to weather report!' });
    });
    
    app.get('/api/activeRegions', function(request, response) {
        console.log("!!app.get /api/activeRegions");
        wtwrs.activeRegions(request, response);
        // response.json({ message: 'hooray! welcome to weather report!' });
    });
    
    app.get('/', function(request, response) {
        response.redirect('/index.html');
    });

    app.get('/api/report/lat/:lat/long/:long', function(request, response) {
        console.log("!!app.get /api/report/lat/:lat/long/:long");
        report(request, response);
        // response.json({ message: 'hooray! welcome to weather report!' });
    });

    function performRequest(endpoint, method, data, success) {
        console.log("!!app.get performRequest:" + endpoint);
        var dataString = JSON.stringify(data);
        var headers = {};

        if (method == 'GET') {
            endpoint += '?' + querystring.stringify(data);
        } else {
            headers = {
                'Content-Type' : 'application/json',
                'Content-Length' : dataString.length
            };
        }
        var options = {
            host : wtwhost,
            port : wtwport,
            path : endpoint,
            method : method,
            headers : headers
        };

        var req = http.request(options, function(res) {
            console.log("!!app.get request");
            res.setEncoding('utf-8');

            var responseString = '';
            res.on('data', function(data) {
                responseString += data;
            });

            res.on('end', function() {
                console.log(responseString);
                var responseObject = JSON.parse(responseString);
                success(responseObject);
            });
        });
        console.log("!!app.get performRequest data:" + dataString);
        req.write(dataString);
        req.end();
    }

};

module.exports = {
    configRoutes : configRoutes
};
// ----------------- END PUBLIC METHODS -------------------
