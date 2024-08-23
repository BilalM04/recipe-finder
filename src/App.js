// App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import SearchBar from './components/SearchBar';
import { useNavigate } from "react-router-dom";
import { auth } from './firebase'; // Import the auth instance from your firebase.js file
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';


const App = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [user, setUser] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);

  const fetchRecipes = async () => {
    if (query.trim() !== '') {
      try {
        const response = await axios.get(
          `https://api.edamam.com/search?q=${query}&app_id=${process.env.REACT_APP_EDAMAM_APP_ID}&app_key=${process.env.REACT_APP_EDAMAM_APP_KEY}&to=50`
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

  const handleSaveRecipe = async (recipeLabel, recipeImage, recipeIngredients) => {
    try {
      const recipeToSave = {
        label: recipeLabel,
        image: recipeImage,
        ingredients: recipeIngredients,
      };

      const response = await axios.post(`${process.env.REACT_APP_RECIPE_API_URL}/users/${user.email}`, recipeToSave);
      console.log(`Recipe "${recipeLabel}" saved!`, response.data);
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser ? currentUser : null);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `/Saved`; 
    navigate(`${path}?user=${user ? user.email : ''}`);
  }

  return (
    <div className="App">
      <div className="auth-buttons">
        {user ? (
          <div>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div>
            <button onClick={() => setShowLoginForm(true)}>Login</button>
            {showLoginForm && (
              <LoginForm setShowLoginForm={setShowLoginForm} />
            )}

            <button onClick={() => setShowSignUpForm(true)}>Sign Up</button>
            {showSignUpForm && (
              <SignUpForm setShowSignUpForm={setShowSignUpForm} />
            )}
          </div>
        )}
      </div>
      <div className="content">
        <header className="header">
          <h1>👨‍🍳 Recipe Finder 🍴</h1>
        </header>
        {(
          <div>
            <SearchBar query={query} setQuery={setQuery} handleSearch={handleSearch} />
            {!user && (<p className="description">Browse without an account! Please login or sign up to save recipes.</p>)}
            {user && (<button onClick={routeChange}>View Saved Recipes</button>)}
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
                {user && (<button onClick={() => handleSaveRecipe(recipe.recipe.label, recipe.recipe.image, recipe.recipe.ingredients)}>Save Recipe</button>)}
              </div>
            ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;