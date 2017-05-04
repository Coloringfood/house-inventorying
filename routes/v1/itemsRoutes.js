let express = require('express'),
    router = express.Router(),
    debug = require('debug')('house-inventorying:routes:v1:items'),
    ItemsService = require('./../../services/items'),
    CategoryService = require('./../../services/categories');

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
    //     .put((req, res, next) => {
    //         debug("Put on id:%o, object: %o", req.params.item_id, req.body);
    //         if (req.validateItem()) {
    //             let body = req.body;
    //             ItemsService.updateItem(req.params.item_id, body)
    //                 .then((result) => {
    //                     res.json(result);
    //                 })
    //                 .catch((e) => {
    //                     next(e);
    //                 });
    //         }
    //     })
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