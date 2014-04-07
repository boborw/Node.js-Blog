
/*
 * GET home page.
 */
var crypto = require('crypto');
var User = require('../models/user');

module.exports = function(app){
	app.get("/",function(req,res){
		res.render("index",{title:"首页"});
	});
	app.get("/reg",function(req,res){
		res.render("register",{title:"注册"});
	});
	app.post("/reg",function(req,res){
		if(req.body['psw-repeat'] != req.body['psw']){
			req.flash('error','两次输入口令不一致');
			return res.redirect('/reg');
		}
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.psw).digest('base64');
		var newUser = new User({
			name : req.body.userName,
			password : password
		});
		User.get(newUser.name,function(err,user){
			if(user){
				console.log(user + "****用户已存在***********");
				err = "用户已存在";
			}
			if(err){
				req.flash('error',err);
				return res.redirect('/reg');
			}
			newUser.save(function(err){
				if(err){
					req.flash('error',err);
					return res.redirect('/reg');
				}
				req.session.user = newUser;
				req.flash('success','注册成功');
				res.redirect('/');
			});
		});
	});
}

/*
exports.hello = function(req,resp){
  resp.render('hello',{ date: new Date()}); 
};


exports.user = function(req,res){
};
exports.post = function(req,res){
};

exports.reg = function(req,res){
};

exports.doReg = function(req,res){
};
exports.login = function(req,res){
};
exports.doLogin = function(req,res){
};

exports.logout = function(req,res){
};
*/
