//MODULOS DO SISTEMA
const Usuario = require("../models/Usuario");
const Mensagem = require("../models/Mensagem");

//OPERADOR LIKE
const { Op } = require("sequelize");

//CRIPTOGRAFAR A SENHA DO USUÁRIO
const bcrypt = require("bcrypt");

module.exports = class AuthController {
  //ENVIAR PARA PÁGINA DE LOGIN
  static login(req, res) {
    res.render("auth/login");
  }

  //LOGAR USUARIO
  static async loginPost(req, res) {
    const { email, senha } = req.body;

    //VALIDAR EMAIL DE USUARIO
    const compararEmail = await Usuario.findOne({ where: { email: email } });

    if (!compararEmail) {
      req.flash("message", "E-mail de usuário não encontrado!");
      res.render("auth/login");
      return;
    }

    //VALIDAR SENHA DE USUÁRIO
    const comparaSenha = bcrypt.compareSync(senha, compararEmail.senha);

    if (!comparaSenha) {
      req.flash("message", "Senha inválida!");
      res.render("auth/login");
      return;
    }

    //INICIAR SESSION
    req.session.UsuarioId = compararEmail.id;

    req.flash("message", "Usuário autenticado com sucesso.");

    //MANTER SESSION
    req.session.save(() => {
      res.redirect("/painelDeUsuario");
    });
  }

  //ENVIAR PARA PÁGINA DE CADASTRO
  static cadastrar(req, res) {
    res.render("auth/cadastro");
  }

  //CADASTRAR USUÁRIO
  static async cadastrarCreate(req, res) {
    const { usuario, senha, confSenha, email, confEmail } = req.body;

    //VALIDA CONFIRMAÇÃO DE SENHA
    if (senha != confSenha) {
      req.flash("message", "As senhas não coincidem, tente novamente.");
      res.render("auth/cadastro");

      return;
    }

    //VALIDA CONFIRMAÇÃO DE EMAIL
    if (email != confEmail) {
      req.flash("message", "Os emails não coincidem, tente novamente.");
      res.render("auth/cadastro");

      return;
    }

    //SE O NOME DE USUARIO JÁ EXISTE
    const nomeUsuarioEmUso = await Usuario.findOne({
      where: { usuario: usuario },
    });

    if (nomeUsuarioEmUso) {
      req.flash(
        "message",
        "O Nome de usuário já existe no sistema, tente outro."
      );
      res.render("auth/cadastro");

      return;
    }

    //SE EMAIL JÁ FOI CADASTRADO

    const emailEmUso = await Usuario.findOne({ where: { email: email } });

    if (emailEmUso) {
      req.flash("message", "E-mail já cadastrado!");
      res.render("auth/cadastro");

      return;
    }

    //BCRYPT FUNÇÃO DE CRIAÇÃO DE SENHA
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(senha, salt);

    const perfil = {
      usuario: req.body.usuario,
      nome: req.body.nome,
      senha: hashedPassword,
      email: req.body.email,
    };

    try {
      const createUsuario = await Usuario.create(perfil);

      //INICIAR SESSION
      req.session.UsuarioId = createUsuario.id;

      req.flash("message", "Usuário cadastrado com sucesso!");

      //MANTER SESSION
      req.session.save(() => {
        res.redirect("/painelDeUsuario");
      });
    } catch (error) {
      console.log("Ocorreu um erro ao cadastrar usuário", error);
    }
  }

  //DESLOGAR DO SISTEMA
  static sair(req, res) {
    req.session.destroy();
    res.redirect("/login");
  }

  //ROTA DE MENSAGENS DE USUARIOS
  static async exibeMensagens(req, res) {


    //RESGATAR DADOS VIA QUERY
    let buscar = "";

    if (req.query.buscar) {
      buscar = req.query.buscar;
    }

    //FILTRAR DE MENSAGENS PELA ORDEM DESC PARA ASC
    let order = "DESC";

    if (req.query.order === "maisAntigo") {
      order = "ASC";
    } else {
      order = "DESC";
    }

    const todasmensagens = await Mensagem.findAll({
      include: Usuario,
      where: {
        titulo: { [Op.like]: `%${buscar}%` },
      },
      order: [["createdAt", order]],
    });

    const mensagems = todasmensagens.map((resultado) =>
      resultado.get({ plain: true })
    );

    //console.log(mensagems);

    //MOSTRAR NA TELA QUANTAS BUSCAS FORAM ACHADAS
    let mensagensQtd = mensagems.length;

    if (mensagensQtd === 0) {
      mensagensQtd = false;
    }

    res.render("todasmensagens", { mensagems, buscar, mensagensQtd });
  }
};
