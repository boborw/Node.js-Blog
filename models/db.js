var setting = require('../setting.js');
var db = require("mongodb").DB;
var connection = require("mongodb").Connection;
var server = require("mongodb").Server;

module.exports = new Db(setting.db,new Server(setting.host,connection.DEFAILT_PORT,{}));

