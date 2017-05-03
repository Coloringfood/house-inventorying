let Rooms = module.exports = {};
let Promise = require('bluebird'),
    debug = require('debug')('house-inventorying:services:rooms'),
    HousesTable = require('./../models/houses'),
    RoomsTable = require('./../models/rooms');

const ROOM_ATTRIBUTES = [
    "id",
    "name",
    "description"
];
const ROOM_NOT_FOUND = "room_not_found";

function convertRoomForUI(room) {
    let roomData = room.dataValues;
    if (roomData.house) {
        delete roomData.house;
    }
    return roomData;
}

Rooms.getAllRooms = (house_id) => {
    debug("getAllRooms");
    return RoomsTable.findAll(
        {
            attributes: ROOM_ATTRIBUTES,
            order: [
                ["name", "ASC"]
            ],
            include: [{
                model: HousesTable,
                where: {
                    id: house_id
                }
            }]
        })
        .catch((error) => {
            return Promise.reject({
                error: error,
                message: "sequelize_error",
                location: "Rooms.getAllRooms sequelize find",
                showMessage: error.showMessage || "Error trying to find all rooms for house id: " + house_id,
                status: error.status || 500
            });
        })
        .then((all_items_result) => {
            return Promise.map(all_items_result, convertRoomForUI);
        });
};

Rooms.roomBelongsToHouse = (room_id, house_id) => {
    debug("check user Access to room: " + room_id + " in house: " + house_id);
    return RoomsTable.find({
        where: {
            id: room_id
        },
        include: [{
            model: HousesTable,
            where: {
                id: house_id
            }
        }]
    }).catch((error) => {
        return Promise.reject({
            error: error,
            message: "sequelize_error",
            location: "Rooms.roomBelongsToHouse sequelize find",
            showMessage: error.showMessage || "Error trying to find room id: " + room_id,
            status: error.status || 500
        });
    }).then((result) => {
        return !!result;
    })
};

Rooms.getRoom = (id) => {
    debug("getRoom");
    return RoomsTable.find({
        where: {
            id: id
        },
        attributes: ROOM_ATTRIBUTES
    }).catch((error) => {
        return Promise.reject({
            error: error,
            message: "sequelize_error",
            location: "Rooms.getRoom sequelize find",
            showMessage: error.showMessage || "Error trying to find room id: " + id,
            status: error.status || 500
        });
    }).then((findResult) => {
        if (findResult === null) {
            return Promise.reject({
                errors: ROOM_NOT_FOUND,
                location: "Rooms.getRoom",
                showMessage: "Room ID: " + id + " not found",
                status: 404
            });
        }
        return findResult;
    });
};

Rooms.addRoom = (new_room, house_id) => {
    debug("Rooms.addRoom: %o", new_room);
    new_room.house_id = house_id;
    return RoomsTable.create(new_room)
        .then((room_result) => {
            return {id: room_result.id};
        });
};

Rooms.updateRoom = (id, room) => {
    debug("updateRoom");
    return RoomsTable.update(room, {
        where: {
            id: id
        }
    }).catch((error) => {
        return Promise.reject({
            error: error,
            message: "sequelize_error",
            location: "Rooms.updateRoom sequelize update",
            showMessage: error.showMessage || "Error trying to update room: " + id,
            status: error.status || 500
        });
    }).then((updateResult) => {
        if (updateResult[0] === 0) {
            return Promise.reject({
                errors: HOUSE_NOT_FOUND,
                location: "Rooms.updateRoom",
                showMessage: "Room ID: " + id + " not found",
                status: 404
            });
        }
        return room;
    });
};

Rooms.deleteRoom = (id) => {
    debug("deleteRoom");
    return RoomsTable.destroy({
        where: {
            id: id
        }
    }).then((destroyResults) => {
        if (destroyResults === 0) {
            return Promise.reject({
                errors: ROOM_NOT_FOUND,
                location: "Rooms.deleteRoom",
                showMessage: "Room ID: " + id + " not found",
                status: 404
            });
        }
        return destroyResults;
    });
};