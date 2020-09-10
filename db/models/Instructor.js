module.exports = (sequelize, DataTypes) => {
  const Instructor = sequelize.define('Instructor', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING,
    },
    about: {
      type: DataTypes.STRING,
    },
    linkedIn: {
      type: DataTypes.STRING,
    },
    facebook: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ['name'],
      }
    ],
  });

  Instructor.associate = function(models) {
    // associations can be defined here
  };

  return Instructor;
};
