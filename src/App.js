import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import SearchBar from './components/SearchBar';

const App = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);

  const fetchRecipes = async () => {
    if (query.trim() !== '') {
      try {
        const response = await axios.get(
          `https://api.edamam.com/search?q=${query}&app_id=1023ff2b&app_key=2a4f3db4e6fde34b62d4e51078b80516`
        );
        setRecipes(response.data.hits);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    await fetchRecipes();
  };

  return (
    <div className="App">
      <h1>👨‍🍳 Recipe Finder 🍴</h1>
      <SearchBar query={query} setQuery={setQuery} handleSearch={handleSearch} />
      <div className="recipe-list">
        {recipes.map((recipe) => (
          <div key={recipe.recipe.uri} className="recipe-card">
            <h3>{recipe.recipe.label}</h3>
            <img src={recipe.recipe.image} alt={recipe.recipe.label} />
            <ul>
              {recipe.recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient.text}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
