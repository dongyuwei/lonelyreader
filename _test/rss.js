var FeedParser = require('feedparser'),
    request = require('request');

function getArticle(rssList){
    var data = {};
    rssList.forEach(function(url,i){
        data[url] = [];
        request(url)
        .pipe(new FeedParser({
            // addmeta : false
            // ,normalize : false
        }))
        .on('error', function(error) {
            console.error(error)
        })
        // .on('meta', function(meta) {

        // })
        .on('article', function(article) {

            data[url].push(article);
        })
        // .on('complete',function(){

        // })
        .on('end', function() {
            if(i === rssList.length -1){
                console.log(JSON.stringify(data,null,3))
            }
        });
    });
}

getArticle(['http://calendar.perfplanet.com/feed/','http://www.dup2.org/feed.xml']);


/*
FeedParser.parseStream(request('http://www.dup2.org/feed.xml'), function (err, meta, articles) {
  if (err) return console.error(err);
  console.log('===== %s =====', meta.title);
  articles.forEach(function (article) {
    console.log('Got article: %s', article.title || article.description);
  });
});
*/