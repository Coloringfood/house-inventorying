let Pictures = module.exports = {};
let debug = require('debug')('house-inventorying:services:pictures'),
	HouseTable = require('./../models/houses');

Pictures.userHasAccess = (room_id, user_id) => {
	return HouseTable.userHasAccess(room_id, user_id);
};