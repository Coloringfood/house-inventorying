let express = require('express'),
    expressValidator = require('express-validator'),
    router = express.Router(),
    debug = require('debug')('house-inventorying:routes:v1'),
    HomesRoutes = require('./v1/housesRoutes'),
    // CategoriesRoutes = require('./v1/categoriesRoutes'),
    AuthenticationRoutes = require('./v1/authenticationRoutes'),
    PictureRoutes = require('./v1/picturesRoutes'),
    config = require('./../config/config.json'),
    expressJWT = require('express-jwt');

let secretCallback = function (req, payload, done) {
    // This will change to an Consul call or storage check.
    let issuer = payload.iss;
    switch (issuer) {
        case config.security.issuer:
            done(null, config.security.secret);
            break;
        default:
            done(new Error('missing_secret'));
    }
};

router.use(expressJWT({
    secret: secretCallback,
    getToken: function fromHeaderOrQuerystring(req) {
        debug("Getting Token, AUTH REQUIRED");
        if (req.headers.Authorization && req.headers.Authorization.split(' ')[0] === 'Bearer') {
            req.userToken = req.headers.Authorization.split(' ')[1];
        }
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            req.userToken = req.headers.authorization.split(' ')[1];
        }
        return req.userToken;
    }
}).unless({
    path: [
        /^\/v1\/authentication$/,               // Allow Login Requests
        /^\/v1\/authentication\/create$/,       // Allow RegisterRequests
    ]
}));
router.use(function (err, req, res, next) {
    debug("Authorization failed %o", err);
    err.status = 401;
    if (err.name == 'UnauthorizedError') {
        err.showMessage = err.name;
    } else {
        err.showMessage = "Token Error: " + err.message;
    }
    next(err);
});
router.use(expressValidator({
    customValidators: {
        isString: function (param) {
            let isValid = true;
            try {
                if (typeof param !== 'string') {
                    isValid = false;
                }
            } catch (err) {
                isValid = false;
            }
            return isValid;
        },
        isInList: function (param, list) {
            /* check if param is in the list of valid options passed to function, returns boolean */
            try {
                let isValid = false;
                let i = 0;
                let listLength = list.length;
                while (i < listLength && isValid === false) {
                    isValid = (list[i] === param);
                    ++i;
                }
                return isValid;
            } catch (err) {
                return false;
            }
        },
        isObject: function (param) {
            let isValid = true;
            try {
                if (typeof param !== 'object') {
                    let jsonVersion = JSON.parse(param);
                    if (jsonVersion !== 'object') {
                        isValid = false;
                    }
                }
            } catch (err) {
                isValid = false;
            }
            return isValid;
        },
        isArray: function (param) {
            let isValid;
            try {
                isValid = Array.isArray(param);
            } catch (err) {
                isValid = false;
            }
            return isValid;
        },
        isArrayInts: function (param) {
            let isValid;
            try {
                isValid = Array.isArray(param);
                let listLength = param.length,
                    i = 0;
                while (i < listLength && isValid === true) {
                    isValid = typeof param[i] == "number";
                    i++;
                }
            } catch (err) {
                isValid = false;
            }
            return isValid;
        }
    }
}));
router.use((req, res, next) => {
    debug(req.user);
    debug(req.originalUrl);

    req.checkErrors = () => {
        debug('checkErrors');
        let valid = true;
        let errors = req.validationErrors();
        if (errors) {
            valid = false;
            debug("Validation Errors: %o", errors);
            res.status(400)
                .send({
                    message: 'Validation errors',
                    errors: errors,
                    status: 400
                });
        }
        return valid;
    };

    return next();
});

router.use('/homes', HomesRoutes);

// router.use('/categories', CategoriesRoutes);

router.use('/authentication', AuthenticationRoutes);

router.use('/uploads', PictureRoutes);

router.get('*', (req, res) => {
    res.status(400).send("Not Valid URI");
});

module.exports = router;