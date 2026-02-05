import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from '../context/AuthContext';

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 1. We need signInUser to log in, and session/userRole to redirect
  const { signInUser, session, userRole } = UserAuth();
  const navigate = useNavigate();

  // 2. THIS BLOCK WATCHES FOR YOUR ROLE AND REDIRECTS YOU
  useEffect(() => {
    // If you are logged in (session) AND we know your role (userRole):
    if (session && userRole) {
      if (userRole === "admin") {
        console.log("Redirecting to Admin Panel...");
        navigate("/admin");
      } else if (userRole === "user") {
        console.log("Redirecting to Dashboard...");
        navigate("/dashboard");
      }
    }
  }, [session, userRole, navigate]); 

  // 3. THE LOGIN FUNCTION
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const result = await signInUser(email, password);
      
      // Note: We do NOT call navigate() here manually.
      // The useEffect above will detect the login and redirect automatically.
      if (!result.success) {
        setError(result.error || "Failed to sign in");
      }
    } catch (error) {
      setError("An error occurred during sign in");
    }
  };

  return (
    <div>
      <form onSubmit={handleSignIn} className='max-w-md m-auto pt-24'>
        <h2 className='font-bold pb-2 bg-blue-600 text-white'> Sign In </h2>
        
        {/* This link goes back to Signup for new users */}
        <p className="text-sm text-gray-600 mb-4">
            Don't have an account? <Link to="/signup" className="text-blue-600 underline">Sign Up</Link>
        </p>

        <div className='flex flex-col py-4 '>
            <input 
              onChange={(e) => setEmail(e.target.value)} 
              className='p-3 mt-6 border border-black' 
              type="email" 
              placeholder="Email"
              value={email} 
            />
            <input 
              onChange={(e) => setPassword(e.target.value)}
              className='p-3 mt-6  border border-black' 
              type="password" 
              placeholder="Password"
              value={password} 
            />
            <button type='submit' className='mt-6 w-full bg-blue-600 text-white'>Sign In</button>
            
            {error && <p className='text-red-600 text-center pt-4'>{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default Signin;