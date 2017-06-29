let Factors = module.exports = {};
let debug = require('debug')('house-inventorying:services:categories'),
	categoriesTable = require('./../models/categories');

Factors.getAllCategories = () => {
	debug("getAllCategories");
	return categoriesTable.findAll()
		.then(function (all_items_result) {
			return all_items_result;
		});
};