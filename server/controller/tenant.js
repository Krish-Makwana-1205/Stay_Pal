const tenant = require('../model/tenant');
const user = require('../model/user');
const {setUser} = require('../service/auth');
async function makeProfile(req, res){
    const body = req.body;
    const User = req.user;
    console.log(User);
    if((!User.email) || (!User.name)){
        return res.status(500).json({message:"Error while fetching cookie data"});
    }
    console.log('here');
    if((!body.nationality) || (!body.hometown) || (!body.gender) || (!body.dob)){
        return res.status(400).json({message:"Did not receive all the required form fields"});
    }
    body.nationality = body.nationality.trimEnd();
    body.hometown = body.hometown.trimEnd();
    body.gender = body.gender.trimEnd();
    console.log(User);
    try{
         console.log(User);
        await tenant.findOneAndUpdate({email:User.email},{
            email:User.email,
            username:User.name,
            dob:body.dob,
            nationality:body.nationality,
            hometown:body.hometown,
            gender:body.gender
        }, {upsert:true, new:true});
    }catch(error){
        console.log(error.message);
        console.log('hi');
        return res.status(500).json({message:"Error in contacting Database", error:error.message});
    }
    
    try{
        await user.findOneAndUpdate({email:User.email},{
            istenant:true
        });
    // Re-issue token with updated istenant flag; use username from decoded token (User.name)
    const token = setUser({ email: User.email, username: User.name || User.username, istenant: true });
    res.cookie('uid', token);
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({message:"Error in contacting Database",error:error.message});
    }
    return res.status(200).json({message:"success"});
}
async function addPreferences(req, res){
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
        await tenant.updateOne({email:User.email},{
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
            descriptions:body.descriptions||null,
            maritalStatus:body.maritalStatus||"Any",
            family:body.family,
            language:body.language,
            minStayDuration:body.minStayDuration
        },{upsert:true, new:true});
    } catch(error){
        res.status(500).json({message:"Error in contacting Database", error:error.message});
    }


    return res.status(200).json({ success: true, message: "Profile created successfully" });
}

async function fullProfile(req, res) {
    const body = req.body;
    const User = req.user;

    if((!User.email) || (!User.name)){
        return res.status(500).json({message:"Error while fetching cookie data"});
    }

    if((!body.nationality) || (!body.hometown) || (!body.gender) || (!body.dob)){
        return res.status(400).json({message:"Did not receive all the required form fields"});
    }

    if(body.nationality) body.nationality = body.nationality.trimEnd();
    if(body.hometown) body.hometown = body.hometown.trimEnd();
    if(body.gender) body.gender = body.gender.trimEnd();
    if(body.professional_status) body.professional_status = body.professional_status.trimEnd();
    if(body.workPlace) body.workPlace = body.workPlace.trimEnd();
    if(body.descriptions) body.descriptions = body.descriptions.trimEnd();
    if(body.religion) body.religion = body.religion.trimEnd();
    if(body.foodPreference) body.foodPreference = body.foodPreference.trimEnd();
    if(body.workingshifts) body.workingshifts = body.workingshifts.trimEnd();

    try{
        await tenant.findOneAndUpdate(
            {email:User.email},
            {
                email:User.email,
                username:User.name,
                dob:body.dob,
                nationality:body.nationality,
                hometown:body.hometown,
                gender:body.gender,

                foodPreference:body.foodPreference||null,
                religion:body.religion||null,
                alcohol:typeof body.alcohol === 'boolean' ? body.alcohol : null,
                smoker:typeof body.smoker === 'boolean' ? body.smoker : null,
                nightOwl:typeof body.nightOwl === 'boolean' ? body.nightOwl : null,
                hobbies:Array.isArray(body.hobbies) ? body.hobbies : [],
                professional_status:body.professional_status||null,
                workingshifts:body.workingshifts||null,
                havePet:typeof body.havePet === 'boolean' ? body.havePet : null,
                workPlace:body.workPlace||null,
                descriptions:body.descriptions||null,
                maritalStatus:body.maritalStatus||"Any",
                family:body.family,
                language:body.language,
                minStayDuration:body.minStayDuration
            },
            {upsert:true, new:true}
        );
    }catch(error){
        console.log(error.message);
        return res.status(500).json({message:"Error in contacting Database", error:error.message});
    }

    try{
        await user.findOneAndUpdate({email:User.email},{
            istenant:true
        });

        const token = setUser(User.email); 
        res.cookie('uid', token);
    }catch(error){
        console.log(error.message);
        return res.status(500).json({message:"Error in contacting Database",error:error.message});
    }

    return res.status(200).json({success:true, message:"Profile saved successfully"});
}

async function tenantdetails(req, res){
    console.log(req.user);
    let temp;
    try{
        temp = await tenant.findOne({email:req.user.email});
    }catch(error){
        res.status(500).json({message:"Error in contacting Database", error:error.message});
    }
    return res.status(200).json({
        tenant:temp,
        success:true
    })
}
module.exports = {
    makeProfile,
    addPreferences, 
    tenantdetails,
    fullProfile
};