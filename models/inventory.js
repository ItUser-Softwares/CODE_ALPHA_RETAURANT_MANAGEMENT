module.exports = (sequelize, DataTypes) => {
    const Inventory = sequelize.define('Inventory', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    });
  
    return Inventory;
  };
  