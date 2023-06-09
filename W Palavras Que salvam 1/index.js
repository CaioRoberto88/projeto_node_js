//IMPORTAR BIBILIOTÉCAS
const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const flash = require("express-flash");

//INVOCA O EXPRESS
const app = express();

//CONECTANDO O BANCO
const conn = require("./db/conn");

//MODELS

//CONTROLLERS
const AuthController = require("./controllers/AuthController");

//ROUTES
const authRoutes = require("./routes/authRoutes");

//TEMPLATE ENGINE
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

//RECEBER OS DADOS VIA BODY
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

//ARQUIVOS ESTATICOS
//app.use(express.static("public"));

//MODO ALTERNATIVO DE PASSAR O CAMINHO DA PASTA PUBLIC DE FORMA ABSOLUTA
app.use(express.static(require("path").join(__dirname, "public")));

//SESSIONS
const FileStore = require("session-file-store")(session);

app.use(
  session({
    name: "session",
    secret: "nosso_secret",
    resave: true,
    saveUninitialized: true,
    store: new FileStore({
      logFn: function () {},
      path: require("path").join(require("os").tmpdir(), "sessions"),
    }),
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000),
    },
  })
);

//CONFIGURA SESSION
app.use((req, res, next) => {
  if (req.session.UsuarioId) {
    res.locals.session = req.session;
  }
  next();
});

//MESSAGES
app.use(flash());

//ROTAS
app.use("/", authRoutes);

//ROTA RAIZ DO PROJETO
app.get("/", AuthController.exibeMensagens);

//SINCRONISMO COM O BANCO
conn
  //.sync({ force: true })
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
