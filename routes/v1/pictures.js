let express = require('express'),
    router = express.Router(),
    debug = require('debug')('house-inventorying:routes:v1:locations'),
    pictureService = require('./../../services/pictures');

/**
 * THIS IS JUST THEORY CODE.... TO BE TESTED AND ACTUALLY MADE
 */
// Filter access to images
app.use('/uploads/:roomId', authImage, express.static('uploads'));
function authImage(req, res, next) {
    if (pictureService.userHasAccess(req.params.roomId, req.user.userId))
        next();
    else
        res.status(403).send('Forbidden');
}

router.route('/uploads/:roomId')
    .post((req, res, next) => {
        // Upload Image
        res.send("Soon to be uploaded...")
    });

app.use('/uploads/:roomId/get/', express.static(path.join(__dirname, 'uploaded')));

module.exports = router;