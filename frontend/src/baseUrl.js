export default process.env.NODE_ENV === 'deploy' || process.env.NODE_ENV === 'production'
  ? 'https://farcebook-backend.onrender.com'
  : 'http://localhost:8080';