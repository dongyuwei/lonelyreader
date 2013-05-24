exports.init = function(app,ws){
	app.get('/',function(req,res){
		console.log(req.remoteUser);
		res.render('index', {

    	});
	});
	app.post('/',function(req,res){
		console.log(app.get('ws'))
		res.send(req.body.url)
	});
	app.put('/',function(req,res){
		
	});
	app.delete('/',function(req,res){
		
	});
};