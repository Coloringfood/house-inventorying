

let Houses = module.exports = {};
let Promise = require('bluebird'),
    debug = require('debug')('house-inventorying:services:houses'),
    HousesTable = require('./../models/houses');

const HOUSE_NOT_FOUND = "house_not_found";
const HOUSE_ATTRIBUTES = [
    "id",
    "name",
    "description",
    "created_by_id"
];

function convertHouseForUI(house) {
    let houseData = house.dataValues;
    let convertedSelected = [];
    let selectedLength = houseData.locations.length;
    for (let i = 0; i < selectedLength; i++) {
        let location = houseData.locations[i];
        convertedSelected.push(location.id);
    }
    houseData.locations = convertedSelected;
    return houseData;
}

Houses.userHasAccess = (house_id, user_id) => {
    debug("check user Access for pictures in room");
    return HouseTable.find({
        where: {
            id: house_id
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
            showMessage: error.showMessage || "Error trying to find room id: " + house_id,
            status: error.status || 500
        });
    }).then(function (result){
        debug(result);
        return !!result.DataValues;
    })
};

Houses.getAllHouses = (userId) => {
    debug("getAllHouses");
    return HousesTable.findAll(
        {
            where: {
                $or: [
                    {
                        personal: 0
                    },
                    {
                        personal: 1,
                        created_by_id: userId
                    }
                ]
            },
            order: [
                ["name", "ASC"]
            ],
            attributes: HOUSE_ATTRIBUTES
        }
    ).catch(function (error) {
        return Promise.reject({
            error: error,
            message: "sequelize_error",
            location: "Houses.getAllHouses sequelize findall",
            showMessage: error.showMessage || "Error trying to find all houses",
            status: error.status || 500
        });
    }).then(function (allHousesResult) {
        return Promise.map(allHousesResult, convertHouseForUI)
            .then(function (results) {
                return results;
            });
    });
};

// Houses.getHouse = (id, userId) => {
//     debug("getHouse");
//     return HousesTable.find({
//         attributes: HOUSE_ATTRIBUTES,
//         where: {
//             id: id,
//             $or: [
//                 {
//                     personal: 0
//                 },
//                 {
//                     personal: 1,
//                     created_by_id: userId
//                 }
//             ]
//         }
//     }).catch(function (error) {
//         return Promise.reject({
//             error: error,
//             message: "sequelize_error",
//             location: "Houses.getHouse sequelize find",
//             showMessage: error.showMessage || "Error trying to find house id: " + id,
//             status: error.status || 500
//         });
//     }).then(function (findResult) {
//         if (findResult === null) {
//             return Promise.reject({
//                 errors: HOUSE_NOT_FOUND,
//                 location: "Houses.getHouse",
//                 showMessage: "House ID: " + id + " not found",
//                 status: 404
//             });
//         }
//         return findResult;
//     });
// };
//
// Houses.addHouse = (house) => {
//     debug("addHouse");
//     house.category_id = house.category_id || house.category.id || 4;
//     return HousesTable.create(house)
//         .catch(function (error) {
//             return Promise.reject({
//                 error: error,
//                 message: "sequelize_error",
//                 location: "Houses.addHouse sequelize create",
//                 showMessage: error.showMessage || "Error creating house",
//                 status: error.status || 500
//             });
//         })
//         .then(function (createResult) {
//             let locationsPromise = Promise.map(house.locations, (location) => {
//                 return addLocationToHouse(createResult, location);
//             });
//
//             return Promise.all([locationsPromise]).then(function () {
//                 return createResult;
//             });
//         });
// };
//
// Houses.updateHouse = (id, house, userId) => {
//     debug("updateHouse");
//     if (house.personal == true) {
//         console.log("house.created_by_id: ", house.created_by_id);
//         console.log("userId: ", userId);
//         if (house.created_by_id != userId) {
//             return Promise.reject({
//                 showMessage: "You can not mark this house private, it was not created by you",
//                 status: 400
//             })
//         }
//     }
//     house.category_id = house.category_id || house.category.id || 4;
//     return HousesTable.update(house, {
//         where: {
//             id: id,
//             $or: [
//                 {
//                     personal: 0
//                 },
//                 {
//                     personal: 1,
//                     created_by_id: userId
//                 }
//             ]
//         }
//     }).catch(function (error) {
//         return Promise.reject({
//             error: error,
//             message: "sequelize_error",
//             location: "Houses.updateHouse sequelize update",
//             showMessage: error.showMessage || "Error trying to update house: " + id,
//             status: error.status || 500
//         });
//     }).then(function (updateResult) {
//         if (updateResult[0] === 0) {
//             return Promise.reject({
//                 errors: HOUSE_NOT_FOUND,
//                 location: "Houses.updateHouse",
//                 showMessage: "House ID: " + id + " not found",
//                 status: 404
//             });
//         }
//         return Houses.getHouse(id, userId).then(function (houseResult) {
//             let returnValue = houseResult.dataValues;
//             let locationsPromise = updateHouseLocations(houseResult, house.locations)
//                 .then(function (newLocations) {
//                     returnValue.locations = newLocations;
//                 });
//             return Promise.all([locationsPromise]).then(function () {
//                 return returnValue;
//             });
//         });
//     });
// };
//
// Houses.deleteHouse = (id, userId) => {
//     debug("deleteHouse");
//     return HousesTable.destroy({
//         where: {
//             id: id,
//             $or: [
//                 {
//                     personal: 0
//                 },
//                 {
//                     personal: 1,
//                     created_by_id: userId
//                 }
//             ]
//         }
//     }).then(function (destroyResults) {
//         if (destroyResults === 0) {
//             return Promise.reject({
//                 errors: HOUSE_NOT_FOUND,
//                 location: "Houses.deleteHouse",
//                 showMessage: "House ID: " + id + " not found",
//                 status: 404
//             });
//         }
//         return destroyResults;
//     });
// };
//
// function updateHouseLocations(house, locations) {
//     debug("updateHouseLocations");
//     let updatedLocations = [];
//     return LocationsTable.findAll({
//         attributes: ["id"],
//         include: [{
//             model: HousesTable,
//             where: {id: house.id},
//             attributes: ["id"],
//             through: {
//                 attributes: []
//             }
//         }]
//     }).then(function (foundLocations) {
//         return Promise.map(foundLocations, (location) => {
//             let index = locations.indexOf(location.id);
//             if (index === -1) {
//                 debug("removing location id %o from house", location.id);
//                 return house.removeLocations(location);
//             } else {
//                 debug("keeping location id %o on house", location.id);
//                 updatedLocations.push(location.id);
//                 return locations.splice(index, 1);
//             }
//         });
//     }).then(function () {
//         return Promise.map(locations, (locationId)=> {
//             return addLocationToHouse(house, locationId)
//                 .then((result) => {
//                     updatedLocations.push(result);
//                 });
//         });
//     }).then(function () {
//         return updatedLocations;
//     });
// }
//
// function addLocationToHouse(house, locationId) {
//     return LocationsTable.find({
//         where: {
//             id: locationId
//         }
//     }).then((locationResult)=> {
//         if (!locationResult) {
//             return Promise.reject({
//                 message: "location_not_found",
//                 location: "Houses.addLocation findLocation empty",
//                 showMessage: "The requested Location (" + locationId + ") was not found",
//                 status: 400
//             });
//         }
//
//         return house.addLocations(locationResult)
//             .catch((error) => {
//                 return Promise.reject({
//                     error: error,
//                     message: "sequelize_error",
//                     location: "addLocationToHouse sequelize addLocation",
//                     showMessage: error.showMessage || "Error trying to add Location to House",
//                     status: error.status || 500
//                 });
//             });
//     });
// }