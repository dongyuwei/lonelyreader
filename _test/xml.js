/*
var fs = require('fs'),
    xml2js = require('xml2js');

var parser = new xml2js.Parser();
fs.readFile('./google-reader-feed/subscriptions.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        console.dir(result);
        fs.writeFileSync('./google-reader-feed/subscriptions.json', JSON.stringify(result,null,3), 'utf-8');
    });
});
*/

var parseString = require('xml2js').parseString;
var xml = '<outline text="BT的花 blogs" title="BT的花 blogs" type="rss" xmlUrl="http://www.dup2.org/feed.xml" htmlUrl="http://www.dup2.org/blog"/>';
parseString(xml, function (err, result) {
    console.dir(result);
});