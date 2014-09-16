/*
 * routes.js - module to provide routing
 */

// ------------ BEGIN MODULE SCOPE VARIABLES --------------
var configRoutes, wtwrs = require('./wtwrs'), crud = require('./crud'), chat = require('./chat'), makeMongoId = crud.makeMongoId;
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

    app.all('/:obj_type/*?', function(request, response, next) {
        response.contentType('json');
        next();
    });

    app.get('/:obj_type/list', function(request, response) {
        crud.read(request.params.obj_type, {}, {}, function(map_list) {
            response.send(map_list);
        });
    });

    app.post('/:obj_type/create', function(request, response) {
        crud.construct(request.params.obj_type, request.body, function(result_map) {
            response.send(result_map);
        });
    });

    app.get('/:obj_type/read/:id', function(request, response) {
        crud.read(request.params.obj_type, {
            _id : makeMongoId(request.params.id)
        }, {}, function(map_list) {
            response.send(map_list);
        });
    });

    app.post('/:obj_type/update/:id', function(request, response) {
        crud.update(request.params.obj_type, {
            _id : makeMongoId(request.params.id)
        }, request.body, function(result_map) {
            response.send(result_map);
        });
    });

    app.get('/:obj_type/delete/:id', function(request, response) {
        crud.destroy(request.params.obj_type, {
            _id : makeMongoId(request.params.id)
        }, function(result_map) {
            response.send(result_map);
        });
    });

    chat.connect(server);

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
