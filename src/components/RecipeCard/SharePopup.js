import React from 'react';
import './SharePopup.css';

const SharePopup = ({ onClose, shareAs }) => {
  const handleShare = (platform) => {
    const url = encodeURIComponent(shareAs);
    let shareUrl;

    switch (platform) {
      case 'email':
        shareUrl = `mailto:?subject=Check out this recipe&body=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'pinterest':
        shareUrl = `https://pinterest.com/pin/create/button/?url=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://x.com/intent/tweet?url=${url}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank');
  };

  return (
    <div className="share-popup-overlay">
      <div className="share-popup-content">
        <button className="exit-button" onClick={onClose}>X</button>
        <div className="share-icons">
          <button onClick={() => handleShare('email')}>
            <i className="fas fa-envelope"></i> 
          </button>
          <button onClick={() => handleShare('facebook')}>
            <i className="fab fa-facebook-f"></i>
          </button>
          <button onClick={() => handleShare('pinterest')}>
            <i className="fab fa-pinterest"></i>
          </button>
          <button onClick={() => handleShare('twitter')}>
            <i className="fab fa-x-twitter"></i> 
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharePopup;
