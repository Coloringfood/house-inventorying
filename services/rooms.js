let Rooms = module.exports = {};
let Promise = require('bluebird'),
    debug = require('debug')('house-inventorying:services:rooms'),
    RoomsTable = require('./../models/rooms');

const ROOM_ATTRIBUTES = [
    "id",
    "name",
    "description",
    "picture_room"
];
Rooms.getAllRooms = () => {
    debug("getAllRooms");
    return RoomsTable.findAll({
        attributes: ROOM_ATTRIBUTES,
        order: [
            ["name", "ASC"]
        ]
    })
        .then(function (all_items_result) {
            return all_items_result;
        });
};

// Rooms.addRooms = (new_rooms, created_by) => {
//     debug("addRooms: %o", new_rooms);
//     return Promise.map(new_rooms, (room) => {
//         room.created_by = created_by;
//         return RoomsTable.create(room);
//     }).then(function (createResult) {
//         return createResult;
//     });
// };
//
// function addRoomToRoom(room, room_id){
//
// }