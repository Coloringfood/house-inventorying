var db = require('./database'),
	room = require('./rooms');

var locationSchema = {
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
	description: {
		type: db.STRING(300),
		default: ""
	},
	picture_location: {
		type: db.STRING(100)
	},
	room_id: {
		type: db.INTEGER.UNSIGNED,
		defaultValue: 0
	}
};

var locations = db.connection.define('locations', locationSchema, {
	freezeTableName: true,
	timestamps: true,
	paranoid: true,
	underscored: true
});

locations.belongsTo(room, {foreignKey: 'room_id'});
room.hasMany(locations, {foreignKey: 'room_id'});

module.exports = locations;
