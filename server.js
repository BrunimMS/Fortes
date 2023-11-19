const mysql = require("mysql");
const express = require("express");
const session = require("express-session");
const app = express();
const env = require("dotenv/config");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

app.set("view-engine", 'handlebars');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('static'));

var con = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})
con.connect((err) =>{
    if (err){
        console.log(err)
    } else {
        console.log("Database Connected!")
    }
})

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: true
}));

app.get("/", (req, res) => {
    let date = new Date()
    date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    if (req.session.idses){
        con.query("SELECT fk_id_colab, id_pedido, fk_id_obra, data_refeicao, data_requisicao, refeicao, colaborador.nome_colab, obra.endereco FROM ((pedido INNER JOIN colaborador ON pedido.fk_id_colab=colaborador.id_colab) INNER JOIN obra ON pedido.fk_id_obra=obra.id_obra) WHERE fk_id_colab=? AND data_refeicao BETWEEN ? AND ? ORDER BY data_refeicao", [req.session.idses, date + "T00:00:00.000", date + "T23:59:59.999"], (error, result) =>{
            for (let i = 0; i < result.length; i++){
                result[i].data_refeicao = result[i].data_refeicao.getDate() + "/" + (result[i].data_refeicao.getMonth() + 1) + "/" + result[i].data_refeicao.getFullYear();
                result[i].data_requisicao = result[i].data_requisicao.getDate() + "/" + (result[i].data_requisicao.getMonth() + 1) + "/" + result[i].data_requisicao.getFullYear();
            }
            log(result);
        })
        function log(resu){
            if (req.query.new){
                res.render("index.hbs", {result: resu, new: true});
            } else {
                res.render("index.hbs", {result: resu});
            }
        }
    } else {
        res.redirect("/login");
    }
})
app.get("/todos", (req, res) => {
    let date = new Date()
    date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    if (req.session.idses){
        console.log(req.session.idses)
        con.query("SELECT fk_id_colab, id_pedido, fk_id_obra, data_refeicao, data_requisicao, refeicao, colaborador.nome_colab, obra.endereco FROM ((pedido INNER JOIN colaborador ON pedido.fk_id_colab=colaborador.id_colab) INNER JOIN obra ON pedido.fk_id_obra=obra.id_obra) WHERE fk_id_colab=? AND data_refeicao >= ? ORDER BY data_refeicao", [req.session.idses, date], (error, result) =>{
            console.log(result);
            for (let i = 0; i < result.length; i++){
                result[i].data_refeicao = result[i].data_refeicao.getDate() + "/" + (result[i].data_refeicao.getMonth() + 1) + "/" + result[i].data_refeicao.getFullYear();
                result[i].data_requisicao = result[i].data_requisicao.getDate() + "/" + (result[i].data_requisicao.getMonth() + 1) + "/" + result[i].data_requisicao.getFullYear();
            }
            log(result);
        })
        function log(resu){
            if (req.query.new){
                res.render("todos.hbs", {result: resu, new: true});
            } else {
                res.render("todos.hbs", {result: resu});
            }
        }
    } else {
        res.redirect("/login");
    }
})
app.get("/novoPedido", (req, res) => {
    if (req.session.idses){
        con.query("SELECT * FROM obra", (error, result) =>{
            if (error){
                console.log(error);
                res.redirect('/')
            }
            else {
                let date = new Date();
                date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                res.render("novoPedido.hbs", {obra: result, date: date});
            }
        })
    } else {
        res.redirect("/login");
    }
})
app.post("/new", (req, res) =>{
    let date = new Date()
    date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    if (req.body.cafe){
        con.query("INSERT INTO pedido(fk_id_colab, fk_id_obra, data_refeicao, data_requisicao, refeicao) VALUES (?, ?, ?, ?, 'Café da manhã')", [req.session.idses, req.body.obra, (req.body.date + " 6:00:00"), date])
    }
    if (req.body.almoco){
        con.query("INSERT INTO pedido(fk_id_colab, fk_id_obra, data_refeicao, data_requisicao, refeicao) VALUES (?, ?, ?, ?, 'Almoço')", [req.session.idses, req.body.obra, (req.body.date + " 12:00:00"), date])
    }
    if (req.body.jantar){
        con.query("INSERT INTO pedido(fk_id_colab, fk_id_obra, data_refeicao, data_requisicao, refeicao) VALUES (?, ?, ?, ?, 'Jantar')", [req.session.idses, req.body.obra, (req.body.date + " 19:00:00"), date])
    }
    res.redirect("/?new=true")
})
app.get("/login", (req, res) => {
    if(req.session.idses){
        res.redirect('/');
    } else {
        if(req.query.erro){
            res.render("login.hbs", {erro: true});
        } else if(req.query.erro1){
            res.render("cadastro.hbs", {erro1: true});
        } else {
            res.render("login.hbs");
        }
    }
})
app.post("/authLogin", (req, res) =>{
    let id = req.body.id;
    let senha = req.body.senha;
    
    con.query("SELECT id_colab, senha FROM colaborador WHERE id_colab=?", [id], (error, result) => {
        if (error){
            console.log(error);
            res.redirect("/login?erro=true");
        } else if (result.length == 0){
            res.redirect("/login?erro=true");
        } else {
            if (bcrypt.compareSync(senha, result[0].senha, 8)){
                req.session.idses = id;
                res.redirect('/');
            } else {
                res.redirect("/login?erro=true");
            }
        }
    })
})

app.get("/registro", (req, res) => {
    if(req.query.erro){
        res.render("cadastro.hbs", {erro: true});
    } else if(req.query.erro1){
        res.render("cadastro.hbs", {erro1: true});
    } else {
        res.render("cadastro.hbs");
    }
})

app.post("/authReg", (req, res) =>{
    let id = req.body.id;
    let name = req.body.nome;
    let email = req.body.email;
    let password = req.body.senha;

    if(id && name && email && password){
        con.query("SELECT id_colab FROM colaborador WHERE id_colab = ?", [id], (error, result) => {
            if (result.length == 0){
                con.query("INSERT INTO colaborador VALUES (?, ?, ?, ?)", [id, name, email, bcrypt.hashSync(password.toString(), 8)], (error, result) =>{
                    if (error){
                        console.log(error);
                        res.redirect("/registro?erro=true")
                    } else {
                        req.session.idses = id;
                        res.redirect("/")
                    }
                })
            } else {
                res.redirect("/registro?erro=true")
            }
        })
    } else {
        res.redirect("/registro?erro1=true")
    }
})

app.get("/logout", (req, res) =>{
    req.session.idses = null;
    res.redirect("/login");
})

app.listen(8080, () => {
    console.log("Server Started!");
});