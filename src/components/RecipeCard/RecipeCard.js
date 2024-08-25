import React, { useState } from 'react';
import './RecipeCard.css';
import DetailedRecipe from './DetailedRecipe';

const RecipeCard = ({ recipe, onSaveRecipe, user, onDelete, isSaved }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSavePopupVisible, setIsSavePopupVisible] = useState(false);
  const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);

  const {
    image = 'placeholder-image-url',
    label = 'No Labels',
    link,
    dietLabels = [],
    healthLabels = [],
  } = recipe;

  const labels = [...dietLabels, ...healthLabels];

  // Function to handle saving the recipe
  const handleSaveRecipe = (link) => {
    onSaveRecipe(link);
    setIsSavePopupVisible(true);
    setTimeout(() => {
      setIsSavePopupVisible(false);
    }, 1000); // Hide the popup after 3 seconds
  };

  // Function to handle deleting the recipe
  const handleDeleteRecipe = (link) => {
    onDelete(link);
    setIsDeletePopupVisible(true);
    setTimeout(() => {
      setIsDeletePopupVisible(false);
    }, 1000); // Hide the popup after 3 seconds
  };

  return (
    <div className="recipe-card">
      <div className="row">
        <div className="column image-column">
          <img src={image} alt={label} />
        </div>
        <div className="column details-column">
          <div className="row">
            <h2>{label}</h2>
          </div>
          <div className="row labels-row">
            {labels.length > 0 ? labels.join(' • ') : 'No Labels'}
          </div>
        </div>
      </div>
      <div className="row button-row">
        <button className="recipe-button" onClick={() => setIsModalOpen(true)}>
          View Details
        </button>
        {user && !isSaved && (
          <button className="recipe-button" onClick={() => handleSaveRecipe(link)}>
            Save Recipe
          </button>
        )}
        {isSaved && (
          <button className="recipe-button" onClick={() => handleDeleteRecipe(link)}>
            Delete
          </button>
        )}
      </div>
      <DetailedRecipe
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRecipe}
        onDelete={handleDeleteRecipe}
        recipe={recipe}
        user={user}
        isSaved={isSaved}
      />
      {isSavePopupVisible && <div className="popup save-popup">Recipe saved!</div>}
      {isDeletePopupVisible && <div className="popup delete-popup">Recipe deleted!</div>}
    </div>
  );
};

export default RecipeCard;
