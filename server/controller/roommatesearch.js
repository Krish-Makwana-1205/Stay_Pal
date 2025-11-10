const Tenant = require("../model/tenant");
const Roommate = require("../model/roommate");
const {getSimilarity} = require("../utils/nlp");

async function roommateSearch(req, res) {
    let query = req.query;

    if (!query.city) {
        return res.status(400).json({ success: false, message: "Fill all the required fields" });
    }

    query.city = query.city.trimEnd().toLowerCase();
    let roommates, emails, tenants;
    try {
        roommates = await Roommate.find({ city: query.city });

        emails = roommates.map(roommate => roommate.email);

        tenants = await Tenant.find({ email: { $in: emails } });

    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal Server Error in fetching data", error: err.message });
    }
    const calculatePoints = async (room, query) => {
        let points = 0;

        if (query.gender && room.gender) {
            if (query.gender === 'Any') {
            } else if (query.gender === room.gender) {
                points += 10;
            } else {
                points -= 5;
            }
        }

        if ((query.minAge || query.maxAge) && room.dob) {
            const currentYear = new Date().getFullYear();
            const roomAge = currentYear - new Date(room.dob).getFullYear();
            if (query.minAge && query.maxAge) {
                if (roomAge >= query.minAge && roomAge <= query.maxAge) {
                    points += 10;
                } else {
                    if (roomAge < query.minAge) {
                        points -= min(5, query.minAge - roomAge);
                    }
                    else if (roomAge > query.maxAge) {
                        points -= min(5, roomAge - query.maxAge);
                    }
                }
            } else if (query.minAge) {
                if (roomAge >= query.minAge) {
                    points += 7;
                }
                else {
                    points -= min(5, query.minAge - roomAge);
                }
            }
            else if (query.maxAge) {
                if (roomAge >= query.minAge) {
                    points += 7;
                }
                else {
                    points -= min(5, roomAge - query.maxAge);
                }
            }

        }

        // Food Preference
        if (query.foodPreference && room.foodPreference) {
            if (query.foodPreference === 'Any') {

            } else if (query.foodPreference === 'Vegan') {
                if (room.foodPreference === 'Any') {
                    points -= 3;
                }
                else if (room.foodPreference === 'Veg') {
                    points -= 2;
                }
                else if (room.foodPreference === 'Non-Veg') {
                    points -= 4;
                }
                else {
                    points += 5;
                }
            } else if (query.foodPreference === 'Veg') {
                if (room.foodPreference === 'Any') {
                    points -= 2;
                }
                else if (room.foodPreference === 'Veg') {
                    points += 5;
                }
                else if (room.foodPreference === 'Non-Veg') {
                    points -= 4;
                }
                else if (room.foodPreference === 'Vegan') {
                    points += 3;
                }
            }
            else if (query.foodPreference === 'Non-Veg') {
                if (room.foodPreference === 'Any') {

                }
                else if (room.foodPreference === 'Veg') {
                    points += 3;
                }
                else if (room.foodPreference === 'Non-Veg') {
                    points += 5;
                }
                else if (room.foodPreference === 'Vegan') {
                    points += 3;
                }
            }
        }

        // Religion
        if (query.religion && room.religion) {
            if (query.religion === 'Any') {

            } else if (query.religion === room.religion) {
                points += 10;
            }
            else if (room.religion === 'Any') {

            } else {
                points -= 5;
            }
        }

        // Alcohol
        if (query.alcohol) {

        }
        else {
            if (room.alcohol) {
            } else {
                points += 10;
            }
        }

        if (query.smoking) {

        }
        else {
            if (room.smoking) {
            } else {
                points += 10;
            }
        }


        if (query.hobbies && Array.isArray(query.hobbies) && Array.isArray(room.hobbies)) {
            const commonHobbies = query.hobbies.filter(hobby => room.hobbies.includes(hobby));
            points += commonHobbies.length * 3; // Points for each common hobby
        }

        // Nationality
        if (query.nationality && room.nationality) {
            if (query.nationality === room.nationality) {
                points += 10;
            } else {

            }
        }

        // Night Owl / Early Bird
        if (typeof query.nightOwl === 'boolean' && typeof room.nightOwl === 'boolean') {
            if (query.nightOwl === room.nightOwl) {
                points += 3; 
            } else {
            }
        }
        if (query.earlybird) {
            if (room.earlybird) {
                points += 3;
            }
            else {

            }
        }
        else {
            if (!room.earlybird) {
                points += 2;
            }
            else {

            }
        }

        if (query.Pet_lover) {
            if (room.Pet_lover) {
                points += 5;
            }
            else {

            }
        }
        else {
            if (!room.Pet_lover) {
                
            }
            else {
                points -= 3;
            }
        }

        if (query.professionalStatus)

            // Professional Status
            if (query.professionalStatus) {
                if (query.professionalStatus === 'Any') {
                    // Neutral for 'Any' status
                } else if (query.professionalStatus === room.professionalStatus) {
                    points += 5;
                } else if (room.professionalStatus == 'Any') {
                    points += 2;
                }
            }

        // Marital Status
        if (query.maritalStatus && room.maritalStatus) {
            if (query.maritalStatus === 'Any') {

            } else if (query.maritalStatus === room.maritalStatus) {
                points += 5;
            } else if (room.maritalStatus === 'Any') {
                points += 2;
            }
        }

        // Family
        if (typeof query.family === 'boolean' && typeof room.family === 'boolean') {
            if (query.family === room.family) {
                points += 5; // Both want or don't want family-oriented living
            } else {
            }
        }

        // Language
        if (query.language && room.language) {
            if (query.language === 'Any') {

            } else if (query.language === room.language) {
                points += 10;
            }
            else if (room.language === 'Any') {

            }
            else {
                points -= 3;
            }
        }

        // Fitness Freak
        if (typeof query.fitness_freak === 'boolean' && typeof room.fitness_freak === 'boolean') {
            if (query.fitness_freak) {
                if (room.fitness_freak) {
                    points += 5;
                }
            } else {
            }
        }

        // Studious
        if (typeof query.studious === 'boolean' && typeof room.studious === 'boolean') {
            if (query.studious) {
                if (room.studious) {
                    points += 5;
                }
            } else {
            }
        }

        // Party Lover
        if (typeof query.party_lover === 'boolean' && typeof room.party_lover === 'boolean') {
            if (query.party_lover) {
                if (room.party_lover) {
                    points += 5;
                }

            } else {

            }
        }

        // Min Stay Duration
        if (query.minStayDuration && room.minStayDuration) {
            if (query.minStayDuration >= room.minStayDuration) {
                points += 5;
            } else {

            }
        }
        if(query.description && room.description){
            let tem = await getSimilarity(query.description, room.description);
            tem = tem*15;
            points += tem;
        }
        return points;
    };


    let scoredRoommates = await Promise.all(
        tenants.map(async (room) => ({
            ...room.toObject(),
            points: await calculatePoints(room),
        }))
    );
    scoredRoommates.sort((a, b) => b.points - a.points);
}
