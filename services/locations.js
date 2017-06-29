let Locations = module.exports = {};
let Promise = require('bluebird'),
	debug = require('debug')('house-inventorying:services:locations'),
	LocationsTable = require('./../models/locations'),
	RoomsTable = require('./../models/rooms');

const LOCATION_ATTRIBUTES = [
	"id",
	"name",
	"description",
	"picture_location"
];
const LOCATION_NOT_FOUND = "location_not_found";

Locations.convertLocationForUI = (location) => {
	let locationData = location.dataValues;
	if (locationData.room) {
		delete locationData.room;
	}
	return locationData;
};

Locations.locationBelongsToRoom = (location_id, room_id) => {
	debug("check user Access to location: " + location_id + " in room: " + room_id);
	return LocationsTable.find({
		where: {
			id: location_id
		},
		include: [{
			model: RoomsTable,
			where: {
				id: room_id
			}
		}]
	}).catch((error) => {
		return Promise.reject({
			error: error,
			message: "sequelize_error",
			location: "Locations.locationBelongsToRoom sequelize find",
			showMessage: error.showMessage || "Error trying to find location id: " + room_id,
			status: error.status || 500
		});
	}).then((result) => {
		return !!result;
	})
};

Locations.getAllLocations = (room_id) => {
	debug("getAllLocations for room: (" + room_id + ")");
	return LocationsTable.findAll(
		{
			attributes: LOCATION_ATTRIBUTES,
			order: [
				["name", "ASC"]
			]
		});
};

Locations.addLocations = (new_locations, room_id) => {
	debug("addLocations: %o", new_locations);
	return Promise.map(new_locations, (location) => {
		delete location.id;
		location.room_id = room_id;
		return LocationsTable.create(location)
			.then((create_result) => {
				return {
					id: create_result.id,
					name: create_result.name
				};
			});
	});
};

Locations.getLocation = (location_id) => {
	debug("getLocation");
	return LocationsTable.find(
		{
			where: {id: location_id},
			attributes: LOCATION_ATTRIBUTES,
			order: [
				["name", "ASC"]
			]
		}
	);
};

Locations.updateLocation = (id, location) => {
	debug("updateLocation");
	return LocationsTable.update(location, {
		where: {
			id: id
		}
	}).catch((error) => {
		return Promise.reject({
			error: error,
			message: "sequelize_error",
			location: "Locations.updateLocation sequelize update",
			showMessage: error.showMessage || "Error trying to update location: " + id,
			status: error.status || 500
		});
	}).then((updateResult) => {
		if (updateResult[0] === 0) {
			return Promise.reject({
				errors: LOCATION_NOT_FOUND,
				location: "Locations.updateLocation",
				showMessage: "Location ID: " + id + " not found",
				status: 404
			});
		}
		return location;
	});
};

Locations.deleteLocation = (id) => {
	debug("deleteLocation");
	return LocationsTable.destroy({
		where: {
			id: id
		}
	}).then((destroyResults) => {
		if (destroyResults === 0) {
			return Promise.reject({
				errors: LOCATION_NOT_FOUND,
				location: "Locations.deleteLocation",
				showMessage: "Location ID: " + id + " not found",
				status: 404
			});
		}
		return destroyResults;
	});
};