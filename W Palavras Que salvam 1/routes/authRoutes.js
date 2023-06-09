//IMPORTAÇÃO DE MODULO/BIBLIOTECA
const express = require("express");

//MODULOS DO SISTEMA
const AuthController = require("../controllers/AuthController");
const PainelUsuarioController = require("../controllers/PainelUsuarioController");

//MODULO HELPERS
const { authCheckUsuario } = require("../helpers/authCheckUsuario");

//CHAMANDO O ROUTER DO EXPRESS
const router = express.Router();

//ROTA PARA PAGINA DE LOGIN
router.get("/login", AuthController.login);

//FUNÇÃO DE LOGIN DE USUÁRIO
router.post("/login", AuthController.loginPost);

//LISTAR MENSAGEM DO USUÁRIO NO PAINEL DE USUÁRIO
router.get(
  "/painelDeUsuario",
  authCheckUsuario,
  PainelUsuarioController.resgataMensagem
);

//ROTA PARA POSTAR MENSAGEM
router.get("/mensagemPost", authCheckUsuario, PainelUsuarioController.mensagemPost);

//FUNÇÃO DE ENVIAR MENSAGEM
router.post("/mensagemPost", authCheckUsuario, PainelUsuarioController.mensagemCreate);

//FUNCÃO REMOVER MENSAGEM
router.post("/painelDeUsuario/remover", authCheckUsuario, PainelUsuarioController.removerMensagem);

//FUNCÃO EDITAR MENSAGEM
router.get("/mensagemEdit/:id", authCheckUsuario, PainelUsuarioController.mensagemEditar);
router.post("/mensagemEdit", authCheckUsuario, PainelUsuarioController.mensagemEditarUpdate);

//ROTA DE MENSAGEM DETALHES
router.get("/mensagemDetalhes/:id", authCheckUsuario, PainelUsuarioController.mensagemDetalhes);

//ROTA DE TODAS AS MENSAGENS DOS USUÁRIOS
router.get("/", AuthController.exibeMensagens);

//PAGINA DE TESTE
router.get("/teste/:id?", PainelUsuarioController.paginaTeste)

//ROTA DE DESLOGAR DO SISTEMA
router.get("/sair", AuthController.sair);

//ROTA DE PAGINA DE CADASTRO
router.get("/cadastro", AuthController.cadastrar);
router.post("/cadastro", AuthController.cadastrarCreate);


module.exports = router;
