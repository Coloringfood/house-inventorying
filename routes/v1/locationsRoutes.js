let express = require('express'),
    router = express.Router(),
    debug = require('debug')('house-inventorying:routes:v1:locations'),
    LocationsService = require('./../../services/locations');


router.use((req, res, next) => {
        req.validateLocations = () => {
            debug('validateLocations');

            if (Array.isArray(req.body)) {
                if (typeof req.body === 'object' && Array.isArray(req.body)) {
                    let featuresLength = req.body.length;
                    for (let i = 0; i < featuresLength; i++) {
                        validateLocationData('[' + i + '].');
                    }
                }
            }
            else {
                next({
                    message: 'Validation errors',
                    errors: [{param: "body", msg: "You must pass in an array object for the body"}],
                    status: 400
                });
            }

            return req.checkErrors();
        };

    req.ValidateLocation = () => {
        if (Array.isArray(req.body)) {
            next({
                message: 'Validation errors',
                errors: [{param: "body", msg: "You must pass in an single object for the body"}],
                status: 400
            });
        }
        else {
            validateLocationData('');
        }

        return req.checkErrors();
    }

        function validateLocationData(base_location) {
            debug('validatingCategoryData for %o', base_location);
            req.assert(base_location + 'name', 'This field should be a string').isString();
            req.assert(base_location + 'name', 'This field should be 30 characters or less').len(0, 30);
            req.assert(base_location + 'description', 'This field should be a string').optional({checkFalsy: true}).isString();
            req.assert(base_location + 'description', 'This field should be 30 characters or less').optional({checkFalsy: true}).len(0, 300);
            req.assert(base_location + 'picture_location', 'This field should be 30 characters or less').optional({checkFalsy: true}).len(0, 100);
        }

        return next();
    }
);

router.route('/')
    .get((req, res, next) => {
        debug('GET /location');
        LocationsService.getAllLocations(req.room_id)
            .then((results) => {
                res.send(results)
            })
            .catch((e) => {
                next(e);
            });
    })
    .post((req, res, next) => {
        debug("Post: %o", req.body);
        if (req.validateLocations()) {
            return LocationsService.addLocations(req.body, req.room_id)
                .then((result) => {
                    debug("post result: %o", result);
                    res.status(201).send();
                })
                .catch((e) => {
                    next(e);
                });
        }
    });

router.use('/:location_id', (req, res, next) => {
    debug("Checking permissions to room");
    return LocationsService.locationBelongsToRoom(req.params.location_id, req.room_id).then(
        (belongs_to_house) => {
            let err = null;
            debug("room belongs to house: " + belongs_to_house);
            // Validate user has access to house
            if (!belongs_to_house) {
                err = {
                    status: 404,
                    showMessage: "Room Not Found",
                    errors: "Can't find location (" + req.params.location_id + ") in room (" + req.room_id + ")"
                };
            } else {
                req.location_id = req.params.location_id;
            }

            next(err);
        })
        .catch((e) => {
            next(e);
        });
});

router.route('/:location_id')
    .get((req, res, next) => {
        debug("get location id:%o", req.params.location_id);
        LocationsService.getLocation(req.params.location_id)
            .then((result) => {
                res.json(result);
            })
            .catch((e) => {
                next(e);
            });
    })
    .put((req, res, next) => {
        debug("Put on id:%o, object: %o", req.params.location_id, req.body);
        debug("user: " + req.user.userId);
        if (req.ValidateLocation()) {
            let body = req.body;
            delete body.picture_location; // picture_location must be updated via another endpoint
            LocationsService.updateLocation(req.params.location_id, body)
                .then((result) => {
                    res.status(204).send(result);
                })
                .catch((e) => {
                    next(e);
                });
        }
    })
    .delete((req, res, next) => {
        debug("Deleting location: %o", req.params.location_id);
        debug("user: " + req.user.userId);
        LocationsService.deleteLocation(req.params.location_id, req.user.userId)
            .then((result) => {
                res.status(204).send();
            })
            .catch((e) => {
                next(e);
            });
    });

module.exports = router;