let express = require('express'),
    router = express.Router(),
    debug = require('debug')('house-inventorying:routes:v1:rooms'),
    LocationsRoutes = require('./locationsRoutes'),
    RoomsService = require('./../../services/rooms');

router.use((req, res, next) => {
    console.log("Got rooms");

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
        req.assert('house_id', 'This optional field should be a Boolean').isInteger();
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
        RoomsService.getAllRooms(req.user.userId)
            .then((results) => {
                res.json(results);
            })
            .catch((e) => {
                next(e);
            });
    })
    .post((req, res, next) => {
        debug("Post: %o", req.body);
        if (req.validateRoom()) {
            let body = req.body;
            body.created_by_id = req.user.userId;
            return RoomsService.addRoom(body)
                .then((result) => {
                    debug("post result: %o", result);
                    res.status(201).send();
                })
                .catch((e) => {
                    next(e);
                });
        }
    });

router.route('/:room_id', (req, res, next) => {
    debug("Checking permissions to room");
    let err = null;
    // Validate user has access to room
    if (!RoomsService.userHasAccess(req.params.room_id, req.user.userId)) {
        err = {
            status: 401,
            showMessage: "UnauthorizedError",
            errors: "Unauthorized access to house: " + req.params.house_id
        };
        debug("Unauthorized");
    }

    next(err);
});

// room_router.route('/:room_id')
//     .get((req, res, next) => {
//         debug("get room id:%o", req.params.roomId);
//         RoomsService.getRoom(req.params.roomId, req.user.userId)
//             .then((result) => {
//                 res.json(result);
//             })
//             .catch((e) => {
//                 next(e);
//             });
//     })
//     .put((req, res, next) => {
//         debug("Put on id:%o, object: %o", req.params.roomId, req.body);
//         if (req.validateRoom()) {
//             let body = req.body;
//             RoomsService.updateRoom(req.params.roomId, body, req.user.userId)
//                 .then((result) => {
//                     res.json(result);
//                 })
//                 .catch((e) => {
//                     next(e);
//                 });
//         }
//     })
//     .delete((req, res, next) => {
//         debug("Deleting room: %o", req.params.roomId);
//         RoomsService.deleteRoom(req.params.roomId, req.user.userId)
//             .then((result) => {
//                 res.json(result);
//             })
//             .catch((e) => {
//                 next(e);
//             });
//     });


router.use('/:room_id/locations', LocationsRoutes);

module.exports = router;