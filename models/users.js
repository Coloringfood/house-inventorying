var db = require('./database');

var userSchema = {
	id: {
		type: db.INTEGER.UNSIGNED,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false
	},
	name: {
		type: db.STRING(30),
		allowNull: false
	},
	email: {
		type: db.STRING(100),
		allowNull: true
	},
	username: {
		type: db.STRING(30),
		allowNull: true,
		unique: true
	},
	password: {
		type: db.STRING(),
		allowNull: true
	},
	settings: {
		type: db.STRING,
		allowNull: true
	}
};

var users = db.connection.define('users', userSchema, {
	freezeTableName: true,
	timestamps: true,
	paranoid: true,
	underscored: true
});

module.exports = users;
