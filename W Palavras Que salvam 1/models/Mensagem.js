const { DataTypes } = require("sequelize");

const Usuario = require("../models/Usuario");

const db = require("../db/conn");

const Mensagem = db.define("Mensagem", {
  titulo: {
    type: DataTypes.STRING,
    required: true,
  },
  mensagem: {
    type: DataTypes.STRING,
    required: true,
  },
});

Mensagem.belongsTo(Usuario);
Usuario.hasMany(Mensagem);

module.exports = Mensagem;
