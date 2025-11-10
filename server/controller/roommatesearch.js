const Tenant = require("../model/tenant");
const Roommate = require("../model/roommate");


async function roommateSearch(req, res) {
    let query = req.query;

    // Ensure that the city query parameter is provided
    if (!query.city) {
        return res.status(400).json({ success: false, message: "Fill all the required fields" });
    }

    // Clean up and normalize the city value
    query.city = query.city.trimEnd().toLowerCase();

    try {
        let roommates = await Roommate.find({ city: query.city });

        let emails = roommates.map(roommate => roommate.email);

        let tenants = await Tenant.find({ email: { $in: emails } });

    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal Server Error in fetching data", error: err.message });
    }
    const calculatePoints = async (room) => {
        let points = 0;
        if(query.gender && room.gender){
            if(query.gender == 'Any'){

            }
            else if(query.gender == room.gender){
                points += 15;
            }
            else{
                points -= 10; 
            }
        }
        
    }
    const scoredRoommates = tenants.map((room) => ({
        ...room.toObject(),
        points: calculatePoints(room),
    }))
}
