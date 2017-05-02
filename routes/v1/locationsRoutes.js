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

        function validateLocationData(base_location) {
            debug('validatingCategoryData for %o', base_location);
            req.assert(base_location + 'name', 'This field should be a string').isString();
            req.assert(base_location + 'name', 'This field should be 30 characters or less').len(0, 30);
            req.assert(base_location + 'description', 'This field should be a string').optional({checkFalsy: true}).isString();
            req.assert(base_location + 'description', 'This field should be 30 characters or less').optional({checkFalsy: true}).len(0, 300);
            req.assert(base_location + 'picture_location', 'This field should be 30 characters or less').optional({checkFalsy: true}).len(0, 100);
            req.assert(base_location + 'room_id', 'This optional field should be a Boolean').isInteger();
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
module.exports = router;