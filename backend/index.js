const express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(cors());

const uri = "mongodb+srv://admin:Cachorro1337*mongodb@cluster0.0ejr2zv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let database;

app.listen(5050, async () => {
    try {
        await client.connect();
        database = client.db("ziemmotors");
        console.log("Database conectada");
    } catch (error) {
        console.log("Erro ao conectar ao banco de dados:", error);
    }
});

app.get('/api/ziemmotors/getallusers', async (request, response) => {
    try {
        const users = await database.collection("users").find({}).toArray();
        response.send(users);
    } catch (error) {
        console.log("Erro ao buscar usuários:", error);
        response.status(500).send("Erro ao buscar usuários.");
    }
});

app.post('/api/ziemmotors/adduser', multer().none(), async (request, response) => {
    console.log(request.body);
    try {
        const numbDocs = await database.collection("users").countDocuments();
        console.log(request.body);
        await database.collection("users").insertOne({
            id: (numbDocs + 1).toString(),
            name: request.body.name,
            email: request.body.email,
            password: request.body.password,
        });
        response.json("Adicionado com sucesso.");
    } catch (error) {
        console.log("Erro ao adicionar usuário:", error);
        response.status(500).send("Erro ao adicionar usuário.");
    }
});

app.post('/api/ziemmotors/deleteuser', async (request, response) => {
    try {
        await database.collection("users").deleteOne({
            id: request.query.id
        });
        response.json("Deletado com sucesso");
    } catch (error) {
        console.log("Erro ao deletar usuário:", error);
        response.status(500).send("Erro ao deletar usuário.");
    }
});

app.post('/api/ziemmotors/verifyemail', async (request, response) => {
    try {
        const { email } = request.body;

        const user = await database.collection("users").findOne({ email: email });

        if (user) {
            response.json({ valid: true });
        } else {
            response.json({ valid: false });
        }
    } catch (error) {
        console.log("Erro ao validar email:", error);
        response.status(500).send("Erro ao validar email.");
    }
});

