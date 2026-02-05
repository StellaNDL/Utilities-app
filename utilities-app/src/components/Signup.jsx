import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from '../context/AuthContext';

const Signup = () => {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState("");

const {session, signUpNewUser} = UserAuth();
const navigate = useNavigate()
console.log(session);


const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
        const result = await signUpNewUser(email, password)
        
        if (result.success) {
            navigate('/dashboard')
        }
    } catch (error) {
        setError("an error occured")
    } finally {
        setLoading(false);
    }
}

  return (
  <div>
    <form onSubmit={handleSignUp} className='max-w-md m-auto pt-24'>
        <h2 className='font-bold pb-2 bg-blue-600 text-white'> SignUp </h2>
        <p>
             <Link to="/signin">Sign in</Link> as an Admin.
        </p>
        <div className='flex flex-col py-4 '>
            <input 
            onChange={(e) => setEmail(e.target.value)} 
            className='p-3 mt-6 border border-black' 
            type="email" 
            name="email" 
            id="Email" />
            <input onChange={(e) => setPassword(e.target.value)}
            className='p-3 mt-6  border border-black' 
            type="password" 
            name="password" 
            id="Password" />
            <button type='submit' disabled={loading} className='mt-6 w-full  bg-blue-600 text-white'>Sign Up</button>
            {error && <p className='text-red-600 text-center pt-4'>{error}</p>}
        </div>
        </form>
  </div>
  );
};

export default Signup;