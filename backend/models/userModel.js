const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
});

module.exports = mongoose.model('User', userSchema)