const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const carInfoSchema = mongoose.Schema({
    motor: { type: String, required: true },
    cambio: { type: String, required: true },
    km: { type: Number, required: true }
});

const carSchema = mongoose.Schema({
    carName: { type: String, required: true, unique: true },
    carImgPath: { type: String, required: true },
    carInfos: { type: carInfoSchema, required: true }
});

carSchema.plugin(uniqueValidator);

module.exports = mongoose.model('carModel', carSchema);