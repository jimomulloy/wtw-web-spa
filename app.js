/*
 * app.js - Express server with routing
 */

// ------------ BEGIN MODULE SCOPE VARIABLES --------------
var http = require('http'), express = require('express'), routes = require('./lib/routes'), user = require('./routes/user'), path = require('path'), app = express(), server = http.createServer(app);
// ------------- END MODULE SCOPE VARIABLES ---------------

// all environments
app.set('port', process.env.PORT || 3000);
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
    app.use(express.logger());
    app.use(express.errorHandler({
        dumpExceptions : true,
        showStack : true
    }));
});

app.configure('production', function() {
    app.use(express.errorHandler());
});

routes.configRoutes(app, server);

// -------------- END SERVER CONFIGURATION ----------------

// ----------------- BEGIN START SERVER -------------------
server.listen(3000);

console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);

// ------------------ END START SERVER --------------------
