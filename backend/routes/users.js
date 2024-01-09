const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Recipe = require('../models/recipeModel');

// Get a user's recipes
router.get('/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email }).populate('recipes');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.recipes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Post a new recipe to a user, creating a new one if it doesn't exist
router.post('/:email', async (req, res) => {
    const { label, image, ingredients } = req.body;
    try {
        const userEmail = req.params.email;
        let user = await User.findOne({ email: userEmail });
        
        if (!user) {
            user = await User.create({ email: userEmail }); // Create a new user if not found
        }

        // Check if the recipe already exists for this user
        const recipeExists = await Recipe.findOne({ label, _id: { $in: user.recipes } });

        if (!recipeExists) {
            const newRecipe = await Recipe.create({ label, image, ingredients });
            user.recipes.push(newRecipe);
            await user.save();
            res.status(201).json(newRecipe);
        } else {
            res.status(409).json({ message: 'Recipe already exists for this user!' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:email/recipes/:recipeId', async (req, res) => {
    const userEmail = req.params.email;
    const recipeId = req.params.recipeId;

    try {
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the recipe exists for this user
        const recipeIndex = user.recipes.findIndex(recipe => String(recipe._id) === recipeId);

        if (recipeIndex === -1) {
            return res.status(404).json({ message: 'Recipe not found for this user' });
        }

        // Remove the recipe reference from the user's recipes array
        user.recipes.splice(recipeIndex, 1);
        await user.save();

        // Delete the recipe from the Recipe collection
        await Recipe.findByIdAndDelete(recipeId);

        res.json({ message: 'Recipe deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
