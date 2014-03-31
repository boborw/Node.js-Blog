exports.hello = function(req,resp){
	resp.render('hello',{date:new Date().toString()});
};
