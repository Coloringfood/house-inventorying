var db = require('./database');
var locations = require('./locations'),
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
    category_id: {
        type: db.INTEGER.UNSIGNED,
        defaultValue: 4
    },
    location_id: {
        type: db.INTEGER.UNSIGNED,
        defaultValue: 4
    },
    created_by_id: {
        type: db.INTEGER.UNSIGNED
    }
};

var items = db.connection.define('items', itemSchema, {
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: true
});


var itemsCategoriesSchema = {},
    itemsCategories = db.connection.define('items_categories', itemsCategoriesSchema, {
        freezeTableName: true,
        timestamps: true,
        paranoid: false,
        underscored: true
    });

items.belongsToMany(categories, {through: itemsCategories});
categories.belongsToMany(items, {through: itemsCategories});

items.belongsTo(locations, {foreignKey: 'location_id'});
locations.hasMany(items, {foreignKey: 'location_id'});

module.exports = items;
