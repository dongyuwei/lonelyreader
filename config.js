var path = require('path');

module.exports = {
	'username' : process.env.READER_USERNAME,
	'passwd' : process.env.READER_PASSWD,

	'opml' : process.env.READER_OPML || path.join(__dirname, '_test/google-reader-feed/subscriptions.xml')
};