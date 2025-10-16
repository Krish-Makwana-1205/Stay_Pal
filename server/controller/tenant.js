const tenant = require('../model/tenant');

async function makeProfile(req, res){
    const body = req.body;
    const user = req.user;
    if((!user.email) || (!user.username)){
        return res.status(500).json({message:"Error while fetching cookie data"});
    }
    if((!body.nationality) || (!body.hometown) || (!body.gender) || (!body.dob)){
        return res.status(400).json({message:"Did not receive all the required form fields"});
    }
    body.nationality = body.nationality.trimEnd();
    body.hometown = body.hometown.trimEnd();
    body.gender = body.gender.trimEnd();
    try{
        await tenant.create({
            email:user.email,
            username:user.username,
            nationality:body.nationality,
            hometown:body.hometown,
            gender:body.gender
        });
    }catch(error){
        res.status(500).json({message:"Error in contacting Database", error:error.message});
    }
    return res.status(200);
}
async function addPreferences(req, res){

}

module.exports = {
    makeProfile,
    addPreferences
};