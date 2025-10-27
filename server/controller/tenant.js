const tenant = require('../model/tenant');

async function makeProfile(req, res){
    const body = req.body;
    const user = req.user;
    if((!user.email) || (!user.name)){
        return res.status(500).json({message:"Error while fetching cookie data"});
    }
    if((!body.nationality) || (!body.hometown) || (!body.gender) || (!body.dob)){
        return res.status(400).json({message:"Did not receive all the required form fields"});
    }
    body.nationality = body.nationality.trimEnd();
    body.hometown = body.hometown.trimEnd();
    body.gender = body.gender.trimEnd();
    try{
        await tenant.findOneAndUpdate({email:user.email},{
            email:user.email,
            username:user.name,
            dob:body.dob,
            nationality:body.nationality,
            hometown:body.hometown,
            gender:body.gender
        });
    }catch(error){
        console.log(error.message);
        return res.status(500).json({message:"Error in contacting Database", error:error.message});
    }
    
    try{
        user.findOneAndUpdate({email:user.email},{
            istenant:true
        });
    }
    catch(error){
        console.log(error.message);
        return res.status(500).jos({message:"Error in contacting Database",error:error.message});
    }
    return res.status(200).json({message:"success"});
}
async function addPreferences(req, res){
    const body =req.body;
    const user = req.user;
    if((!user.email) || (!user.username)){
        return res.status(500).json({message:"Error while fetching cookie data"});
    }
    
    if (body.professional_status) body.professional_status =body.professional_status.trimEnd();
    if (body.workPlace) body.workPlace =body.workPlace.trimEnd();
    if (body.descriptions) body.descriptions =body.descriptions.trimEnd();
    if (body.religion) body.religion =body.religion.trimEnd();
    if (body.foodPreference) body.foodPreference =body.foodPreference.trimEnd();
    if (body.workingshifts) body.workingshifts =body.workingshifts.trimEnd();

    try {
        await tenant.updateOne({email:user.email},{
            email:user.email,
            foodPreference:body.foodPreference||null,
            religion:body.religion||null,
            alcohol:typeof body.alcohol ==='boolean'?body.alcohol:null,
            smoker:typeof body.smoker ==='boolean'?body.smoker:null,
            nightOwl:typeof body.nightOwl === 'boolean'?body.nightOwl:null,
            hobbies:Array.isArray(body.hobbies)?body.hobbies:[],
            professional_status:body.professional_status||null,
            workingshifts:body.workingshifts||null,
            havePet:typeof body.havePet ==='boolean'?body.havePet : null,
            workPlace:body.workPlace||null,
            descriptions:body.descriptions||null
        });
    } catch(error){
        res.status(500).json({message:"Error in contacting Database", error:error.message});
    }


    return res.status(200).json({ success: true, message: "Profile created successfully" });
}

module.exports = {
    makeProfile,
    addPreferences
};