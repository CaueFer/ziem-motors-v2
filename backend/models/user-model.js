const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    image: { type: String },
    endereco: { type: String },
    telefone: { type: String },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('UserModel', userSchema);