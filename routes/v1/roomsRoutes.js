let express = require('express'),
    router = express.Router(),
    debug = require('debug')('house-inventorying:routes:v1:rooms'),
    LocationsRoutes = require('./locationsRoutes'),
    RoomsService = require('./../../services/rooms');

router.use((req, res, next) => {
    req.validateRoom = () => {
        debug('validateRoom');
        validateRoomData();
        if (typeof req.body.factors === 'object' && Array.isArray(req.body.factors)) {
            let features_length = req.body.factors.length;
            for (let i = 0; i < features_length; i++) {
                validateFactorData('factors[' + i + ']');
            }
        }

        return req.checkErrors();
    };

    function validateRoomData() {
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
        debug('GET /room');
        RoomsService.getAllRooms(req.house_id)
            .then((results) => {
                res.send(results)
            })
            .catch((e) => {
                next(e);
            });
    })
    .post((req, res, next) => {
        debug("Post: %o", req.body);
        debug("user: " + req.user.userId);
        if (req.validateRoom()) {
            return RoomsService.addRoom(req.body, req.house_id)
                .then((result) => {
                    debug("post result: %o", result);
                    res.status(201).send(result);
                })
                .catch((e) => {
                    next(e);
                });
        }
    });

router.use('/:room_id', (req, res, next) => {
    debug("Checking permissions to room");
    return RoomsService.roomBelongsToHouse(req.params.room_id, req.house_id).then(
        (belongs_to_house) => {
            let err = null;
            debug("room belongs to house: " + belongs_to_house);
            // Validate user has access to house
            if (!belongs_to_house) {
                err = {
                    status: 404,
                    showMessage: "Room Not Found",
                    errors: "Can't find room (" + req.params.room_id + ") in house (" + req.house_id + ")"
                };
            } else {
                req.room_id = req.params.room_id;
            }

            next(err);
        })
        .catch((e) => {
            next(e);
        });
});

router.use("/:room_id/locations", LocationsRoutes);

router.route('/:room_id')
    .get((req, res, next) => {
        debug("get room id:%o", req.params.room_id);
        RoomsService.getRoom(req.params.room_id)
            .then((result) => {
                res.json(result);
            })
            .catch((e) => {
                next(e);
            });
    })
    .put((req, res, next) => {
        debug("Put on id:%o, object: %o", req.params.room_id, req.body);
        debug("user: " + req.user.userId);
        if (req.validateRoom()) {
            let body = req.body;
            RoomsService.updateRoom(req.params.room_id, body, req.user.userId)
                .then((result) => {
                    res.status(204).send(result);
                })
                .catch((e) => {
                    next(e);
                });
        }
    })
    .delete((req, res, next) => {
        debug("Deleting room: %o", req.params.room_id);
        debug("user: " + req.user.userId);
        RoomsService.deleteRoom(req.params.room_id, req.user.userId)
            .then((result) => {
                res.status(204).send();
            })
            .catch((e) => {
                next(e);
            });
    });

module.exports = router;