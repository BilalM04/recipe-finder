import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Search.css';
import SearchBar from '../../components/SearchBar/SearchBar';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../auth/firebase';
import LoginForm from '../../components/AuthForms/LoginForm';
import SignUpForm from '../../components/AuthForms/SignUpForm';

const Search = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [user, setUser] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);

  const fetchRecipes = async () => {
    if (query.trim() !== '') {
      try {
        const response = await axios.get(
          `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${process.env.REACT_APP_EDAMAM_APP_ID}&app_key=${process.env.REACT_APP_EDAMAM_APP_KEY}&to=100`
        );
        const recipesWithLinks = response.data.hits.map(hit => {
          return {
            ...hit.recipe,
            link: hit._links.self.href
          };
        });
        setRecipes(recipesWithLinks);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    await fetchRecipes();
  };

  const handleSaveRecipe = async (uri) => {
    try {
      console.log(uri)
      const response = await axios.post(`${process.env.REACT_APP_RECIPE_API_URL}/users/${user.email}`, { uri });
      console.log(`Recipe saved!`, response.data);
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
  const routeChange = () => {
    let path = `${process.env.REACT_APP_FOR_PATH}/saved`;
    navigate(`${path}?user=${user ? user.email : ''}`);
  };

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
      <div className="content-main">
        <header className="header">
          <h1>👨‍🍳 Recipe Finder 🍴</h1>
        </header>
        <div>
          <SearchBar query={query} setQuery={setQuery} handleSearch={handleSearch} />
          {!user && (<p className="description">Browse without an account! Please login or sign up to save recipes.</p>)}
          {user && (<button onClick={routeChange}>View Saved Recipes</button>)}
          <div className="recipe-list">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.uri}
                recipe={recipe}
                onSaveRecipe={handleSaveRecipe}
                user={user}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
