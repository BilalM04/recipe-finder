import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SavedRecipes.css'; // Import the CSS file for SavedRecipes
import RecipeCard from '../../components/RecipeCard/RecipeCard'; // Adjust the import path as needed
import { useLocation } from 'react-router-dom';

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Extract userEmail from query parameters
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get('user');
    setUserEmail(email);

    const fetchSavedRecipes = async () => {
      if (email) {
        try {
          // Fetch saved recipe URIs from backend
          const response = await axios.get(`${process.env.REACT_APP_RECIPE_API_URL}/users/${email}`);
          const savedRecipeUris = response.data;
    
          // Fetch recipe details from Edamam API
          const recipeDetailsPromises = savedRecipeUris.map(uri => {
            const apiUrl = `${uri}`;
            return axios.get(apiUrl);
          });
    
          const recipeDetailsResponses = await Promise.all(recipeDetailsPromises);
          const recipes = recipeDetailsResponses.map((res, index) => ({
            ...res.data.recipe,
            link: savedRecipeUris[index]
          }));
    
          setSavedRecipes(recipes);
        } catch (err) {
          if (err.response) {
            // Server responded with a status other than 200 range
            setError(`Error: ${err.response.data.message}`);
          } else if (err.request) {
            // Request was made but no response received
            setError('Error: No response from server.');
          } else {
            // Something else happened
            setError('Error fetching saved recipes.');
          }
          console.error('Error fetching saved recipes:', err);
        }
      }
    };
    

    fetchSavedRecipes();
  }, [location.search]);

  const handleDeleteRecipe = async (uri) => {
    try {
      const encodedUri = encodeURIComponent(uri);
      // Delete recipe from backend
      await axios.delete(`${process.env.REACT_APP_RECIPE_API_URL}/users/${userEmail}/${encodedUri}`);
      // Update state to remove deleted recipe
      setSavedRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.uri !== uri));
      window.location.reload();
    } catch (error) {
      setError('Error deleting recipe.');
      console.error('Error deleting recipe:', error);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>👨‍🍳 Saved Recipes 📋</h1>
      </header>
      <div className="content">
        {error && <div className="error-message">{error}</div>}
        {savedRecipes.length === 0 ? (
          <div className="no-recipes-message">No saved recipes.</div>
        ) : (
          <div className="recipe-list saved-recipe-list">
            {savedRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.uri}
                recipe={recipe}
                onDelete={handleDeleteRecipe}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedRecipes;
