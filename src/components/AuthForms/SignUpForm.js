import React, { useState } from 'react';
import { auth } from '../../auth/firebase'; // Import the Firebase auth object
import './LoginForm.css';
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignUpForm = ({ setShowSignUpForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignUp = async () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log('Signed up user:', email);
      })
      .catch((error) => {
        console.error('Sign up error:', error.message);
        setError(error.message);
      });
  };

  return (
    <div className="overlay">
      <div className="modal">
        <h2>Sign Up</h2>
        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="input-group">
          {error && <p className="error">{error}</p>}
        </div>
        <div className="button-group">
          <button className="signup-button" onClick={handleSignUp}>Sign Up</button>
          <button className="close-button" onClick={() => setShowSignUpForm(false)}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
