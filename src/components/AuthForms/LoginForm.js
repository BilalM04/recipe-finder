import React, { useState } from 'react';
import { auth } from '../../auth/firebase';
import './LoginForm.css';
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginForm = ({ setShowLoginForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    signInWithEmailAndPassword(auth, email, password)
  .then(() => {
    console.log('Logged in user:', email)
  })
  .catch((error) => {
    console.error('Login error:', error.message);
    setError(error.message);
  });
  };

  return (
    <div className="overlay">
      <div className="modal">
        <h2>Login</h2>
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
          <button className="signup-button"onClick={handleLogin}>Login</button>
          <button className="close-button" onClick={() => setShowLoginForm(false)}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
