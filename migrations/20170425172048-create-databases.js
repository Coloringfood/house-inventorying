module.exports = {
    up: function (queryInterface, Sequelize) {
        'use strict';
        return queryInterface.sequelize.query(
            `
            
            `);
    },

    down: function (queryInterface, Sequelize) {
        'use strict';
        return queryInterface.dropAllTables();
    }
};
