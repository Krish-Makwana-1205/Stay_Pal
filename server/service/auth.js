const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.secret_sauce;

function setUser(user){
    // Accept either:
    // - a full DB user object with { email, username, istenant }
    // - a decoded token-like object with { email, name, istenant }
    // - or a simple email string
    if (!user) return null;
    const email = typeof user === 'string' ? user : (user.email || null);
    const name = (typeof user === 'object') ? (user.username || user.name || null) : null;
    const istenant = (typeof user === 'object') ? (user.istenant || false) : false;
    return jwt.sign({
        email,
        name,
        istenant
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