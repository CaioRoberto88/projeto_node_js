const Usuario = require("../models/Usuario");
const Mensagem = require("../models/Mensagem");

module.exports = class PainelUsuarioController {
  //ROTA DE POSTAR MENSAGEM
  static mensagemPost(req, res) {
    res.render("auth/mensagemPost");
  }

  //POSTAR MENSAGEM
  static async mensagemCreate(req, res) {
    const mensagem = {
      UsuarioId: req.session.UsuarioId,
      titulo: req.body.titulo,
      mensagem: req.body.mensagem,
    };

    try {
      await Mensagem.create(mensagem);

      req.flash("message", "Enviado com sucesso.");

      req.session.save(() => {
        res.redirect("/painelDeUsuario");
      });
    } catch (error) {
      console.log("Ocorreu um erro", error);
    }
  }

  //RESGATAR MENSAGEM DO USUÁRIO
  static async resgataMensagem(req, res) {
    const UsuarioId = req.session.UsuarioId;

    const usuario = await Usuario.findOne({
      where: { id: UsuarioId },
      include: Mensagem,
      plain: true,
    });

    //CHECAR SE O USUÁRIO EXISTE
    if (!UsuarioId) {
      res.redirect("/login");
    }

    const mensagems = usuario.Mensagems.map(
      (resultado) => resultado.dataValues
    );

    //CHECAR SE USUÁRIO ESTÁ SEM MENSAGEM
    let semMensagem = false;

    if (mensagems.length === 0) {
      semMensagem = true;
    }

    //console.log(mensagems);

    res.render("auth/painelDeUsuario", { mensagems, semMensagem });
  }

  //REMOVER MENSAGEM DO USUÁRIO
  static async removerMensagem(req, res) {
    const UsuarioId = req.session.UsuarioId;
    const id = req.body.id;

    //CHECAR O USUÁRIO
    if (!UsuarioId) {
      res.redirect("/login");
    }

    try {
      await Mensagem.destroy({ where: { id: id, UsuarioId: UsuarioId } });

      req.flash("message", "Mensagem removida com sucesso.");

      req.session.save(() => {
        res.redirect("/painelDeUsuario");
      });
    } catch (error) {
      console.log("Ocorreu um erro ao tentar excluir a mensagem.", error);
    }
  }

  //PEGAR DADOS DO BANCO PARA ATUALIZAR
  static async mensagemEditar(req, res) {
    const id = req.params.id;

    const mensagem = await Mensagem.findOne({ where: { id: id }, raw: true });

    res.render("auth/mensagemEdit", { mensagem });
  }

  //ATUALIZAR DADOS DO USUÁRIO
  static async mensagemEditarUpdate(req, res) {
    const id = req.body.id;

    const mensagem = {
      titulo: req.body.titulo,
      mensagem: req.body.mensagem,
    };

    try {
      await Mensagem.update(mensagem, { where: { id: id } });

      req.flash("message", "Editado com sucesso!");

      req.session.save(() => {
        res.redirect("/painelDeUsuario");
      });
    } catch (error) {
      console.log("Houve um erro na tentativa de editar.", error);
    }
  }

  //ROTA DE DETALHES DO USUÁRIO
  static async mensagemDetalhes(req, res) {
    const id = req.params.id;
    const UsuarioId = req.session.UsuarioId;

    if (!UsuarioId) {
      res.redirect("/login");
    }

    const mensagem = await Mensagem.findOne({ where: { id: id } });

    const novaMensagem = mensagem?.dataValues;

    res.render("auth/mensagemDetalhes", { novaMensagem });
  }

  //PAGINA DE TESTE
  static paginaTeste(req, res) {
    res.render("auth/teste");
  }
  static async paginaTeste2(req, res) {
    const id = req.params.id;
    const mensagem = await Mensagem.findOne({
      where: { id: id },
    });
    res.render("auth/teste", mensagem);
  }
};
