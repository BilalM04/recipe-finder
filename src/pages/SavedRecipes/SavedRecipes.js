import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SavedRecipes.css';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import { useLocation } from 'react-router-dom';
import SearchBar from '../../components/SearchBar/SearchBar';
import { useNavigate } from "react-router-dom";

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [sortedRecipes, setSortedRecipes] = useState([]);
  const [query, setQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get('user');
    setUserEmail(email);

    const fetchSavedRecipes = async () => {
      if (email) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_RECIPE_API_URL}/users/${email}`);
          const savedRecipeUris = response.data;

          const recipeDetailsPromises = savedRecipeUris.map(uri => axios.get(`${uri}`));
          const recipeDetailsResponses = await Promise.all(recipeDetailsPromises);
          const recipes = recipeDetailsResponses.map((res, index) => ({
            ...res.data.recipe,
            link: savedRecipeUris[index]
          }));

          setSavedRecipes(recipes);
          setFilteredRecipes(recipes);
          setSortedRecipes(recipes);
        } catch (err) {
          console.error('Error fetching saved recipes:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchSavedRecipes();
  }, [location.search]);

  // Function to handle search
  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = savedRecipes.filter(recipe =>
      recipe.label.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRecipes(filtered);
  };

  // Sorting useEffect
  useEffect(() => {
    const sortRecipes = (recipes, option) => {
      let sorted = [...recipes];
      if (option === 'alphabetical-asc') {
        sorted.sort((a, b) => a.label.localeCompare(b.label));
      } else if (option === 'alphabetical-desc') {
        sorted.sort((a, b) => b.label.localeCompare(a.label));
      } else if (option === 'calories-asc') {
        sorted.sort((a, b) => a.calories - b.calories);
      } else if (option === 'calories-desc') {
        sorted.sort((a, b) => b.calories - a.calories);
      }
      setSortedRecipes(sorted);
    };

    sortRecipes(filteredRecipes, sortOption);
  }, [sortOption, filteredRecipes]);

  const handleDeleteRecipe = async (uri) => {
    try {
      const encodedUri = encodeURIComponent(uri);
      await axios.delete(`${process.env.REACT_APP_RECIPE_API_URL}/users/${userEmail}/${encodedUri}`);
      
      const updatedRecipes = savedRecipes.filter(recipe => recipe.link !== uri);
      setSavedRecipes(updatedRecipes);
      setFilteredRecipes(updatedRecipes);
      setSortedRecipes(updatedRecipes); 
  
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `${process.env.REACT_APP_FOR_PATH}/search`; 
    navigate(path);
  }

  return (
    <div className="App">
      <div className="auth-buttons">
        <button className='auth-button' onClick={routeChange}>Back</button>
      </div>
      <div className="content-main">
        <header className="header">
          <h1>👨‍🍳 Saved Recipes 📋</h1>
        </header>
        <div>
          {loading ? (
            <p className="description">Loading...</p>
          ) : savedRecipes.length === 0 ? (
            <p className="description">No saved recipes.</p>
          ) : (
            <SearchBar query={query} setQuery={setQuery} handleSearch={handleSearch} />
          )}
        </div>
        {savedRecipes.length > 0 && (
          <div>
            {sortedRecipes.length > 0 ? (
              <>
                <div className='select-container'>
                  <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                    <option value="">Sort by</option>
                    <option value="alphabetical-asc">Alphabetical (A-Z)</option>
                    <option value="alphabetical-desc">Alphabetical (Z-A)</option>
                    <option value="calories-asc">Calories (Low to High)</option>
                    <option value="calories-desc">Calories (High to Low)</option>
                  </select>
                </div>
                <div className="recipe-list">
                  {sortedRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.uri}
                      recipe={recipe}
                      onDelete={handleDeleteRecipe}
                      isSaved={true}
                    />
                  ))}
                </div>
              </>
            ) : (
              <p className="no-results-message">No Results</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedRecipes;