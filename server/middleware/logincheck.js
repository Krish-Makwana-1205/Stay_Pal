const { getUser } = require("../service/auth");

async function restrictToLoggedinUserOnly(req, res, next) {
  const userUid = req.cookies?.uid;
  if (!userUid){
    return null;
  } 
  const user = getUser(userUid);

  if (!user){
    return null;
  } 
  req.user = user;
  next();
}

module.exports ={
    restrictToLoggedinUserOnly
}