let Pictures = module.exports = {};
let debug = require('debug')('house-inventorying:services:pictures'),
    RoomTable = require('./../models/rooms'),
    HouseTable = require('./../models/houses'),
    UsersTable = require('./../models/users');

Pictures.userHasAccess = (room_id, user_id) => {
    return HouseTable.userHasAccess(room_id, user_id);
};