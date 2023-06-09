const { DataTypes } = require("sequelize");

const db = require("../db/conn");

const Usuario = db.define("Usuario", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  usuario: {
    type: DataTypes.STRING,
    allowNull: false,
    required: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    required: true,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
    required: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    required: true,
  },
});

module.exports = Usuario;
