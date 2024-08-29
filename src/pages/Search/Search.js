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
  const [fetchedRecipes, setFetchedRecipes] = useState([]); 
  const [sortedRecipes, setSortedRecipes] = useState([]); 
  const [user, setUser] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const [hasSearched, setHasSearched] = useState(false); 

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
        setFetchedRecipes(recipesWithLinks);
        sortRecipes(recipesWithLinks, sortOption);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    }
  };

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

  const handleSearch = async (e) => {
    e.preventDefault();
    setHasSearched(true);
    await fetchRecipes();
  };

  const handleSaveRecipe = async (uri) => {
    try {
      await axios.post(`${process.env.REACT_APP_RECIPE_API_URL}/users/${user.email}`, { uri });
      console.log('Recipe saved!');
    } catch (error) {
      console.log("Recipe already saved!")
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

  useEffect(() => {
    sortRecipes(fetchedRecipes, sortOption);
  }, [sortOption, fetchedRecipes]);

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
    let path = `/saved`;
    navigate(`${path}?user=${user ? user.email : ''}`);
  };

  const handleHeaderClick = () => {
    navigate(`/`);
  };

  return (
    <div className="App">
      <div className="auth-buttons">
        {user ? (
          <div>
            <button className='auth-button' onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div>
            <button className='auth-button' onClick={() => setShowLoginForm(true)}>Login</button>
            {showLoginForm && (
              <LoginForm setShowLoginForm={setShowLoginForm} />
            )}
            <button className='auth-button' onClick={() => setShowSignUpForm(true)}>Sign Up</button>
            {showSignUpForm && (
              <SignUpForm setShowSignUpForm={setShowSignUpForm} />
            )}
          </div>
        )}
      </div>
      <div className="content-main">
        <header className="header">
            <h1 onClick={handleHeaderClick} style={{ cursor: 'pointer' }}>
              👨‍🍳 Recipe Finder 🍴
            </h1>
        </header>
        <div>
          <SearchBar query={query} setQuery={setQuery} handleSearch={handleSearch} />
          {!user && (<p className="description">Browse without an account! Please login or sign up to save recipes.</p>)}
          {user && (<button onClick={routeChange}>View Saved Recipes</button>)}
        </div>

        {fetchedRecipes.length > 0 ? (
          <div className='select-container'>
            <select id="sort-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="">Sort by</option>
              <option value="alphabetical-asc">Alphabetical (A-Z)</option>
              <option value="alphabetical-desc">Alphabetical (Z-A)</option>
              <option value="calories-asc">Calories (Low to High)</option>
              <option value="calories-desc">Calories (High to Low)</option>
            </select>
          </div>
        ) : (
          hasSearched && <p>No Results</p>
        )}

        <div className="recipe-list">
          {sortedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.uri}
              recipe={recipe}
              onSaveRecipe={handleSaveRecipe}
              user={user}
              isSaved={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
