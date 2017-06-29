var db = require('./database');
var house = require('./houses');

var roomSchema = {
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
	house_id: {
		type: db.INTEGER.UNSIGNED,
		defaultValue: 0
	}
};

var rooms = db.connection.define('rooms', roomSchema, {
	freezeTableName: true,
	timestamps: true,
	paranoid: true,
	underscored: true
});

rooms.belongsTo(house, {foreignKey: 'house_id'});
house.hasMany(rooms, {foreignKey: 'house_id'});

module.exports = rooms;
