const { Sequelize, DataTypes } = require('sequelize');


// SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
  retry: {
    max: 5, // Max retries before failing
    match: [
      /SQLITE_BUSY/ // Retry when SQLITE_BUSY occurs
    ],
    backoffBase: 100, // Initial backoff time in ms
    backoffExponent: 1.5 // Exponential backoff factor
  }
});


// Import models
const Reservation = require('./reservation')(sequelize, DataTypes);
const MenuItem = require('./menu_item')(sequelize, DataTypes);
const Order = require('./order')(sequelize, DataTypes);
const Inventory = require('./inventory')(sequelize, DataTypes);


// Export models and sequelize
module.exports = {
  sequelize,
  Reservation,
  MenuItem,
  Order,
  Inventory,
};
