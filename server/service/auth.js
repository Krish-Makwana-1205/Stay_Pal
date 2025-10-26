const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.secret_sauce;

function setUser(user){
    return jwt.sign({
        email: user.email,
        name: user.username
    }, secret);
}

function getUser(token){
    if(!token){
        return null;
    }
    try{
        return jwt.verify(token, secret);
    }
    catch(error){
        return null;
    }
}

module.exports = {
    getUser,
    setUser
}