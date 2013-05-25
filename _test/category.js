var json = require('./google-reader-feed/subscriptions.json');

function buildNodeItem(item){
	if(item.outline){//is category
        var list = [];
        item.outline.forEach(function(node){
        	list.push(buildNodeItem(node));
        });
        return '<li>' + item.$.title + '<ul>' + list.join('') + '</ul></li>'
    }else{// common rss feed item
        return '<li data-info="INFO">'.replace("INFO",item.$) + item.$.title + '</li>';
    }
}
function buildTree(rootItem){
    /* outline <--> children */
    rootItem.$ = {
    	title : json.opml.head[0].title[0]
    }
    var html = buildNodeItem(rootItem);
    console.log(html)
};

buildTree(json.opml.body[0]);