	
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var setting = require('./setting');
var app = express();
var MongoStore = require('connect-mongo')(express);
var flash = require('connect-flash');

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.cookieParser());
app.use(express.favicon()); //设置应用图标
app.use(express.logger('dev')); //设置应用日志中间件，由connect提供

/*
app.use(express.bodyParser()); 相当于app.use(express.json());
app.use(express.urlencoded()); app.use(express.multipart()); 用于解析http请求。
*/
app.use(express.json());
app.use(express.urlencoded());

app.use(express.methodOverride()); //这一句是用connect的中间件，协助处理POST请求，伪装PUT,DELECT方法

//由于express 3.0后取消了req.flash（）方法，可以通过下面这一句使用connect的flash()。
//注意：这一句必须放置在app.use(express.session());之前
app.use(flash());

//开启session功能，使用connect-mongo模块来将session存进mongodb中。
app.use(express.session({
			secret : setting.cookieSecret,
			store : new MongoStore({
				db : setting.db,
				port:setting.port,
				host:setting.host,
				collection: setting.collection
			})
}));

//将router信息抽离出去。 
app.use(app.router);
//app.use(express.router(routes));
routes(app);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/* 测试
app.get('/users', user.list);

app.get('/hello',routes.hello);
app.get('/user/:userName',function(req,resp){
		  resp.send('user:' + req.params.userName);
		});

app.all('/all',function(req,res,next){
		  res.write('all');
		  next();
		});
app.get('/all',function(req,res){
		  console.log('get');
		  res.end('get');
		});
*/

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
