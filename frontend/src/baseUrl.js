export default process.env.NODE_ENV === 'deploy'
  ? 'https://farcebook-backend.onrender.com'
  : 'http://localhost:8080';