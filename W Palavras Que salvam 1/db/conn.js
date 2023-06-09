const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("palavrasquesalvam", "root", "", {
  dialect: "mysql",
  host: "localhost",
});

try {
  sequelize.authenticate();
  console.log("Conectado com sucesso ao banco de dados!");
} catch (error) {
  console.log("Houve um erro na conexão com o banco", error);
}

module.exports = sequelize;
