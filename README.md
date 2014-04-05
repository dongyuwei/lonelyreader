LonelyReader
============
a personal RSS Reader(yes, Google Reader replacement).

How to run it:
=======
1. cd lonelyreader/
2. npm install
3. `READER_USERNAME=your_name READER_PASSWD=your_password READER_OPML=your_subscriptions.xml  node app.js`

`READER_OPML` should be your opml(xml) with correct path.

Note：
=======
1. This app use WebSocket to push rss articles after user click a bloger's rss link, so you need a browser which supports WebSocket(chrome,firefox,safari,mobile safari...)


Todo:
=======
1. make this app be a offline-first app
2. make a native mobile client
3. use leveldb as cache storage

Screenshots:
===========
1. <img src='https://raw.github.com/dongyuwei/lonelyreader/master/public/images/screenshots/all.png' >
2. <img src='https://raw.github.com/dongyuwei/lonelyreader/master/public/images/screenshots/ruby.png' >
3. <img src='https://raw.github.com/dongyuwei/lonelyreader/master/public/images/screenshots/list.png' >
4. <img src='https://raw.github.com/dongyuwei/lonelyreader/master/public/images/screenshots/item.png' >
