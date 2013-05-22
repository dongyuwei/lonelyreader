var Mustache = require('mustache');
var path = require('path');
var fs = require('fs');

/**
 * @param {String} path
 * @param {Object} data
 * @param {Function} callback
 */
var root = path.join(__dirname, '../views');
module.exports = function(template, data, callback) {
    fs.readFile(template, 'utf8', function(err, str) {
        if (err) return callback(err);
        try {
            var html = Mustache.render(str, data, function(partial) {
                //auto load partial template
                return fs.readFileSync(path.join(root, partial) + '.html', 'utf8').trim();
            });
            callback(null, html);
        } catch (err) {
            callback(err);
        }
    });
};