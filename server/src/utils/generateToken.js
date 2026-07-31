const jwt = require('jsonwebtoken');

// Generate JSON Web Token signed with user ID
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

module.exports = generateToken;
