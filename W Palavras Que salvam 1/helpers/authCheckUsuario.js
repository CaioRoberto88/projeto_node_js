module.exports.authCheckUsuario = function (req, res, next) {
  const UsuarioId = req.session.UsuarioId;
  //VERIFICA SE USUÁRIO ESTÁ LOGADO
  if (!UsuarioId) {
    res.redirect("/login");
  }
  
  next();
};
