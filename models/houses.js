var db = require('./database');
var users = require('./users');

var houseSchema = {
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

var houses = db.connection.define('houses', houseSchema, {
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: true
});

var usersPerHouseSchema = {},
    usersPerHouse = db.connection.define('users_per_house', usersPerHouseSchema, {
        freezeTableName: true,
        timestamps: true,
        paranoid: false,
        underscored: true
    });

houses.belongsToMany(users, {through: usersPerHouse});
users.belongsToMany(houses, {through: usersPerHouse});

module.exports = houses;
