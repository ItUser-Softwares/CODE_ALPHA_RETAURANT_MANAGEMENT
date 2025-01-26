const shortid = require("shortid");

// order.js
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    shortId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    itemsQuantity: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  return Order;
};
