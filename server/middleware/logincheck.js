const { getUser } = require("../service/auth");

async function restrictToLoggedinUserOnly(req, res, next) {
  const userUid = req.cookies?.uid;
  if (!userUid){
    return res.status(401).json({ message: "Unauthorized: No uid cookie" });
  } 
  const user = getUser(userUid);

  if (!user){
    return res.status(401).json({ message: "Unauthorized: No uid cookie" });
  } 
  req.user = user;
  next();
}

module.exports ={
    restrictToLoggedinUserOnly
}