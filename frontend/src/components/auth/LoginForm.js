import React, { useState } from 'react';
import SignUpForm from '../user/SignUpForm'
import "./LoginForm.css";
const renderUrl = require('../../renderUrl');

const LogInForm = ({ navigate }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  window.localStorage.clear();
  window.localStorage.setItem("app-route", "login");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // let response = await fetch('/tokens', {
    let response = await fetch(`${renderUrl}/tokens`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username, password: password })
    })

    if (response.status !== 201) {
      console.log("oops")
      navigate('/login')
      const errorMessage = document.getElementById('error-message')
      errorMessage.textContent = "Incorrect username or password"
    } else {
      console.log("yay")
      let data = await response.json()
      window.localStorage.setItem("token", data.token)
      window.localStorage.setItem("username", username)
      navigate('/posts');
    }
  }

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }


  return (
    <div className='login-form'>
      <div className='title-container'>
        <h1 className='login-title'>Log in to Farcebook</h1>
      </div>
      <form onSubmit={handleSubmit}>
      <label htmlFor="username">Username: </label>
        <input placeholder="Username" id="username" type='text' value={ username } onChange={handleUsernameChange} /> <br />
        <label htmlFor="password">Password: </label>
        <input placeholder='Password' id="password" type='password' value={password} onChange={handlePasswordChange} /> <br />
        <p id='error-message'></p>
        <input role='submit-button' id='submit' type="submit" value="Submit" />
      </form>
    
    </div>
  )
}

export default LogInForm;
