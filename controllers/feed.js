var fs = require('fs')
	,xml2js = require('xml2js');

var feedTree;
function buildNodeItem(item){
	if(item.outline){//is category
        var list = [];
        item.outline.sort(function(a,b){
        	return a.$.title.localeCompare(b.$.title);
        }).forEach(function(node){
        	list.push(buildNodeItem(node));
        });
        return '<li class="category">' + item.$.title + '<ul>' + list.join('') + '</ul></li>'
    }else{// common rss feed item
        return '<li class="item" data-info="INFO">'.replace("INFO",JSON.stringify(item.$)) + item.$.title + '</li>';
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
		res.send(req.body.url)
	});
	app.put('/',function(req,res){
		
	});
	app.delete('/',function(req,res){
		
	});
};

exports.getArticle = function(ws,data){
	var list = [];
	ws.send(JSON.stringify(list),function(error){
		if(error){
			console.error(error);
		}
	});
};