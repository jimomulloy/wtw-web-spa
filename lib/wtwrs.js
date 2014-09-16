/*
 * crud.js - module to provide CRUD db capabilities
 */
// ------------ BEGIN MODULE SCOPE VARIABLES --------------

var querystring = require('querystring');
var http = require('http');
// var https = require('https');

var wtwhost = 'localhost';
var wtwport = '8080';
var username = 'JonBob';
var password = '*****';
var apiKey = '*****';
var sessionId = null;
var deckId = '68DC5A20-EE4F-11E2-A00C-0858C0D5C2ED';

report = function(request, response) {
    performRequest('/wtwman/webresources/manager/update/lat/' + request.params.lat + '/long/' + request.params.long, 'POST', {}, function(data) {
        console.log('Node js report data:' + JSON.stringify(data));
        response.writeHead(200, {
            'Content-Type' : 'application/json'
        });
        response.write(JSON.stringify(data));
        response.end();
        console.log('Node js report data written');
    });
};

regions = function(request, response) {
    performRequest('/wtwgeo/webresources/location/regions'
            +'/swlat/' + request.params.swlat + '/swlong/' + request.params.swlong
            +'/nelat/' + request.params.nelat + '/nelong/' + request.params.nelong
            , 'GET', {}, function(data) {
        console.log('Node js regions data:' + JSON.stringify(data));
        response.writeHead(200, {
            'Content-Type' : 'application/json'
        });
        response.write(JSON.stringify(data));
        response.end();
        console.log('Node js regions data written');
    });
};

activeRegions = function(request, response) {
    performRequest('/wtwman/webresources/manager/regions'
            , 'GET', {}, function(data) {
        console.log('Node js active regions data:' + JSON.stringify(data));
        response.writeHead(200, {
            'Content-Type' : 'application/json'
        });
        response.write(JSON.stringify(data));
        response.end();
        console.log('Node js active regions data written');
    });
};

performRequest = function(endpoint, method, data, success) {
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
    console.log("!!app.get performRequest:" + endpoint);
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
};

module.exports = {
    report : report,
    regions : regions,
    activeRegions : activeRegions
};
// ----------------- END PUBLIC METHODS -----------------

