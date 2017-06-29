let express = require('express'),
	router = express.Router(),
	path = require('path'),
	debug = require('debug')('house-inventorying:routes:default');

/* GET home page. */
router.get('/', (req, res) => {
	res.sendFile('index.html', {root: './public'});
});
router.get('/health', (req, res) => {
	res.send("Alive");
});
router.get('*', (req, res) => {
	debug("req.originalUrl: ", req.originalUrl);
	res.status(404).send("404, page not found");
});

module.exports = router;
