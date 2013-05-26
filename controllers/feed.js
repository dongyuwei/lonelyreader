var fs = require('fs')
	,mustache = require('mustache')
	,xml2js = require('xml2js')
	,FeedParser = require('feedparser')
    ,request = require('request');

var feedTree, uuid = 0;
function buildNodeItem(item){
	if(item.outline){//is category
        var list = [];
        item.outline.sort(function(a,b){
        	return a.$.title.toLowerCase().localeCompare(b.$.title.toLowerCase());
        }).forEach(function(node){
        	list.push(buildNodeItem(node));
        });
        return '<li class="category">' + item.$.title + '<ul>' + list.join('') + '</ul></li>'
    }else{// common rss feed item
    	return mustache.render(
    		'<li class="item"  id="{{id}}" data-info="{{info}}">' + 
    			'{{title}} <div data-role="collapsible-set" id="content_{{id}}"></div>' + 
    		'</li>',{
    		info : JSON.stringify(item.$),
    		title : item.$.title,
    		id : uuid++
    	}); 
    }
}
function buildTree(result){
    rootItem = result.opml.body[0];
    rootItem.$ = {
    	title : result.opml.head[0].title[0]
    }
    return buildNodeItem(rootItem);
};

function getFeedTree(config,callback){
	var parser = new xml2js.Parser();
	fs.readFile(config.opml, function(err, data) {
	    parser.parseString(data, function (err, result) {
	    	feedTree = buildTree(result);
	    	callback && callback.call(feedTree);
	    });
	});
}
exports.init = function(app,config){
	getFeedTree(config);

	app.get('/',function(req,res){
		res.render('index', {
			feedTree : feedTree
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
        console.error(error)
    })
    .on('article', function(article) {
    	article.id = data.id;
    	article.xmlUrl = data.url;
        console.log(article);
    	ws.send(JSON.stringify(article),function(error){
    		if(error){
				console.error(error);
			}
    	});
    })
    .on('end', function() {
    	//get all articles from data.url
    });
};