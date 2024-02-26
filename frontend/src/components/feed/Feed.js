import React, { useEffect, useState } from 'react';
import Post from '../post/Post';
import AddPost from '../AddPost/AddPost';
import './Feed.css';
import baseUrl from '../../baseUrl';

const Feed = ({ navigate }) => {
  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState(window.localStorage.getItem('token'));
  console.log('token is ', token);
  const [postCount, setPostCount] = useState(0);
  window.localStorage.setItem('app-route', 'feed');

  const handlePostAdded = () => {
    setPostCount((prevCount) => prevCount + 1);
  };

  function orderByDate(posts) {
    return posts
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .reverse();
  }

  useEffect(() => {
    if (token) {
      console.log('token in fetch is ', token);

      fetch(`${baseUrl}/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then(async (data) => {
          console.log('data is ', data);
          if (data.message === 'auth error') {
            navigate('/login');
          }
          window.localStorage.setItem('token', data.token);
          console.log(data);
          setToken(window.localStorage.getItem('token'));
          data.posts.forEach((post) => {
            post.author = post.authorUserID.username;
            post.avatar = post.authorUserID.avatar;
            delete post.authorUserID;
          });
          setPosts(orderByDate(data.posts));
        })
        .catch((error) => {
          // Handle fetch error
          console.log('in catch, error is ', error);
          console.error(error);
        });
    } else {
      navigate('/login');
    }
  }, [postCount]);

  if (token) {
    console.log('token in return is ', token);
    return (
      <>
        <div className='add-posts'>
          <AddPost onPostAdded={handlePostAdded} />
        </div>
        <div id='feed' role='feed'>
          {posts.map((post) => (
            <Post post={post} key={post._id} onPostAdded={handlePostAdded} />
          ))}
        </div>
      </>
    );
  } else {
    console.log('token is ', token);
    navigate('/login');
  }

  return null; // Render null when there is no token
};

export default Feed;
