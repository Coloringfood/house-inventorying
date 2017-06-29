/**
 * Source:  https://github.com/sequelize/sequelize/issues/3989
 */
'use strict';

var BaseTypes = require('sequelize/lib/data-types');
var util = require('util');

var TIMESTAMP = function () {
	/* istanbul ignore if*/
	if (!(this instanceof TIMESTAMP)) {
		return new TIMESTAMP();
	}

	BaseTypes.ABSTRACT.apply(this, arguments);
};

util.inherits(TIMESTAMP, BaseTypes.ABSTRACT);

TIMESTAMP.prototype.key = TIMESTAMP.key = 'TIMESTAMP';

exports.TIMESTAMP = TIMESTAMP;