import React from 'react';
import './SearchBar.css'; // Import the CSS file for SearchBar

const SearchBar = ({ query, setQuery, handleSearch }) => {
  return (
    <div className="search-container">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          id="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
    </div>
  );
};

export default SearchBar;


