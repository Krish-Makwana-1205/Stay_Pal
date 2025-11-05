const roommate = require("../model/roommate");

const user = require('../model/user');
async function makeRoommateProfile(req, res){
    console.log('here');
    const body = req.body;
    const User = req.user;
    if((!User.email) || (!User.name)){
        return res.status(500).json({message:"Error while fetching cookie data"});
    }
    if((!body.nationality) || (!body.hometown) || (!body.gender) || (!body.dob)){
        return res.status(400).json({message:"Did not receive all the required form fields"});
    }
    body.nationality = body.nationality.trimEnd();
    body.hometown = body.hometown.trimEnd();
    body.gender = body.gender.trimEnd();
    try{
        await roommate.findOneAndUpdate({email:User.email},{
            email:User.email,
            username:User.name,
            dob:body.dob,
            nationality:body.nationality,
            hometown:body.hometown,
            gender:body.gender
        }, {upsert:true, new:true});
    }catch(error){
        console.log(error.message);
        return res.status(500).json({message:"Error in contacting Database", error:error.message});
    }
    
    try{
        await user.findOneAndUpdate({email:User.email},{
            isroommate:true
        });
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({message:"Error in contacting Database",error:error.message});
    }
    return res.status(200).json({message:"success"});
}
async function addRoommatePreferences(req, res){
    const body =req.body;
    const User = req.user;
    if((!User.email) || (!User.name)){
        return res.status(500).json({message:"Error while fetching cookie data"});
    }
    
    if (body.professional_status) body.professional_status =body.professional_status.trimEnd();
    if (body.workPlace) body.workPlace =body.workPlace.trimEnd();
    if (body.descriptions) body.descriptions =body.descriptions.trimEnd();
    if (body.religion) body.religion =body.religion.trimEnd();
    if (body.foodPreference) body.foodPreference =body.foodPreference.trimEnd();
    if (body.workingshifts) body.workingshifts =body.workingshifts.trimEnd();

    try {
        await roommate.updateOne({email:User.email},{
            email:User.email,
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
        },{upsert:true, new:true});
    } catch(error){
        res.status(500).json({message:"Error in contacting Database", error:error.message});
    }


    return res.status(200).json({ success: true, message: "Profile created successfully" });
}

module.exports = {
    makeRoommateProfile,
    addRoommatePreferences
};