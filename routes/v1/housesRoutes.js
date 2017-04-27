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
        HousesService.getAllHouses(req.user.userId)
            .then((results) => {
                res.json(results);
            })
            .catch((e) => {
                next(e);
            });
    })
    .post((req, res, next) => {
        debug("Post: %o", req.body);
        if (req.validateHouse()) {
            let body = req.body;
            body.created_by_id = req.user.userId;
            return HousesService.addHouse(body)
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
    debug("Checking permissions to room");
    let err = null;
    // Validate user has access to house
    if (!HousesService.userHasAccess(req.params.house_id, req.user.userId)) {
        err = {
            status: 401,
            showMessage: "UnauthorizedError",
            errors: "Unauthorized access to house: " + req.params.house_id
        };
        debug("Unauthorized");
    }

    next(err);
});

// router.route('/:house_id')
//     .get((req, res, next) => {
//         debug("get house id:%o", req.params.house_id);
//         HousesService.getHouse(req.params.house_id, req.user.userId)
//             .then((result) => {
//                 res.json(result);
//             })
//             .catch((e) => {
//                 next(e);
//             });
//     })
//     .put((req, res, next) => {
//         debug("Put on id:%o, object: %o", req.params.house_id, req.body);
//         if (req.validateHouse()) {
//             let body = req.body;
//             HousesService.updateHouse(req.params.house_id, body, req.user.userId)
//                 .then((result) => {
//                     res.json(result);
//                 })
//                 .catch((e) => {
//                     next(e);
//                 });
//         }
//     })
//     .delete((req, res, next) => {
//         debug("Deleting house: %o", req.params.house_id);
//         HousesService.deleteHouse(req.params.house_id)
//             .then((result) => {
//                 res.json(result);
//             })
//             .catch((e) => {
//                 next(e);
//             });
//     });


router.use('/:house_id/rooms', RoomsRoutes);

module.exports = router;