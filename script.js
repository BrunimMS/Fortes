const mysql = require("mysql");
const express = require("express");
const app = express();

var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "123456",
    database: "fortes"
})
con.connect((err) =>{
    if (err){
        console.log(err)
    } else {
        console.log("Database Connected!")
    }
})

app.set("view-engine", 'handlebars');

app.use(express.static('static'));

app.get("/", (req, res) => {
    var result = con.query("SELECT nome_colab FROM colaborador", (result, error) =>{
        if (error){
            console.log(error);
        } else {
            console.log(result);
        }
    })
    res.render("index.hbs", {resultado: result});
})
app.get("/novoPedido", (req, res) => {
    res.render("novoPedido.hbs");
})
app.get("/login", (req, res) => {
    res.render("login.hbs");
})
app.get("/registro", (req, res) => {
    res.render("cadastro.hbs");
})

app.listen(8080, () => {
    console.log("Server Started!");
});