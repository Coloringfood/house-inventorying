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
        .then(function (all_items_result) {
            return all_items_result;
        });
};

// Locations.addLocations = (new_locations, created_by) => {
//     debug("addLocations: %o", new_locations);
//     return Promise.map(new_locations, (location) => {
//         location.created_by = created_by;
//         return LocationsTable.create(location);
//     }).then(function (createResult) {
//         return createResult;
//     });
// };
//
// function addLocationToRoom(location, room_id){
//
// }