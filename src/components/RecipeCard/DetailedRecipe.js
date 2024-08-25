import React, { useEffect, useState } from 'react';
import './DetailedRecipe.css';
import './RecipeCard.css';
import SharePopup from './SharePopup'; // Import the SharePopup component

const DetailedRecipe = ({ isOpen, onClose, onSave, recipe, onDelete, isSaved }) => {
  const [showSharePopup, setShowSharePopup] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const { 
    image, 
    label,
    calories,
    cuisineType,
    mealType,
    dishType,
    url,
    source,
    ingredientLines,
    link,
    shareAs
  } = recipe;

  const handleShareClick = () => {
    console.log('Share button clicked');
    setShowSharePopup(true);
  };

  const handlePopupClose = () => {
    console.log('Popup close button clicked');
    setShowSharePopup(false);
  };

  return (
    <>
      {showSharePopup && <SharePopup onClose={handlePopupClose} shareAs={shareAs} />}
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="content">
            <div className='row heading-row'>
              <h2>{label}</h2>
            </div>
            <div className='row'>
              <img src={image} alt={label} className='recipe-image'/>
            </div>
            <div className='row'>
              <ul className='no-bullets'>
                <li><b>Cuisine Type:</b> {cuisineType.length > 0 ? cuisineType.join(', ') : 'N/A'}</li>
                <li><b>Meal Type:</b> {mealType.length > 0 ? mealType.join(', ') : 'N/A'}</li>
                <li><b>Dish Type:</b> {dishType.length > 0 ? dishType.join(', ') : 'N/A'}</li>
                <li><b>Calories:</b> {Math.round(calories)} kcal</li>
                <li><b>Complete Instructions:</b> <a href={url} target="_blank" rel="noopener noreferrer">{source}</a></li>
              </ul>
            </div>
            <div className='row'>
              <h3>Ingredients</h3>
            </div>
            <div className='row list'>
              <ul>
                {ingredientLines.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="row button-row footer">
            {!isSaved && <button className='recipe-button' onClick={() => onSave(link)}>Save Recipe</button>}
            <button className='recipe-button' onClick={handleShareClick}>Share</button>
            {isSaved && <button className='recipe-button' onClick={() => onDelete(link)}>Delete</button>}
            <button className='recipe-button' onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailedRecipe;
