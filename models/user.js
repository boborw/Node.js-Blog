var mongodb = require('./db');

function User(user){
	this.name = user.name;
	this.password = user.password;
};

module.exports = User;

User.prototype.save = function(callback){
  	var user = {
     	name : this.name,
     	password : this.password
   	};
   	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
	
		db.collection('users',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			//为 name 属性添加索引
			collection.ensureIndex('name',{unique : true});
			collection.insert(user,{safe : true},function(err,user){
				mongodb.close();
				// console.log("user insert ***********");
				callback(err,user);
			}
		);
	});
   });
};

User.get = function(userName,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection("users",function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.findOne({name:userName},function(err,doc){
				// console.log("test get method" + " " +  doc);
				// if(err){
					// console.log("err get method");
				// }
				mongodb.close();
				if(doc){
					var user = new User(doc);
					callback(err,user);
				}else{
					callback(err,null);	
				}
				
			});
		});
	});
};


