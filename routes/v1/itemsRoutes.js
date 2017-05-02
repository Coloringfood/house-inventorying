let express = require('express'),
    router = express.Router(),
    debug = require('debug')('house-inventorying:routes:v1:items'),
    ItemsService = require('./../../services/items'),
    CategoryService = require('./../../services/categories');

router.use((req, res, next) => {
    req.validateItem = () => {
        debug('validateItem');
        validateItemData();
        if (typeof req.body.factors === 'object' && Array.isArray(req.body.factors)) {
            let features_length = req.body.factors.length;
            for (let i = 0; i < features_length; i++) {
                validateFactorData('factors[' + i + ']');
            }
        }

        return req.checkErrors();
    };

    function validateItemData() {
        req.assert('name', 'This field should be a string').isString();
        req.assert('name', 'This field should be 30 characters or less').len(0, 30);
        req.assert('personal', 'This optional field should be a Boolean').optional({checkFalsy: true}).isBoolean();
        req.assert('required', 'This optional field should be a Boolean').optional({checkFalsy: true}).isBoolean();
        req.assert('always_needed', 'This optional field should be a Boolean').optional({checkFalsy: true}).isBoolean();

        //TODO: Validate item is attached to room or location
    }

    function validateFactorData(base_location) {
        debug('validatingCategoryData for %o', base_location);
        req.assert(base_location, 'This field (factor) should be a string').isInt();
    }

    return next();
});
router.route('/')
    .get((req, res, next) => {
        debug('GET /item');
        ItemsService.getAllItems(req.user.userId)
            .then((results) => {
                res.json(results);
            })
            .catch((e) => {
                next(e);
            });
    })
    .post((req, res, next) => {
        debug("Post: %o", req.body);
        if (req.validateItem()) {
            let body = req.body;
            body.created_by_id = req.user.userId;
            return ItemsService.addItem(body)
                .then((result) => {
                    debug("post result: %o", result);
                    res.status(201).send();
                })
                .catch((e) => {
                    next(e);
                });
        }
    });

// router.route('/categories')
//     .get((req, res, next) => {
//         debug("get item categories");
//         CategoryService.getAllCategories()
//             .then((result) => {
//                 res.json(result);
//             })
//             .catch((e) => {
//                 next(e);
//             });
//     });
//
// router.route('/:itemId')
//     .get((req, res, next) => {
//         debug("get item id:%o", req.params.itemId);
//         ItemsService.getItem(req.params.itemId, req.user.userId)
//             .then((result) => {
//                 res.json(result);
//             })
//             .catch((e) => {
//                 next(e);
//             });
//     })
//     .put((req, res, next) => {
//         debug("Put on id:%o, object: %o", req.params.itemId, req.body);
//         if (req.validateItem()) {
//             let body = req.body;
//             ItemsService.updateItem(req.params.itemId, body, req.user.userId)
//                 .then((result) => {
//                     res.json(result);
//                 })
//                 .catch((e) => {
//                     next(e);
//                 });
//         }
//     })
//     .delete((req, res, next) => {
//         debug("Deleting item: %o", req.params.itemId);
//         ItemsService.deleteItem(req.params.itemId, req.user.userId)
//             .then((result) => {
//                 res.json(result);
//             })
//             .catch((e) => {
//                 next(e);
//             });
//     });

module.exports = router;