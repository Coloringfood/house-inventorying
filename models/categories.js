var db = require('./database');

var categorySchema = {
    id: {
        type: db.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: db.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: db.STRING,
        allowNull: false
    }
};

var categories = db.connection.define('categories', categorySchema, {
    freezeTableName: true,
    timestamps: false,
    paranoid: false,
    underscored: true
});

module.exports = categories;
