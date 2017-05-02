let Locations = module.exports = {};
let Promise = require('bluebird'),
    debug = require('debug')('house-inventorying:services:locations'),
    LocationsTable = require('./../models/locations');

const LOCATION_ATTRIBUTES = [
    "id",
    "name",
    "description",
    "picture_location"
];
Locations.getAllLocations = () => {
    debug("getAllLocations");
    return LocationsTable.findAll({
        attributes: LOCATION_ATTRIBUTES,
        order: [
            ["name", "ASC"]
        ]
    })
        .then((all_items_result) => {
            return all_items_result;
        });
};

Locations.addLocations = (new_locations, room_id) => {
    debug("addLocations: %o", new_locations);
    return Promise.map(new_locations, (location) => {
        location.room_id = room_id;
        return LocationsTable.create(location);
    }).then((createResult) => {
        return createResult;
    });
};