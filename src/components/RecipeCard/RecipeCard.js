import React, { useState } from 'react';
import './RecipeCard.css';
import DetailedRecipe from './DetailedRecipe';

const RecipeCard = ({ recipe, onSaveRecipe, user, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    image = 'placeholder-image-url',
    label = 'No Labels',
    link,
    dietLabels = [],
    healthLabels = [],
  } = recipe;

  const labels = [...dietLabels, ...healthLabels];

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
        <button onClick={() => setIsModalOpen(true)}>
          View Details
        </button>
        {user && <button onClick={() => onSaveRecipe(link)}>
            Save Recipe
        </button>}
        {onDelete && <button onClick={() => onDelete(link)}>
            Delete
        </button>}
      </div>
      <DetailedRecipe
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onSaveRecipe}
        recipe={recipe}
        user={user}
      />
    </div>
  );
};

export default RecipeCard;
