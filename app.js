/*
 * app.js - Express server with routing
 */

// ------------ BEGIN MODULE SCOPE VARIABLES --------------
var http = require('http'), express = require('express'), routes = require('./lib/routes'), user = require('./routes/user'), path = require('path'), app = express(), server = http.createServer(app);
// ------------- END MODULE SCOPE VARIABLES ---------------

var common = require('./lib/common');
var config = common.config();

// all environments
app.set('PORT', config.http_port || 4000);
console.log('App config http_port: '+config.http_port );
//app.set('views', __dirname + '/views');
//app.set('view engine', 'jshtml');
app.use(express.favicon());

// ------------- BEGIN SERVER CONFIGURATION ---------------
app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.basicAuth('user', 'spa'));
    app.use(express.favicon());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(app.router);
});

app.configure('development', function() {
    console.log('App development config');
    app.use(express.logger());
    app.use(express.errorHandler({
        dumpExceptions : true,
        showStack : true
    }));
});

app.configure('production', function() {
    console.log('App production config');
    //app.use(express.errorHandler());
    app.use(express.logger());
    app.use(express.errorHandler({
        dumpExceptions : true,
        showStack : true
    }));
});

routes.configRoutes(app, server);

// -------------- END SERVER CONFIGURATION ----------------

// ----------------- BEGIN START SERVER -------------------
server.listen(app.get('PORT'));

console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);

// ------------------ END START SERVER --------------------
