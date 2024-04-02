const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const UserModel = require("./models/user-model");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const uri =
  "mongodb+srv://admin:Cachorro1337*mongodb@cluster0.0ejr2zv.mongodb.net/ziemmotors?retryWrites=true&w=majority&appName=Cluster0";
const secretKey = "STRINGMTFODA";

mongoose
  .connect(uri)
  .then(() => {
    console.log("Database conectada");
  })
  .catch(() => {
    console.log("Erro ao conectar na database");
  });

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});

app.post('/api/ziemmotors/signin', async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const userModel = new UserModel({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        image: '',
        endereco: '',
        telefone: ''
      });
  
      const result = await userModel.save();
      res.status(201).json({
        message: 'User created',
        result: result
      });
    } catch (error) {
      res.status(500).json({
        error: error
      });
    }
  });
  
  app.post('/api/ziemmotors/login', async (req, res) => {
    try {
      const user = await UserModel.findOne({ email: req.body.email });
  
      if (!user) {
        return res.status(401).json({
          message: 'User/Email not found'
        });
      }
  
      const passwordMatch = await bcrypt.compare(req.body.password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({
          message: 'Incorrect password'
        });
      }
  
      const token = jwt.sign({ userName: user.name, userEmail: user.email, userId: user._id }, secretKey, { expiresIn: "1h" });
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        message: 'Login sucessful'
      });
    } 
    catch (error) {
      res.status(401).json({
        message: 'Error with authentication'
      });
    }
  });

app.get("/api/ziemmotors/getUser", async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      message: "Token not provided",
    });
  }

  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Invalid jwt",
      });
    }

    const userId = decoded.userId;
    try {
      const user = await UserModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      return res.status(200).json({
        userInfos: {
          name: user.name,
          email: user.email,
          image: user.image,
          endereco: user.endereco,
          telefone: user.telefone,
        },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro ao buscar usuário.", error });
    }
  });
});

app.put("/api/ziemmotors/updateUser", async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Token not provided",
    });
  }

  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Invalid jwt",
      });
    }

    const userId = decoded.userId;

    const updateFields = {};
    if (req.body.name) {
      updateFields.name = req.body.name;
    }
    if (req.body.email) {
      updateFields.email = req.body.email;
    }
    if (req.body.endereco) {
      updateFields.endereco = req.body.endereco;
    }
    if (req.body.telefone) {
      updateFields.telefone = req.body.telefone;
    }
    if (req.body.image) {
      updateFields.image = req.body.image;
    }

    try {
      const user = await UserModel.findByIdAndUpdate(userId, updateFields, {
        new: true,
      });

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      res
        .status(200)
        .json({ message: "Usuário atualizado com sucesso.", user });
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar usuário.", error });
    }
  });
});

module.exports = app;
