let Items = module.exports = {};
let Promise = require('bluebird'),
    debug = require('debug')('house-inventorying:services:items'),
    ItemsTable = require('./../models/items'),
    HouseTable = require('./../models/houses'),
    RoomsTable = require('./../models/rooms'),
    LocationsTable = require('./../models/locations'),
    CategoriesTable = require('./../models/categories');

const ITEM_NOT_FOUND = "item_not_found";
const ITEM_ATTRIBUTES = [
    "id",
    "name",
    "description",
    "picture_location",
    "price",
    "room_id",
    "location_id"
];

/**
 * Takes a sequelize db result and converts it for the UI
 * @param item      Sequelize db result object
 * @returns object  Converted object's data
 */
function convertItemForUI(item) {
    let itemData = item.dataValues;
    if (itemData.house) {
        delete itemData.house;
    }
    if (itemData.location) {
        delete itemData.location
    }
    if (itemData.room) {
        delete itemData.room
    }
    return itemData;
}

/**
 * Checks if requested item ID is part of house
 * @param id        Id of item
 * @param house_id  Id of house being searched
 * @returns boolean True if item is in house
 */
Items.itemIsInHouse = (id, house_id) => {
    debug("check if Item (" + id + ") is in house (" + house_id + ")");
    return locateItems({id: id}, {
        model: RoomsTable,
        include: [{
            model: HouseTable,
            where: {
                id: house_id
            }
        }]
    })
        .then((find_result) => {
            return !!find_result;
        });
};

/**
 * Gets all items attached to specified house
 * @param house_id      Id of house bing searched
 * @returns [object]    Array of items
 */
Items.getAllItems = (house_id) => {
    debug("getAllItems");
    let by_room_promise = ItemsTable.findAll({
        attributes: ITEM_ATTRIBUTES,
        include: [
            {
                model: RoomsTable,
                include: [{
                    model: HouseTable,
                    where: {
                        id: house_id
                    }
                }]
            }
        ]
    });
    let by_location_promise = ItemsTable.findAll({
        attributes: ITEM_ATTRIBUTES,
        include: [
            {
                model: LocationsTable,
                include: [{
                    model: RoomsTable,
                    include: [{
                        model: HouseTable,
                        where: {
                            id: house_id
                        }
                    }]
                }]
            }
        ]
    });
    return Promise.all([by_location_promise, by_room_promise])
        .catch((error) => {
            return Promise.reject({
                error: error,
                message: "sequelize_error",
                location: "Items.getAllItems sequelize findall",
                showMessage: error.showMessage || "Error trying to find all items",
                status: error.status || 500
            });
        })
        .then((allItemsResult) => {
            // combine results
            return allItemsResult[0].concat(allItemsResult[1]);
        })
        .then((allItemsResult) => {
            return Promise.map(allItemsResult, convertItemForUI)
                .then((results) => {
                    return results;
                });
        });
};

/**
 * Gets a specific items data
 * @param id            Id of the item
 * @returns object      Data of the item
 */
Items.getItem = (id) => {
    debug("getItem");
    return ItemsTable.find({
        attributes: ITEM_ATTRIBUTES,
        where: {
            id: id
        }
    }).catch((error) => {
        return Promise.reject({
            error: error,
            message: "sequelize_error",
            location: "Items.getItem sequelize find",
            showMessage: error.showMessage || "Error trying to find item id: " + id,
            status: error.status || 500
        });
    }).then((find_result) => {
        if (find_result === null) {
            return Promise.reject({
                errors: ITEM_NOT_FOUND,
                location: "Items.getItem",
                showMessage: "Item ID: " + id + " not found",
                status: 404
            });
        }
        return convertItemForUI(find_result);
    });
};

/**
 * Looks for any item in house with the same name
 * @param name      Items name
 * @param house_id  House being searched
 * @returns object  Data of the item
 */
Items.findItemByName = (name, house_id) => {
    debug("findItemByName");
    return locateItems({"name": name}, {
        model: RoomsTable,
        include: [{
            model: HouseTable,
            where: {
                id: house_id
            }
        }]
    })
        .then((allItemsResult) => {
            return allItemsResult[0] ? convertItemForUI(allItemsResult[0]) : "";
        });
};

/**
 * Looks for all items in a specific location
 * @param location_id   Id of the location being searched
 * @returns [object]    Array of items
 */
Items.findItemsByLocation = (location_id) => {
    debug("findItemsByLocation");
    return ItemsTable.findAll({
        attributes: ITEM_ATTRIBUTES,
        where: {location_id: location_id}
    }).catch((error) => {
        return Promise.reject({
            error: error,
            message: "sequelize_error",
            location: "Items.findItemsByLocation sequelize find",
            showMessage: error.showMessage || "Error trying to find items in location: " + location_id,
            status: error.status || 500
        });
    }).then((find_result) => {
        return Promise.map(find_result, convertItemForUI)
    });
};

/**
 * Looks for all items in a specified room
 * @param room_id       Id of searched room
 * @returns [object]    Array of items
 */
Items.findItemsByRoom = (room_id) => {
    debug("findItemsByRoom");
    return locateItems(null, {
        model: RoomsTable,
        where: {
            id: room_id
        }
    })
        .then((find_result) => {
            return Promise.map(find_result, convertItemForUI)
        });

};

/**
 * Looks for all items which are attached to a specific category
 * @param category_id   Id of the requested category
 * @param house_id      Id of the house being searched
 * @returns [objects]   Array of items
 */
Items.findItemsByCategory = (category_id, house_id) => {
    return locateItems(
        null,
        {
            model: RoomsTable,
            include: [{
                model: HouseTable,
                where: {
                    id: house_id
                }
            }]
        },
        {
            model: CategoriesTable,
            where: {id: category_id}
        }
    )
        .then((find_result) => {
            return Promise.map(find_result, convertItemForUI)
        });
};

/**
 * Checks that the item's name is unique to its house before creating an item.
 * @param item      The object form of the item to create
 * @param house_id  The id of the house where the item will be created
 * @returns {*}
 */
Items.createItem = (item, house_id) => {
    debug("addItem");
    delete item.id;
    return Items.findItemByName(item.name, house_id)
        .then((find_result) => {
            if (find_result != "") {
                return Promise.reject({
                    location: "Items.addItem find previous",
                    showMessage: "Item with same name already exists in the house",
                    status: 400
                })
            }

            item.house_id = house_id;
            console.log("item: ", item);
            return ItemsTable.create(item)
                .catch((error) => {
                    return Promise.reject({
                        error: error,
                        message: "sequelize_error",
                        location: "Items.addItem sequelize create",
                        showMessage: error.showMessage || "Error creating item",
                        status: error.status || 500
                    });
                })
                .then((create_result) => {
                    console.log("create_result: ", create_result);
                    return {id: create_result.dataValues.id};
                });
        });
};

// Items.updateItem = (id, item) => {
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
//         }
//     }).catch((error) => {
//         return Promise.reject({
//             error: error,
//             message: "sequelize_error",
//             location: "Items.updateItem sequelize update",
//             showMessage: error.showMessage || "Error trying to update item: " + id,
//             status: error.status || 500
//         });
//     }).then((updateResult) => {
//         if (updateResult[0] === 0) {
//             return Promise.reject({
//                 errors: ITEM_NOT_FOUND,
//                 location: "Items.updateItem",
//                 showMessage: "Item ID: " + id + " not found",
//                 status: 404
//             });
//         }
//         return Items.getItem(id);
//     });
// };

/**
 * Marks an item deleted in the Database
 * @param id        Id of item to be deleted
 * @returns boolean True means something was deleted
 */
Items.deleteItem = (id) => {
    debug("deleteItem");
    return ItemsTable.destroy({
        where: {
            id: id
        }
    }).then((destroyResults) => {
        if (destroyResults === 0) {
            return Promise.reject({
                errors: ITEM_NOT_FOUND,
                location: "Items.deleteItem",
                showMessage: "Item ID: " + id + " not found",
                status: 404
            });
        }
        return destroyResults;
    });
};

/**
 * Generic search which searches by location and room
 * @param item_where        Where object if null, will be skipped
 * @param included_room     Include object that will be added to both queries
 * @returns [object]        Array of objects
 */
function locateItems(item_where, included_room, extra_include) {
    let room_include = [included_room].concat(extra_include),
        location_include = [
            {
                model: LocationsTable,
                include: [included_room]
            }].concat(extra_include);

    if (extra_include == null) {
        room_include = [room_include[0]];
        location_include = [location_include[0]];
    }

    let by_room_promise = ItemsTable.findAll({
        attributes: ITEM_ATTRIBUTES,
        where: item_where,
        include: room_include
    });
    let by_location_promise = ItemsTable.findAll({
        attributes: ITEM_ATTRIBUTES,
        where: item_where,
        include: location_include
    });

    return Promise.all([by_location_promise, by_room_promise])
        .catch((error) => {
            return Promise.reject({
                error: error,
                message: "sequelize_error",
                location: "locateItems sequelize findall",
                showMessage: error.showMessage || "Error trying to find all items",
                status: error.status || 500
            });
        })
        .then((allItemsResult) => {
            return allItemsResult[0].concat(allItemsResult[1]);
        })
}