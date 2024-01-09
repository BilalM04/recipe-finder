import React, { useState } from 'react';
import { auth } from './firebase'; // Import the Firebase auth object
import './LoginForm.css'; // Import SignUpForm CSS
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignUpForm = ({ setShowSignUpForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

const handleSignUp = async () => {
    createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
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
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSignUp}>Sign Up</button>
        {error && <p className="error">{error}</p>} {/* Display error message */}
        <button onClick={() => setShowSignUpForm(false)}>Close</button>
      </div>
    </div>
  );
};

export default SignUpForm;
