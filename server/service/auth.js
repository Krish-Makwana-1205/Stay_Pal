const jwt = require('jsonwebtoken');
const secret = 'cpi||cgpa'

function setUser(user){
    console.log(user);
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