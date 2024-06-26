const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// password hashing
const hashedPassword = async (password) => {
    try {
      const salt = await bcrypt.genSalt(10);
     return  bcrypt.hash(password, salt); 
    } catch (error) {
      throw new Error('Password hashing failed');
    }
  };


// password comparison
const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};


//// token Generate
const tokenGenerate = (id, role) => {
  try {
    const token = jwt.sign({ id, role }, process.env.SECRET_KEY, { expiresIn: '24h' });
    return token;
  } catch (error) {
    throw new Error('Token generation failed');
  }
};
module.exports = {hashedPassword,comparePassword,tokenGenerate}