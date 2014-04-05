var express = require('express'),
    http = require('http'),
    path = require('path'),
    WebSocketServer = require('ws').Server,
    feed = require('./controllers/feed'),
    config = require('./config');

var app = express();

// all environments
app.set('port', process.env.PORT || 9000);
app.set('views', __dirname + '/views');
app.engine('.html', require('./util/mustache.js'));
app.set('view engine', 'html');
app.use(express.basicAuth(config.username, config.passwd));
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

feed.init(app,config);

var server = http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

var wss = new WebSocketServer({
    server: server
});
wss.on('connection', function(ws) {
    console.log("ws connected----------------\n",ws.upgradeReq.headers['cookie']);
    ws.on('close', function() {
        console.log('####WebSocket closed!####');
    });
    ws.on('message', function(data, flags) {
        if(data !== 'KeepAlive'){
            console.log(data);
            data = JSON.parse(data);
            switch (data.action){
                case "getArticle" : 
                    feed.getArticle(ws,data);
                    break;
            }
        }
    });
});

