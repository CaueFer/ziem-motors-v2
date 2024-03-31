const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const UserModel = require("./user-model");
const jwt = require('jsonwebtoken');

const app = express();
const uri = "mongodb+srv://admin:Cachorro1337*mongodb@cluster0.0ejr2zv.mongodb.net/ziemmotors?retryWrites=true&w=majority&appName=Cluster0";

const secretKey = "STRINGMTFODA";

mongoose.connect(uri)
    .then(()=>{
        console.log('Database conectada');
    })
    .catch( () => {
        console.log('Erro ao conectar na database');
    })

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
})


app.post('/api/ziemmotors/signin', async (req, res) => {
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const userModel = new UserModel({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash
                })

                userModel.save().then(result => {
                    res.status(201).json({
                        message: 'User created',
                        result: result
                    })
                })
                .catch( err =>{
                    res.status(500).json({
                        error: err
                    })
                })
            })
});

app.post('/api/ziemmotors/login', async (req, res) => {

    let userFound;

    UserModel.findOne({email: req.body.email})
        .then(user => {

            if(!user){
                return res.status(401).json({
                    message: 'User/Email not found'
                })
            }
            userFound = user;
            return bcrypt.compare(req.body.password, user.password);
        })
    .then(result =>{
        if(!result){
            return res.status(401).json({
                message: 'Incorrect password'
            })
        }

        const token = jwt.sign({userName: userFound.name, userEmail: userFound.email, userId: userFound._id}, secretKey, {expiresIn: "24h"})
        return res.status(200).json({
            token: token
        })
    })
    .catch(err => {
        res.status(401).json({
            message: 'Error with authentication'
        })
    })
})

app.get('/api/ziemmotors/getUser', async (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            message: 'Token not provided'
        });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: 'Invalid jwt'
            });
        }

        const userId = decoded.userId;
        const userName = decoded.userName;
        const userEmail = decoded.userEmail;

        return res.status(200).json({
            userInfos: {
                userName: userName,
                userEmail: userEmail
            }
        });
    });
});


module.exports = app;
