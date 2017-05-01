let express = require('express'),
    router = express.Router(),
    debug = require('debug')('house-inventorying:routes:v1:houses'),
    RoomsRoutes = require('./roomsRoutes'),
    HousesService = require('./../../services/houses');

router.use((req, res, next) => {
    req.validateHouse = () => {
        debug('validateHouse');
        validateHouseData();
        if (typeof req.body.factors === 'object' && Array.isArray(req.body.factors)) {
            let features_length = req.body.factors.length;
            for (let i = 0; i < features_length; i++) {
                validateFactorData('factors[' + i + ']');
            }
        }

        return req.checkErrors();
    };

    function validateHouseData() {
        req.assert('name', 'This field should be a string').isString();
        req.assert('name', 'This field should be 30 characters or less').len(0, 30);
        req.assert('description', 'This field should be a string').optional({checkFalsy: true}).isString();
        req.assert('description', 'This field should be 30 characters or less').optional({checkFalsy: true}).len(0, 300);
    }

    function validateFactorData(base_location) {
        debug('validatingCategoryData for %o', base_location);
        req.assert(base_location, 'This field (factor) should be a string').isInt();
    }

    return next();
});
router.route('/')
    .get((req, res, next) => {
        debug('GET /house');
        return HousesService.getAllHouses(req.user.userId)
            .then((results) => {
                res.json(results);
            })
            .catch((e) => {
                next(e);
            });
    })
    .post((req, res, next) => {
        debug("Post: %o", req.body);
        debug("user: " + req.user.userId);
        if (req.validateHouse()) {
            return HousesService.addHouse(req.body, req.user.userId)
                .then((result) => {
                    debug("post result: %o", result);
                    res.status(201).send();
                })
                .catch((e) => {
                    next(e);
                });
        }
    });

router.use('/:house_id', (req, res, next) => {
    debug("Checking permissions to house");
    return HousesService.userHasAccess(req.params.house_id, req.user.userId).then(
        (has_access) => {
            let err = null;
            debug("User has house access: " + has_access);
            // Validate user has access to house
            if (!has_access) {
                err = {
                    status: 401,
                    showMessage: "UnauthorizedError",
                    errors: "Unauthorized access to house: " + req.params.house_id
                };
            } else {
                req.house_id = req.params.house_id
            }

            next(err);
        })
        .catch((e) => {
            next(e);
        });
});

router.route("/:house_id/users")
    .post((req, res, next) => {
        debug("adding user IDs: " + req.body + " to house id: " + req.params.house_id);
        debug("user: " + req.user.userId);
        return HousesService.addUsersToHouse(req.body, req.params.house_id)
            .then((result) => {
                res.status(204).json(result);
            })
            .catch((e) => {
                next(e);
            });
    })
    .delete((req, res, next) => {
        debug("removing user IDs: " + req.body + " from house id: " + req.params.house_id);
        debug("user: " + req.user.userId);
        return HousesService.removeUsersFromHouse(req.body, req.params.house_id)
            .then((result) => {
                res.status(204).json(result);
            })
            .catch((e) => {
                next(e);
            });
    });

router.use('/:house_id/rooms', RoomsRoutes);

router.route('/:house_id')
    .get((req, res, next) => {
        debug("get house id:%o", req.params.house_id);
        return HousesService.getHouse(req.params.house_id)
            .then((result) => {
                res.json(result);
            })
            .catch((e) => {
                next(e);
            });
    })
    .put((req, res, next) => {
        debug("Put on id:%o, object: %o", req.params.house_id, req.body);
        debug("user: " + req.user.userId);
        if (req.validateHouse()) {
            let body = req.body;
            HousesService.updateHouse(req.params.house_id, body)
                .then((result) => {
                    res.status(204).send();
                })
                .catch((e) => {
                    next(e);
                });
        }
    })
    .delete((req, res, next) => {
        debug("Deleting house: %o", req.params.house_id);
        debug("user: " + req.user.userId);
        HousesService.deleteHouse(req.params.house_id)
            .then((result) => {
                res.json(result);
            })
            .catch((e) => {
                next(e);
            });
    });


module.exports = router;