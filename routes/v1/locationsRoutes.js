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
            req.assert(base_location + 'name', 'Name is required for locations').isString();
            req.assert(base_location + 'type', 'Type must be one of: "Vacation Type", "Activities", "Other"').isInList(['Vacation Type', 'Activities', 'Other']);
            req.assert(base_location + 'room_id', 'Room is required for all locations').isInt();
        }


        return next();
    }
);
router.route('/list')
	.get((req, res, next) => {
		debug("Get Locations");
		LocationsService.getAllLocations()
			.then((result) => {
				debug("Get Result: %o", result);
				res.json(result);
			})
			.catch((e) => {
				next(e);
			});
	});

router.route('/')
    .post((req, res, next) => {
        debug("Post: %o", req.body);
        if (req.validateLocations()) {
            return LocationsService.addLocations(req.body, req.user.userId)
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