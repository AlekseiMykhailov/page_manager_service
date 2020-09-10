module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('Instructor', {
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
  }).then(() => queryInterface.addIndex(
    'Instructor',
    ['name'],
  )),
  down: (queryInterface, DataTypes) => queryInterface.dropTable('Instructor')
};
