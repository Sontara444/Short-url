const jwt = require("jsonwebtoken")
const env = require('dotenv').config();
const secret = process.env.Secret_Key

function setUser( user){
    return jwt.sign(
      {
        _id : user._id,
        email: user.email,
      },
       secret)
}

function getUser(token){
  if(!token) return null;
  try {
    return jwt.verify(token, secret)
  } catch (error) {
    return null;
  }
    
}

module.exports = {
    setUser,
    getUser,
}