let Users = module.exports = {};
let Promise = require('bluebird'),
    debug = require('debug')('house-inventorying:services:users'),
    UsersTable = require('./../models/users'),
    jwt = require('jsonwebtoken'),
    config = require('./../config/config.json');


Users.authenticate = (username, password) => {
    debug("authenticate");
    return UsersTable.find({
        where: {
            username: username,
            password: password
        }
    })
        .then(function (all_items_result) {
            if (all_items_result) {
                return generateToken(all_items_result);
            }
            else {
                return Promise.reject({
                    showMessage: "Invalid credentials",
                    status: 400
                });
            }
        });
};

Users.createUser = (new_user) => {
    debug("Create User");
    return UsersTable.create(new_user)
        .catch(function (error) {
            debug("sequelize error: %o", error);
            return Promise.reject({
                errors: error,
                message: "sequelize_error",
                location: "",
                showMessage: "Error Creating User",
                status: error.status || 400
            });
        })
        .then(function (create_result) {
            debug("create_result.dataValues: %o", create_result.dataValues);
            return Promise.resolve(Users.authenticate(new_user.username, new_user.password));
        });
};

Users.updateUser = (user_data) => {
    debug("updateUser");
    user_data.settings = JSON.stringify(user_data.settings);


    return UsersTable.update(user_data, {
        where: {
            id: user_data.id
        }
    }).then((result) => {
        debug("updating User's age");

        return UsersTable.find({
            where: {
                id: user_data.id
            },
            include: USERS_INCLUDE
        }).then((result) => {
            return generateToken(result.dataValues);
        });
    });
};

function generateToken(user) {
    debug("generateToken");

    if (!user.settings) {
        user.settings = {};
    } else {
        user.settings = JSON.parse(user.settings);
    }
    let tokenData = {
        userId: user.id,
        user: user
    };
    let options = {
        expiresIn: config.security.expiration, // 10 minutes
        issuer: config.security.issuer
    };
    debug(tokenData);
    let token = jwt.sign(tokenData, config.security.secret, options);
    return {
        id: 1,
        token: token
    };
}