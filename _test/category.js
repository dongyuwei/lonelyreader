var json = require('./google-reader-feed/subscriptions.json');
var $;
json.opml.body[0].outline.forEach(function(item){
    $ = item.$;
    if(item.outline){//is category
        console.log("category: ",$.title)
    }else{// common rss feed item
        console.log($.title)
    }
});

function buildTree(json){
    /* outline <--> children */
};