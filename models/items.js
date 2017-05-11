var db = require('./database');
var locations = require('./locations'),
    rooms = require('./rooms'),
    categories = require('./categories');

var itemSchema = {
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
        type: db.STRING(300)
    },
    picture_location: {
        type: db.STRING(100),
    },
    price: {
        type: db.INTEGER.UNSIGNED,
        default: 0
    },
    location_id: {
        type: db.INTEGER.UNSIGNED,
        required: false
    },
    room_id: {
        type: db.INTEGER.UNSIGNED,
        required: false
    }
};

var items = db.connection.define('items', itemSchema, {
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: true
});


var items_categories_tableSchema = {},
    items_categories_table = db.connection.define('items_categories', items_categories_tableSchema, {
        freezeTableName: true,
        timestamps: true,
        paranoid: false,
        underscored: true
    });

items.belongsToMany(categories, {through: items_categories_table});
categories.belongsToMany(items, {through: items_categories_table});

items.belongsTo(locations, {foreignKey: 'location_id'});
locations.hasMany(items, {foreignKey: 'location_id'});

items.belongsTo(rooms, {foreignKey: 'room_id'});
rooms.hasMany(items, {foreignKey: 'room_id'});

module.exports = items;
