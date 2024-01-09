import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SavedRecipes.css'; // Import the CSS file for SavedRecipes
import { useLocation } from 'react-router-dom';

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userEmail = searchParams.get('user');

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        if (userEmail) {
          const response = await axios.get(`https://recipe-finder-restapi.vercel.app/users/${userEmail}`);
          setSavedRecipes(response.data);
        }
      } catch (error) {
        console.error('Error fetching saved recipes:', error);
      }
    };

    fetchSavedRecipes();
  }, [userEmail]);

  const handleDeleteRecipe = async (recipeID) => {
    try {
      const response = await axios.delete(`https://recipe-finder-restapi.vercel.app/users/${userEmail}/recipes/${recipeID}`);
      console.log(`Recipe deleted!`, response.data);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>👨‍🍳 Saved Recipes 📋</h1>
      </header>
      <div className="content">
        {savedRecipes.length === 0 ? (
          <div className="no-recipes-message">No saved recipes.</div>
        ) : (
          <div className="recipe-list saved-recipe-list">
            {savedRecipes.map((recipe) => (
              <div key={recipe._id} className="recipe-card saved-recipe-card">
                <h3>{recipe.label}</h3>
                <img src={recipe.image} alt={recipe.title} />
                <ul>
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient.text}</li>
                  ))}
                </ul>
                {<button onClick={() => handleDeleteRecipe(recipe._id)}>Delete</button>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedRecipes;
