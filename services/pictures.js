let Pictures = module.exports = {};
let debug = require('debug')('house-inventorying:services:pictures'),
    RoomTable = require('./../models/rooms'),
    HouseTable = require('./../models/houses'),
    UsersTable = require('./../models/users');

Pictures.userHasAccess = (room_id, user_id) => {
    debug("check user Access for pictures in room");
    return RoomTable.find({
        where: {
            id: room_id
        },
        include: [{
            model: HouseTable,
            attributes: [
                "id"
            ],
            include: [{
                model: UsersTable,
                where: {            // Adding a where makes this required
                    id: user_id
                }
            }],
            required: true
        }]
    }).catch(function (error) {
        return Promise.reject({
            error: error,
            message: "sequelize_error",
            location: "Pictures.hasAccess sequelize find",
            showMessage: error.showMessage || "Error trying to find room id: " + room_id,
            status: error.status || 500
        });
    }).then(function (result){
        debug(result);
        return !!result.DataValues;
    })
};