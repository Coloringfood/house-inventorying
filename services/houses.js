let Houses = module.exports = {};
let Promise = require('bluebird'),
    debug = require('debug')('house-inventorying:services:houses'),
    HousesTable = require('./../models/houses'),
    UsersTable = require('./../models/users');

const HOUSE_NOT_FOUND = "house_not_found";
const HOUSE_ATTRIBUTES = [
    "id",
    "name",
    "description"
];

function convertHouseForUI(house) {
    let houseData = house.dataValues;
    if (house.users) {
        let convertedSelected = [];
        let selectedLength = houseData.users.length;
        for (let i = 0; i < selectedLength; i++) {
            let user = houseData.users[i];
            convertedSelected.push(user.id);
        }
        houseData.users = convertedSelected;
    }
    return houseData;
}

Houses.userHasAccess = (house_id, user_id) => {
    debug("check user Access for pictures in room");
    return HousesTable.find({
        where: {
            id: house_id
        },
        include: [{
            model: UsersTable,
            where: {            // Adding a where makes this required
                id: user_id
            }
        }]
    }).catch(function (error) {
        return Promise.reject({
            error: error,
            message: "sequelize_error",
            location: "Pictures.hasAccess sequelize find",
            showMessage: error.showMessage || "Error trying to find room id: " + house_id,
            status: error.status || 500
        });
    }).then(function (result) {
        return !!result;
    })
};

Houses.getAllHouses = (userId) => {
    debug("getAllHouses");
    return HousesTable.findAll(
        {
            include: {
                model: UsersTable,
                where: {
                    id: userId
                }
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

Houses.getHouse = (id) => {
    debug("getHouse");
    return HousesTable.find({
        where: {
            id: id
        },
        attributes: HOUSE_ATTRIBUTES
    }).catch(function (error) {
        return Promise.reject({
            error: error,
            message: "sequelize_error",
            location: "Houses.getHouse sequelize find",
            showMessage: error.showMessage || "Error trying to find house id: " + id,
            status: error.status || 500
        });
    }).then(function (findResult) {
        if (findResult === null) {
            return Promise.reject({
                errors: HOUSE_NOT_FOUND,
                location: "Houses.getHouse",
                showMessage: "House ID: " + id + " not found",
                status: 404
            });
        }
        return findResult;
    });
};

Houses.addHouse = (house, user_id) => {
    debug("addHouse");
    return HousesTable.create(house)
        .catch(function (error) {
            return Promise.reject({
                error: error,
                message: "sequelize_error",
                location: "Houses.addHouse sequelize create",
                showMessage: error.showMessage || "Error creating house",
                status: error.status || 500
            });
        }).then((create_result) => {
            return Houses.addUserToHouse(user_id, create_result)
                .then(function () {
                    return create_result;
                });
        });
};

Houses.addUsersToHouse = (users, house_id) => {
    if (!Array.isArray(users)) {
        users = [users];
    }
    let house = Houses.getHouse(house_id);
    return Promise.map(users, (user_id) => {
        return Houses.addUserToHouse(user_id, house)
    })
};

Houses.addUserToHouse = (user_id, house) => {
    return UsersTable.findById(user_id)
        .then(function (userResult) {
            if (!userResult) {
                return Promise.reject({
                    message: "user_not_found",
                    location: "Houses.addUserToHouse findUser empty",
                    showMessage: "The requested user (" + user_id + ") was not found",
                    status: 400
                });
            }

            return house.addUser(userResult)
                .catch((error) => {
                    return Promise.reject({
                        error: error,
                        message: "sequelize_error",
                        location: "Houses.addUserToHouse sequelize addUser",
                        showMessage: error.showMessage || "Error trying to add User to House",
                        status: error.status || 500
                    });
                });
        })
};

Houses.removeUsersFromHouse = (users, house_id) => {
    if (!Array.isArray(users)) {
        users = [users];
    }
    let house = Houses.getHouse(house_id);
    return Promise.map(users, (user_id) => {
        return Houses.removeUserFromHouse(user_id, house)
    })
};

Houses.removeUserFromHouse = (user_id, house) => {
    return UsersTable.findById(user_id)
        .then(function (userResult) {
            if (!userResult) {
                return Promise.reject({
                    message: "user_not_found",
                    location: "Houses.removeUserFromHouse findUser empty",
                    showMessage: "The requested user (" + user_id + ") was not found",
                    status: 400
                });
            }

            return house.removeUser(userResult)
                .catch((error) => {
                    return Promise.reject({
                        error: error,
                        message: "sequelize_error",
                        location: "Houses.removeUserFromHouse sequelize addUser",
                        showMessage: error.showMessage || "Error trying to remove User to House",
                        status: error.status || 500
                    });
                });
        })
};

Houses.updateHouse = (id, house, user_id) => {
    debug("updateHouse");
    return HousesTable.update(house, {
        where: {
            id: id
        }
    }).catch(function (error) {
        return Promise.reject({
            error: error,
            message: "sequelize_error",
            location: "Houses.updateHouse sequelize update",
            showMessage: error.showMessage || "Error trying to update house: " + id,
            status: error.status || 500
        });
    }).then(function (updateResult) {
        if (updateResult[0] === 0) {
            return Promise.reject({
                errors: HOUSE_NOT_FOUND,
                location: "Houses.updateHouse",
                showMessage: "House ID: " + id + " not found",
                status: 404
            });
        }
        return Promise.map(updateResult, convertHouseForUI)
            .then(function (results) {
                return results;
            });
    });
};

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