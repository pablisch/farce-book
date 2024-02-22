import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import baseUrl from '../../baseUrl';

const LogInForm = ({ navigate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isServerUp, setIsServerUp] = useState(false);
  const expectedServerSpinUpTime = 90;
  const [counter, setCounter] = useState(expectedServerSpinUpTime);
  window.localStorage.setItem('app-route', 'login');

  if (window.localStorage.getItem('token')) {
    navigate('/posts');
  }

  useEffect(() => {
    console.log('Checking server status...');
    // console.log('nodeEnv', process.env.NODE_ENV);
    // console.log('baseUrl', baseUrl);
    const checkServerStatus = async () => {
      try {
        const response = await fetch(`${baseUrl}/health`);
        if (response.ok) {
          setIsServerUp(true);
        } else {
          setIsServerUp(false);
        }
      } catch (error) {
        setIsServerUp(false);
      }
    };

    checkServerStatus();

    if (isServerUp) {
      return () => clearInterval(intervalId);
    }

    const intervalId = setInterval(() => {
      checkServerStatus(); 
      setCounter((counter) => counter - 1);
      console.log('time for server to spin up');
    }, 1000);

    if (isServerUp) {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId); 
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // let response = await fetch('/tokens', {
    let response = await fetch(`${baseUrl}/tokens`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username, password: password }),
    });

    if (response.status !== 201) {
      console.log('oops');
      navigate('/login');
      const errorMessage = document.getElementById('error-message');
      errorMessage.textContent = 'Incorrect username or password';
    } else {
      console.log('yay');
      let data = await response.json();
      window.localStorage.setItem('token', data.token);
      window.localStorage.setItem('username', username);
      navigate('/posts');
    }
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <>
      <div className='login-form'>
        <div className='title-container'>
          <h1 className='login-title'>Log in to Farcebook</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor='username'>Username: </label>
          <input
            placeholder='Username'
            id='username'
            type='text'
            value={username}
            onChange={handleUsernameChange}
          />{' '}
          <br />
          <label htmlFor='password'>Password: </label>
          <input
            placeholder='Password'
            id='password'
            type='password'
            value={password}
            onChange={handlePasswordChange}
          />{' '}
          <br />
          <p id='error-message'></p>
          {(isServerUp || counter > expectedServerSpinUpTime - 1) && (
            <input
              className='submit'
              type='submit'
              value='Submit'
            />
          )}
          {!isServerUp && counter <= expectedServerSpinUpTime - 1 && (
            <input
              className='submit waiting-for-server'
              type='submit'
              value='Waiting for the server - Please be patient'
            />
          )}
        </form>
      </div>

      {!isServerUp && counter < expectedServerSpinUpTime - 2 && (
        <div className='login-form notice'>
          {counter >= 0 ? (
            <p id='server-coutdown'>
              The server is expected to be up in around{' '}
              {counter <= 0 ? 0 : counter} seconds.
            </p>
          ) : (
            <p id='server-coutdown'>
              Currently waiting for server to spin up for{' '}
              {expectedServerSpinUpTime - counter} seconds
            </p>
          )}
          <p>
            This App is currently deployed on a free tier of Render.com which is
            great but means the server spins down after 15 minutes of
            inactivity.
          </p>
          <p>
            Please be patient while the server spins back up which is likely to
            take between 40 seconds and around two minutes.
          </p>
          <p>Feel free to browse another tab while this is happening.</p>
        </div>
      )}
    </>
  );
};

export default LogInForm;
