const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
    label: { type: String, required: true },
    image: String,
    ingredients: [Object],
  });

module.exports = mongoose.model('Recipe', recipeSchema)