exports.init = function(app){
	app.get('/',function(req,res){
		res.render('index', {

    	});
	});
	app.post('/',function(req,res){
		res.send(req.params.url)
	});
	app.put('/',function(req,res){

	});
	app.delete('/',function(req,res){

	});
};