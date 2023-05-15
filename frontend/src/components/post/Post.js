import React from 'react';

const Post = ({post}) => {
  return(
    <article data-cy="post" key={ post._id }>{ post.message }{ post.createdAt }{ post.author }</article>
    // <article data-cy="post" key={ post._id }>{ post.message }</article>
  )
}

export default Post;
