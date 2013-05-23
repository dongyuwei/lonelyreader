/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    WebSocketServer = require('ws').Server,
    Feed = require('./controllers/feed'),
    Config = require('./config');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('.html', require('./util/mustache.js'));
app.set('view engine', 'html');
// app.use(express.basicAuth(Config.username, Config.passwd));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('lonelyreader'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

Feed.init(app);

var server = http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

var wss = new WebSocketServer({
    server: server
});
wss.on('connection', function(ws) {
    ws.on('close', function() {

    });
    ws.on('message', function(data, flags) {
        console.log(data);
        ws.send(data + JSON.stringify(process.memoryUsage()), function() { 
            
        });
    });
});