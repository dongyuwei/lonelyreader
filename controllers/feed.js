exports.index = function(req, res) {
    res.render('index', {
        title: 'lonely reader'
    });
};

exports.new = function(req, res) {
    res.send('new feed' + req.query.url);
};

exports.create = function(req, res) {
    res.send('create feed');
};

exports.show = function(req, res) {
    res.send('show feed ' + req.params.feed);
};

exports.edit = function(req, res) {
    res.send('edit feed ' + req.params.feed);
};

exports.update = function(req, res) {
    res.send('update feed ' + req.params.feed);
};

exports.destroy = function(req, res) {
    res.send('destroy feed ' + req.params.feed);
};