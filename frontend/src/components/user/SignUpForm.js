import React, { useState } from 'react';
import baseUrl from '../../baseUrl';

const SignUpForm = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [errors, setErrors] = useState([]);
  window.localStorage.clear();
  window.localStorage.setItem('app-route', 'signup');

  const handleSubmit = async (event) => {
    event.preventDefault();

    //need to change this to use fetch with the avatar
    //image do not uppload with JSon.
    const formData = new FormData();
    formData.append('email', email);
    formData.append('username', username);
    formData.append('password', password);
    if (avatar) {
      formData.append('avatar', avatar);
    }

    fetch(`${baseUrl}/users`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.status === 201) {
          navigate('/login');
        } else {
          if (response.status === 400) {
            response.json().then((data) => {
              setErrors(data.message);
            });
          }
          navigate('/signup');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleAvatarChange = (event) => {
    //before was a string, now is a fileq
    setAvatar(event.target.files[0]);
    console.log(event.target.files[0]);
  };

  const login = () => {
    navigate('/login');
  };

  return (
    <div id='signup-form' className='login-form'>
      <div className='title-container'>
        <h1 className='login-title'>Farcebook Sign Up</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor='email'>Enter an email address: </label>
        <input
          placeholder='Email'
          id='email'
          type='text'
          value={email}
          onChange={handleEmailChange}
        />{' '}
        <br />
        <br></br>
        <label htmlFor='username'>Enter username: </label>
        <input
          placeholder='Username'
          id='username'
          type='text'
          value={username}
          onChange={handleUsernameChange}
        />
        <small>
          <li id='li'>Must be between 5 to 15 characters.</li>
        </small>
        <br></br>
        <label htmlFor='password'>Enter a password: </label> <br />
        <input
          placeholder='Password'
          id='password'
          type='password'
          value={password}
          onChange={handlePasswordChange}
        />
        <small>
          <li id='li'>Must be between 8 to 20 characters.</li>
          <li id='li'>
            Requires one uppercase, one lowercase, and one number.
          </li>
        </small>
        <br></br>
        <label htmlFor='avatar'>Avatar (optional):</label>
        <input id='avatar' type='file' onChange={handleAvatarChange} />
        <br></br>
        <div id='error-message'>{errors}</div>
        <input id='submit' type='submit' value='Submit' />
      </form>
    </div>
  );
};

export default SignUpForm;
