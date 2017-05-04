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
        .then((user_find_result) => {
            if (user_find_result) {
                return generateToken(user_find_result);
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
    delete new_user.id;
    return UsersTable.create(new_user)
        .catch((error) => {
            debug("sequelize error: %o", error);
            return Promise.reject({
                errors: error,
                message: "sequelize_error",
                location: "",
                showMessage: "Error Creating User",
                status: error.status || 400
            });
        })
        .then((create_result) => {
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
        return UsersTable.find({
            where: {
                id: user_data.id
            }
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
        id: user.id,
        token: token
    };
}