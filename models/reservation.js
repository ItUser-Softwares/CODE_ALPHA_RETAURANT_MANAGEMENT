module.exports = (sequelize, DataTypes) => {
    const Reservation = sequelize.define('Reservation', {
      customerName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contactNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      numberOfGuests: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      reservationDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      tableNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isReserved: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      }
    });
  
    return Reservation;
  };
  