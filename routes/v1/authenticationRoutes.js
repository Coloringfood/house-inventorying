let express = require('express');
let router = express.Router();
let debug = require('debug')('house-inventorying:routes:v1:authentication'),
    UserService = require('./../../services/users'),
    fs = require('fs'),
    path = require('path');

router.use((req, res, next) => {
        req.validateUser = () => {
            debug('validateUser');

            validateUserData();

            return req.checkErrors();
        };

        function validateUserData() {
            req.assert('name', 'This field should be a string').isString();
            req.assert('name', 'This field should be 30 characters or less').len(0, 30);
            req.assert('email', 'This field should be a string').isString();
            req.assert('email', 'This field should be 100 characters or less').len(0, 100);
            req.assert('username', 'This field should be a string').isString();
            req.assert('username', 'This field should be 30 characters or less').len(0, 30);
            req.assert('password', 'This field should be a string').isString();
        }

        return next();
    }
);

router.route('/create')
    .post((req, res, next) => {
        debug(req.body);
        if (req.validateUser()) {
            let body = req.body;
            return UserService.createUser(body)
                .then((result) => {
                    res.send(result);
                })
                .catch((e) => {
                    next(e);
                });

        }
    });

router.route('/update')
    .put((req, res, next) => {
        debug('updateUser');
        if (req.body.id === req.user.userId) {
            return UserService.updateUser(req.body)
                .then((result) => {
                    debug("updateResult: %o", result);
                    res.status(200).send(result);
                });
        }
        else {
            next({
                showMessage: "You are not allowed to edit other people's settings",
                status: 400
            });
        }

    });

router.route('/themes')
    .get((req, res, next) => {
        let location = path.join(__dirname, '..', '..', 'public', 'assets', 'css', 'themes');
        fs.readdir(location, (err, results) => {
            res.send(results);
        });
    });

router.route('/')
    .post((req, res, next) => {
        debug(req.body);
        return UserService.authenticate(req.body.username, req.body.password)
            .then((result) => {
                res.send(result);
            })
            .catch((e) => {
                next(e);
            });
    });


module.exports = router;