const SavedProperties = require('../model/savedProperties');
const tenant = require('../model/tenant');
const user = require('../model/user');
const Property = require('../model/property');
 
const {setUser} = require('../service/auth');
async function makeProfile(req, res){
    const body = req.body;
    const User = req.user;
    console.log(User);
    if (!User || !User.email) {
        return res.status(500).json({ message: "Error while fetching cookie data" });
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
            username: User.name || User.username || "",
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
            istenant:true
        });
    // Re-issue token with updated istenant flag; use username from decoded token (User.name)
    const token = setUser({ email: User.email, username: User.name || User.username || "", istenant: true });
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
    if (body.description) body.description =body.description.trimEnd();
    if (body.religion) body.religion =body.religion.trimEnd();
    if (body.foodPreference) body.foodPreference =body.foodPreference.trimEnd();
    if (body.workingshifts) body.workingshifts =body.workingshifts.trimEnd();

    try {
        await tenant.updateOne({email:User.email},{
            email:User.email,
            foodPreference:body.foodPreference||null,
                religion:body.religion||null,
                alcohol:typeof body.alcohol === 'boolean' ? body.alcohol : null,
                smoker:typeof body.smoker === 'boolean' ? body.smoker : null,
                nightOwl:typeof body.nightOwl === 'boolean' ? body.nightOwl : null,
                earlybird:typeof body.earlybird === 'boolean' ? body.earlybird:null,
                studious:typeof body.studious === 'boolean' ? body.studious:null,
                fitness_freak:typeof body.fitness_freak === 'boolean' ? body.fitness_freak:null,
                sporty:typeof body.sporty === 'boolean' ? body.sporty:null,
                wanderer:typeof body.wanderer === 'boolean' ? body.wanderer:null,
                party_lover:typeof body.party_lover === 'boolean' ? body.party_lover:null,
                music_lover:typeof body.music_lover === 'boolean' ? body.music_lover:null,
                hobbies:Array.isArray(body.hobbies) ? body.hobbies : [],
                allergies:Array.isArray(body.allergies) ? body.allergies : [],
                professional_status:body.professional_status||null,
                workingshifts:body.workingshifts||null,
                Pet_lover:typeof body.Pet_lover === 'boolean' ? body.Pet_lover : null,
                workPlace:body.workPlace||null,
                description:body.description||null,
                maritalStatus:body.maritalStatus||"Any",
                family:body.family,
                language:body.language
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
    if(body.description) body.description = body.description.trimEnd();
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
                earlybird:typeof body.earlybird === 'boolean' ? body.earlybird:null,
                studious:typeof body.studious === 'boolean' ? body.studious:null,
                fitness_freak:typeof body.fitness_freak === 'boolean' ? body.fitness_freak:null,
                sporty:typeof body.sporty === 'boolean' ? body.sporty:null,
                wanderer:typeof body.wanderer === 'boolean' ? body.wanderer:null,
                party_lover:typeof body.party_lover === 'boolean' ? body.party_lover:null,
                music_lover:typeof body.music_lover === 'boolean' ? body.music_lover:null,
                hobbies:Array.isArray(body.hobbies) ? body.hobbies : [],
                allergies:Array.isArray(body.allergies) ? body.allergies : [],
                professional_status:body.professional_status||null,
                workingshifts:body.workingshifts||null,
                Pet_lover:typeof body.Pet_lover === 'boolean' ? body.Pet_lover : null,
                workPlace:body.workPlace||null,
                description:body.description||null,
                maritalStatus:body.maritalStatus||"Any",
                family:body.family,
                language:body.language
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

        // Re-issue token preserving username/name and istenant flag
        const token = setUser({
          email: User.email,
          username: User.name || User.username || "",
          istenant: true
        });
        res.cookie('uid', token);
    }catch(error){
        console.log(error.message);
        return res.status(500).json({message:"Error in contacting Database",error:error.message});
    }

    return res.status(200).json({success:true, message:"Profile saved successfully"});
}

async function tenantdetails(req, res){
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
async function saveProperties(req, res){
    if(!req.body.email || !req.body.name){
        return res.status(400).json({success:false, message:"Missing fields"});
    }
    if(!req.user.email){
        return res.status(400).json({success:false, message:"Error in fetching cookie data"})
    }
    try {
        const propemail = req.body.email;
        const propname = req.body.name;

        const savedProperty = await SavedProperties.findOneAndUpdate(
            { email: req.user.email }, 
            { $push: { properties: { propemail, propname } } }, 
            {upsert: true } 
        );

        return res.status(200).json({
            success: true,
            message: "Property added successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}

async function sendProperties(req, res){
    if(!req.user.email){
        return res.status(500).json('Error in fetching cookie data');
    }
    const props = await SavedProperties.find({email:req.user.email});
    try {
        if (props.length === 0) {
            return res.status(200).json({ success: true, message: 'No saved properties found' });
        }
        const propertyNamesAndEmails = props.map(prop => ({
            propertyName: prop.propertyName,  
            email: prop.email                 
        }));

       
        const properties = await Property.find({
            
            $and: propertyNamesAndEmails.map(pair => ({
                name: pair.propertyName,
                email: pair.email
            }))
        });

        
        if (properties.length === 0) {
            return res.status(200).json({ success: true, message: 'No matching properties found (probably deleted)' });
        }

        return res.status(200).json({
            success: true,
            message: 'Properties fetched successfully',
            data: properties,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }

}
module.exports = {
    makeProfile,
    addPreferences, 
    tenantdetails,
    fullProfile,
    saveProperties,
    sendProperties
};