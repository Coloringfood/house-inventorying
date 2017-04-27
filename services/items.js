let Items = module.exports = {};
let Promise = require('bluebird'),
    debug = require('debug')('house-inventorying:services:items'),
    ItemsTable = require('./../models/items'),
    LocationsTable = require('./../models/locations'),
    CategoriesTable = require('./../models/categories');

const ITEM_NOT_FOUND = "item_not_found";
const ITEM_INCLUDE = [
    {
        model: LocationsTable,
        attributes: [
            "id"
        ],
        through: {
            attributes: []
        }
    },
    {
        model: CategoriesTable,
        as: 'category'
    }
];
const ITEM_ATTRIBUTES = [
    "id",
    "name",
    "personal",
    "required",
    "always_needed",
    "created_by_id"
];

function convertItemForUI(item) {
    let itemData = item.dataValues;
    let convertedSelected = [];
    let selectedLength = itemData.locations.length;
    for (let i = 0; i < selectedLength; i++) {
        let location = itemData.locations[i];
        convertedSelected.push(location.id);
    }
    itemData.locations = convertedSelected;
    return itemData;
}

Items.getAllItems = (userId) => {
    debug("getAllItems");
    return ItemsTable.findAll(
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
            attributes: ITEM_ATTRIBUTES,
            include: ITEM_INCLUDE
        }
    ).catch(function (error) {
        return Promise.reject({
            error: error,
            message: "sequelize_error",
            location: "Items.getAllItems sequelize findall",
            showMessage: error.showMessage || "Error trying to find all items",
            status: error.status || 500
        });
    }).then(function (allItemsResult) {
        return Promise.map(allItemsResult, convertItemForUI)
            .then(function (results) {
                return results;
            });
    });
};

Items.getItem = (id, userId) => {
    debug("getItem");
    return ItemsTable.find({
        attributes: ITEM_ATTRIBUTES,
        where: {
            id: id,
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
        include: ITEM_INCLUDE
    }).catch(function (error) {
        return Promise.reject({
            error: error,
            message: "sequelize_error",
            location: "Items.getItem sequelize find",
            showMessage: error.showMessage || "Error trying to find item id: " + id,
            status: error.status || 500
        });
    }).then(function (findResult) {
        if (findResult === null) {
            return Promise.reject({
                errors: ITEM_NOT_FOUND,
                location: "Items.getItem",
                showMessage: "Item ID: " + id + " not found",
                status: 404
            });
        }
        return findResult;
    });
};

// Items.addItem = (item) => {
//     debug("addItem");
//     item.category_id = item.category_id || item.category.id || 4;
//     return ItemsTable.create(item)
//         .catch(function (error) {
//             return Promise.reject({
//                 error: error,
//                 message: "sequelize_error",
//                 location: "Items.addItem sequelize create",
//                 showMessage: error.showMessage || "Error creating item",
//                 status: error.status || 500
//             });
//         })
//         .then(function (createResult) {
//             let locationsPromise = Promise.map(item.locations, (location) => {
//                 return addLocationToItem(createResult, location);
//             });
//
//             return Promise.all([locationsPromise]).then(function () {
//                 return createResult;
//             });
//         });
// };
//
// Items.updateItem = (id, item, userId) => {
//     debug("updateItem");
//     if (item.personal == true) {
//         console.log("item.created_by_id: ", item.created_by_id);
//         console.log("userId: ", userId);
//         if (item.created_by_id != userId) {
//             return Promise.reject({
//                 showMessage: "You can not mark this item private, it was not created by you",
//                 status: 400
//             })
//         }
//     }
//     item.category_id = item.category_id || item.category.id || 4;
//     return ItemsTable.update(item, {
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
//             location: "Items.updateItem sequelize update",
//             showMessage: error.showMessage || "Error trying to update item: " + id,
//             status: error.status || 500
//         });
//     }).then(function (updateResult) {
//         if (updateResult[0] === 0) {
//             return Promise.reject({
//                 errors: ITEM_NOT_FOUND,
//                 location: "Items.updateItem",
//                 showMessage: "Item ID: " + id + " not found",
//                 status: 404
//             });
//         }
//         return Items.getItem(id, userId).then(function (itemResult) {
//             let returnValue = itemResult.dataValues;
//             let locationsPromise = updateItemLocations(itemResult, item.locations)
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
// Items.deleteItem = (id, userId) => {
//     debug("deleteItem");
//     return ItemsTable.destroy({
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
//                 errors: ITEM_NOT_FOUND,
//                 location: "Items.deleteItem",
//                 showMessage: "Item ID: " + id + " not found",
//                 status: 404
//             });
//         }
//         return destroyResults;
//     });
// };
//
// function updateItemLocations(item, locations) {
//     debug("updateItemLocations");
//     let updatedLocations = [];
//     return LocationsTable.findAll({
//         attributes: ["id"],
//         include: [{
//             model: ItemsTable,
//             where: {id: item.id},
//             attributes: ["id"],
//             through: {
//                 attributes: []
//             }
//         }]
//     }).then(function (foundLocations) {
//         return Promise.map(foundLocations, (location) => {
//             let index = locations.indexOf(location.id);
//             if (index === -1) {
//                 debug("removing location id %o from item", location.id);
//                 return item.removeLocations(location);
//             } else {
//                 debug("keeping location id %o on item", location.id);
//                 updatedLocations.push(location.id);
//                 return locations.splice(index, 1);
//             }
//         });
//     }).then(function () {
//         return Promise.map(locations, (locationId)=> {
//             return addLocationToItem(item, locationId)
//                 .then((result) => {
//                     updatedLocations.push(result);
//                 });
//         });
//     }).then(function () {
//         return updatedLocations;
//     });
// }
//
// function addLocationToItem(item, locationId) {
//     return LocationsTable.find({
//         where: {
//             id: locationId
//         }
//     }).then((locationResult)=> {
//         if (!locationResult) {
//             return Promise.reject({
//                 message: "location_not_found",
//                 location: "Items.addLocation findLocation empty",
//                 showMessage: "The requested Location (" + locationId + ") was not found",
//                 status: 400
//             });
//         }
//
//         return item.addLocations(locationResult)
//             .catch((error) => {
//                 return Promise.reject({
//                     error: error,
//                     message: "sequelize_error",
//                     location: "addLocationToItem sequelize addLocation",
//                     showMessage: error.showMessage || "Error trying to add Location to Item",
//                     status: error.status || 500
//                 });
//             });
//     });
// }