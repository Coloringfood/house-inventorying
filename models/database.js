var db = require('sequelize');
var config = require('./../config/config.json');
var debug = require('debug')('house-inventorying:server:database');

var connection = new db(config.database.database, config.database.username, config.database.password, {
	host: config.database.host,
	dialect: 'mysql',
	logging: debug,

	pool: {
		max: config.database.connectionLimit,
		min: 0,
		idle: 10000
	},
	dialectOptions: {
		multipleStatements: true
	}
});

db.connection = connection;

module.exports = db;
