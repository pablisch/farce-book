const JWT = require("jsonwebtoken");
require('dotenv').config()
const secret = process.env.JWT_SECRET;

class TokenGenerator {
  static jsonwebtoken(user_id) {
    return JWT.sign({
      user_id: user_id,
      iat: Math.floor(Date.now() / 1000),
      
      // Set the JWT token to expire in 30 minutes
      exp: Math.floor(Date.now() / 1000) + (30 * 60)
    }, secret);
  }
}

module.exports = TokenGenerator;
