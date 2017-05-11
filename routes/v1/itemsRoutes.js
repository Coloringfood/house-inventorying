let express = require('express'),
    router = express.Router(),
    debug = require('debug')('house-inventorying:routes:v1:items'),
    ItemsService = require('./../../services/items'),
    RoomsService = require('./../../services/rooms'),
    LocationsService = require('./../../services/locations'),
    CategoryService = require('./../../services/categories');
router.use((req, res, next) => {
        req.validateUpdateItem = () => {
            debug('validateUpdateItem');

            if (Array.isArray(req.body)) {
                if (typeof req.body === 'object' && Array.isArray(req.body)) {
                    let featuresLength = req.body.length;
                    for (let i = 0; i < featuresLength; i++) {
                        let path = '[' + i + '].';
                        req.validateItemData(path);
                        validateItemLocation(path)
                    }
                }
            }
            else {
                req.validateItemData('');
                validateItemLocation('');
            }

            return req.checkErrors();
        };

        function validateItemLocation(path) {
            req.assert(path + 'room_id', 'This field should be an Int').isInt();
            let body = req.body;
            if (path != '') {
                body = body[path];
            }
            if (body.location_id) {
                req.assert(path + 'location_id', 'This field should be an Int').isInt();
            }
        }

        return next();
    }
);

router.route('/')
    .get((req, res, next) => {
        debug('GET /item');
        ItemsService.getAllItems(req.house_id)
            .then((results) => {
                res.json(results);
            })
            .catch((e) => {
                next(e);
            });
    });

router.route('/categories')
    .get((req, res, next) => {
        debug("get item categories");
        CategoryService.getAllCategories()
            .then((result) => {
                res.json(result);
            })
            .catch((e) => {
                next(e);
            });
    });


router.use('/:item_id', (req, res, next) => {
    debug("Checking permissions to item");
    return ItemsService.itemIsInHouse(req.params.item_id, req.house_id).then(
        (belongs_to_house) => {
            let err = null;
            debug("item belongs to house: " + belongs_to_house);
            // Validate user has access to house
            if (!belongs_to_house) {
                err = {
                    status: 404,
                    showMessage: "Item Not Found",
                    errors: "Can't find item (" + req.params.item_id + ") in house (" + req.house_id + ")"
                };
            }

            next(err);
        })
        .catch((e) => {
            next(e);
        });
});

router.route('/:item_id')
    .get((req, res, next) => {
        debug("get item id:%o", req.params.item_id);
        ItemsService.getItem(req.params.item_id)
            .then((result) => {
                res.json(result);
            })
            .catch((e) => {
                next(e);
            });
    })
    .put((req, res, next) => {
        debug("Put on id:%o, object: %o", req.params.item_id, req.body);
        if (req.validateUpdateItem()) {
            let body = req.body;
            if (RoomsService.roomBelongsToHouse(body.room_id, req.house_id)) {
                if (body.location_id) {
                    if (!LocationsService.locationBelongsToRoom(body.location_id, body.room_id)) {
                        next({
                            status: 404,
                            showMessage: "Location Not Found",
                            errors: "Can't find location (" + body.location_id + ") in room (" + body.room_id + ")"
                        });
                        return;
                    }
                }
                ItemsService.updateItem(req.params.item_id, body)
                    .then((result) => {
                        res.json(result);
                    })
                    .catch((e) => {
                        next(e);
                    });
            }
            else {
                next({
                    status: 404,
                    showMessage: "Room Not Found",
                    errors: "Can't find room (" + body.room_id + ") in house (" + req.house_id + ")"
                });
            }
        }
    })
    .delete((req, res, next) => {
        debug("Deleting item: %o", req.params.item_id);
        ItemsService.deleteItem(req.params.item_id, req.user.userId)
            .then((result) => {
                res.json(result);
            })
            .catch((e) => {
                next(e);
            });
    });

module.exports = router;