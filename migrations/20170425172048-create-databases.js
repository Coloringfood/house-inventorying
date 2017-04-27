module.exports = {
    up: function (queryInterface, Sequelize) {
        'use strict';
        return queryInterface.sequelize.query(
            `
            -- --------------------------------------------------------
            -- Host:                         localhost
            -- Server version:               5.7.15-log - MySQL Community Server (GPL)
            -- Server OS:                    Win64
            -- HeidiSQL Version:             9.4.0.5125
            -- --------------------------------------------------------
            
            /*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
            /*!40101 SET NAMES utf8 */;
            /*!50503 SET NAMES utf8mb4 */;
            /*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
            /*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
            
            -- Dumping structure for table house-inventorying.categories
            CREATE TABLE IF NOT EXISTS \`categories\` (
              \`id\` int(10) unsigned NOT NULL AUTO_INCREMENT,
              \`name\` varchar(255) NOT NULL COMMENT 'Category name to identify items by',
              \`description\` varchar(255) NOT NULL COMMENT 'Information to help users decide which category to put an item in',
              PRIMARY KEY (\`id\`),
              UNIQUE KEY \`name\` (\`name\`),
              UNIQUE KEY \`categories_name_unique\` (\`name\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
            
            -- Dumping data for table house-inventorying.categories: ~0 rows (approximately)
            /*!40000 ALTER TABLE \`categories\` DISABLE KEYS */;
            /*!40000 ALTER TABLE \`categories\` ENABLE KEYS */;
            
            -- Dumping structure for table house-inventorying.houses
            CREATE TABLE IF NOT EXISTS \`houses\` (
              \`id\` int(10) unsigned NOT NULL AUTO_INCREMENT,
              \`name\` varchar(30) NOT NULL COMMENT 'How the user wishes to identify the house',
              \`description\` varchar(300) DEFAULT NULL COMMENT 'Information that will help the user',
              \`created_at\` datetime NOT NULL,
              \`updated_at\` datetime NOT NULL,
              \`deleted_at\` datetime DEFAULT NULL,
              PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
            
            -- Dumping data for table house-inventorying.houses: ~0 rows (approximately)
            /*!40000 ALTER TABLE \`houses\` DISABLE KEYS */;
            /*!40000 ALTER TABLE \`houses\` ENABLE KEYS */;
            
            -- Dumping structure for table house-inventorying.items
            CREATE TABLE IF NOT EXISTS \`items\` (
              \`id\` int(10) unsigned NOT NULL AUTO_INCREMENT,
              \`name\` varchar(30) NOT NULL COMMENT 'Name of Item',
              \`description\` varchar(300) DEFAULT NULL COMMENT 'Any information the user wishes to store about the item',
              \`picture_location\` varchar(100) DEFAULT NULL COMMENT 'Url to the image on the server',
              \`price\` int(10) unsigned DEFAULT NULL COMMENT 'For insurance reasons, an estimate price of the item',
              \`category_id\` int(10) unsigned DEFAULT '4',
              \`location_id\` int(10) unsigned DEFAULT '4',
              \`created_by_id\` int(10) unsigned DEFAULT NULL,
              \`created_at\` datetime NOT NULL,
              \`updated_at\` datetime NOT NULL,
              \`deleted_at\` datetime DEFAULT NULL,
              PRIMARY KEY (\`id\`),
              KEY \`location_id\` (\`location_id\`),
              CONSTRAINT \`items_ibfk_1\` FOREIGN KEY (\`location_id\`) REFERENCES \`locations\` (\`id\`) ON DELETE NO ACTION ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
            
            -- Dumping data for table house-inventorying.items: ~0 rows (approximately)
            /*!40000 ALTER TABLE \`items\` DISABLE KEYS */;
            /*!40000 ALTER TABLE \`items\` ENABLE KEYS */;
            
            -- Dumping structure for table house-inventorying.items_categories
            CREATE TABLE IF NOT EXISTS \`items_categories\` (
              \`created_at\` datetime NOT NULL,
              \`updated_at\` datetime NOT NULL,
              \`item_id\` int(10) unsigned NOT NULL,
              \`category_id\` int(10) unsigned NOT NULL,
              PRIMARY KEY (\`item_id\`,\`category_id\`),
              KEY \`category_id\` (\`category_id\`),
              CONSTRAINT \`items_categories_ibfk_1\` FOREIGN KEY (\`item_id\`) REFERENCES \`items\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
              CONSTRAINT \`items_categories_ibfk_2\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
            
            -- Dumping data for table house-inventorying.items_categories: ~0 rows (approximately)
            /*!40000 ALTER TABLE \`items_categories\` DISABLE KEYS */;
            /*!40000 ALTER TABLE \`items_categories\` ENABLE KEYS */;
            
            -- Dumping structure for table house-inventorying.locations
            CREATE TABLE IF NOT EXISTS \`locations\` (
              \`id\` int(10) unsigned NOT NULL AUTO_INCREMENT,
              \`name\` varchar(30) NOT NULL COMMENT 'Name of the location, limited size, not unique',
              \`description\` varchar(300) DEFAULT NULL COMMENT 'Description to help the user remember where this location is in their house',
              \`picture_location\` varchar(100) DEFAULT NULL COMMENT 'Url to the uploaded image',
              \`room_id\` int(10) unsigned DEFAULT '0',
              \`created_at\` datetime NOT NULL,
              \`updated_at\` datetime NOT NULL,
              \`deleted_at\` datetime DEFAULT NULL,
              PRIMARY KEY (\`id\`),
              KEY \`room_id\` (\`room_id\`),
              CONSTRAINT \`locations_ibfk_1\` FOREIGN KEY (\`room_id\`) REFERENCES \`rooms\` (\`id\`) ON DELETE NO ACTION ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
            
            -- Dumping data for table house-inventorying.locations: ~0 rows (approximately)
            /*!40000 ALTER TABLE \`locations\` DISABLE KEYS */;
            /*!40000 ALTER TABLE \`locations\` ENABLE KEYS */;
            
            -- Dumping structure for table house-inventorying.rooms
            CREATE TABLE IF NOT EXISTS \`rooms\` (
              \`id\` int(10) unsigned NOT NULL AUTO_INCREMENT,
              \`name\` varchar(30) NOT NULL COMMENT 'Name of the room',
              \`description\` varchar(300) DEFAULT NULL COMMENT 'Allows User to store information about the room',
              \`house_id\` int(10) unsigned DEFAULT '0',
              \`created_at\` datetime NOT NULL,
              \`updated_at\` datetime NOT NULL,
              \`deleted_at\` datetime DEFAULT NULL,
              PRIMARY KEY (\`id\`),
              KEY \`house_id\` (\`house_id\`),
              CONSTRAINT \`rooms_ibfk_1\` FOREIGN KEY (\`house_id\`) REFERENCES \`houses\` (\`id\`) ON DELETE NO ACTION ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
            
            -- Dumping data for table house-inventorying.rooms: ~0 rows (approximately)
            /*!40000 ALTER TABLE \`rooms\` DISABLE KEYS */;
            /*!40000 ALTER TABLE \`rooms\` ENABLE KEYS */;
            
            -- Dumping structure for table house-inventorying.sequelizemeta
            CREATE TABLE IF NOT EXISTS \`sequelizemeta\` (
              \`name\` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
              PRIMARY KEY (\`name\`),
              UNIQUE KEY \`name\` (\`name\`),
              UNIQUE KEY \`SequelizeMeta_name_unique\` (\`name\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
            
            -- Dumping data for table house-inventorying.sequelizemeta: ~0 rows (approximately)
            /*!40000 ALTER TABLE \`sequelizemeta\` DISABLE KEYS */;
            /*!40000 ALTER TABLE \`sequelizemeta\` ENABLE KEYS */;
            
            -- Dumping structure for table house-inventorying.users
            CREATE TABLE IF NOT EXISTS \`users\` (
              \`id\` int(10) unsigned NOT NULL AUTO_INCREMENT,
              \`name\` varchar(30) NOT NULL COMMENT 'Username',
              \`email\` varchar(100) DEFAULT NULL,
              \`username\` varchar(30) DEFAULT NULL,
              \`password\` varchar(255) DEFAULT NULL,
              \`settings\` varchar(255) DEFAULT NULL,
              \`created_at\` datetime NOT NULL,
              \`updated_at\` datetime NOT NULL,
              \`deleted_at\` datetime DEFAULT NULL,
              PRIMARY KEY (\`id\`),
              UNIQUE KEY \`username\` (\`username\`),
              UNIQUE KEY \`users_username_unique\` (\`username\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
            
            -- Dumping data for table house-inventorying.users: ~0 rows (approximately)
            /*!40000 ALTER TABLE \`users\` DISABLE KEYS */;
            /*!40000 ALTER TABLE \`users\` ENABLE KEYS */;
            
            -- Dumping structure for table house-inventorying.users_per_house
            CREATE TABLE IF NOT EXISTS \`users_per_house\` (
              \`created_at\` datetime NOT NULL,
              \`updated_at\` datetime NOT NULL,
              \`house_id\` int(10) unsigned NOT NULL,
              \`user_id\` int(10) unsigned NOT NULL,
              PRIMARY KEY (\`house_id\`,\`user_id\`),
              KEY \`user_id\` (\`user_id\`),
              CONSTRAINT \`users_per_house_ibfk_1\` FOREIGN KEY (\`house_id\`) REFERENCES \`houses\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
              CONSTRAINT \`users_per_house_ibfk_2\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
            
            -- Dumping data for table house-inventorying.users_per_house: ~0 rows (approximately)
            /*!40000 ALTER TABLE \`users_per_house\` DISABLE KEYS */;
            /*!40000 ALTER TABLE \`users_per_house\` ENABLE KEYS */;
            
            /*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
            /*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
            /*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
            `);
    },

    down: function (queryInterface, Sequelize) {
        'use strict';
        return queryInterface.dropAllTables();
    }
};
