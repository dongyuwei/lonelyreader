var fs = require('fs')
	,mustache = require('mustache')
	,xml2js = require('xml2js')
	,FeedParser = require('feedparser')
    ,request = require('request');

var feedTree;
function getFeedTree(config){
	var parser = new xml2js.Parser();
	fs.readFile(config.opml, function(err, data) {
	    parser.parseString(data, function (err, result) {
            feedTree = result;
	    });
	});
}
exports.init = function(app,config){
	getFeedTree(config);

	app.get('/',function(req,res){
		res.render('index', {
			feedTree : JSON.stringify(feedTree)
    	});
	});
	app.post('/',function(req,res){
		res.send(req.body.url);
	});
	app.put('/',function(req,res){
		
	});
	app.delete('/',function(req,res){
		
	});
};

exports.getArticle = function(ws,data){
	request(data.url).pipe(new FeedParser({
		addmeta : false
	}))
    .on('error', function(error) {
        console.error('error in FeedParser: ',error)
        ws.send(JSON.stringify({
            'error' : error.message
        }),function(error){
            if(error){
                console.error(">>> error when sending ws msg: ",error);
            }
        });
    })
    .on('article', function(article) {
    	article.id = data.id;
    	article.xmlUrl = data.url;
        console.log(article);
    	ws.send(JSON.stringify(article),function(error){
    		if(error){
				console.error(">>> error when sending ws msg <<<: ",error);
			}
    	});
    })
    .on('end', function() {
    	//get all articles from data.url
    });
};