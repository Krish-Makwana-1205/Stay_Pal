const Tenant = require("../model/tenant");
const Roommate = require("../model/roommate");
const User = require("../model/user");
const { getSimilarity } = require("../utils/nlp");
const { sendEmail } = require('../utils/mailer');
const RoommateApplication = require("../model/roommateApplication");
const { profile } = require("console");


// Assuming you have a RoommateApplication model similar to Application
// const RoommateApplication = require("../models/RoommateApplication");

async function applyForRoommate(req, res) {
    console.log('hello');
    try {
        console.log('hi');
        const applicantEmail = req.user.email;
        const { recipientEmail } = req.body;
        console.log(req.body);
        console.log(90);
        if (!applicantEmail) {
            return res
                .status(400)
                .json({ success: false, message: "User not logged in" });
        }

        if (!recipientEmail) {
            return res.status(400).json({
                success: false,
                message: "Recipient email required",
            });
        }

        if (applicantEmail === recipientEmail) {
            return res.status(400).json({
                success: false,
                message: "You cannot send a roommate request to yourself",
            });
        }

        const applicant = await Tenant.findOne({ email: applicantEmail });

        if (!applicant) {
            return res.status(404).json({
                success: false,
                message: "Applicant profile not found",
            });
        }

        await RoommateApplication.create({
            applicantEmail,
            recipientEmail,
        });
        console.log('run');
        sendEmail(
            recipientEmail,
            "New Roommate Request",
            `
        <h2>New Roommate Request</h2>
        <p>You have received a new roommate request.</p>

        <h3>Applicant Details</h3>
        <p><strong>Name:</strong> ${applicant.name}</p>
        <p><strong>Email:</strong> ${applicant.email}</p>
        <p><strong>Gender:</strong> ${applicant.gender}</p>
        <p><strong>Marital Status:</strong> ${applicant.maritalStatus}</p>
        <p><strong>Profession:</strong> ${applicant.professionalStatus}</p>
        <p><strong>Food Preference:</strong> ${applicant.foodPreference}</p>
        <p><strong>Work Shift:</strong> ${applicant.workingshifts}</p>
        <p><strong>Languages:</strong> ${applicant.language}</p>

        <br><p>Contact the applicant to proceed.</p>
      `
        );

        return res.status(200).json({
            success: true,
            message: "Roommate request sent successfully",
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "You have already sent a roommate request to this person.",
            });
        }
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

async function roommateSearch(req, res) {
    console.log("run");

    try {
        let query = req.query;

        if (!query.city) {
            return res
                .status(400)
                .json({ success: false, message: "Fill all the required fields" });
        }

        query.city = query.city.trimEnd().toLowerCase();

        let roommates, emails, tenants;
        let userMap;
        // ------------ FETCH DATA ------------
        try {
            roommates = await Roommate.find({ city: query.city });
            emails = roommates.map((roommate) => roommate.email);

            tenants = await Tenant.find({ email: { $in: emails } });
            // if you ever need basic user info too:
            const users = await User.find({ email: { $in: emails } });
            userMap = new Map(users.map(u => [u.email, u]));
        } catch (err) {
            console.error("Error fetching roommates/tenants:", err);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error in fetching data",
                error: err.message,
            });
        }

        // ------------ BASIC POINTS (cheap) ------------
        function calculateBasicPoints(room) {
            let points = 0;

            // ---- Age ----
            if ((query.minAge || query.maxAge) && room.dob) {
                const currentYear = new Date().getFullYear();
                const roomAge = currentYear - new Date(room.dob).getFullYear();

                const qMin = query.minAge ? Number(query.minAge) : null;
                const qMax = query.maxAge ? Number(query.maxAge) : null;

                if (qMin && qMax) {
                    if (roomAge >= qMin && roomAge <= qMax) {
                        points += 10;
                    } else {
                        if (roomAge < qMin) {
                            points -= Math.min(5, qMin - roomAge);
                        } else if (roomAge > qMax) {
                            points -= Math.min(5, roomAge - qMax);
                        }
                    }
                } else if (qMin) {
                    if (roomAge >= qMin) {
                        points += 7;
                    } else {
                        points -= Math.min(5, qMin - roomAge);
                    }
                } else if (qMax) {
                    if (roomAge <= qMax) {
                        points += 7;
                    } else {
                        points -= Math.min(5, roomAge - qMax);
                    }
                }
            }

            // ---- Gender ----
            if (query.gender && room.gender) {
                if (query.gender === "Any") {
                    // neutral
                } else if (query.gender === room.gender) {
                    points += 10;
                } else {
                    points -= 5;
                }
            }

            // ---- Food Preference ----
            if (query.foodPreference && room.foodPreference) {
                const qFood = query.foodPreference;
                const rFood = room.foodPreference;

                if (qFood === "Any") {
                    // neutral
                } else if (qFood === "Vegan") {
                    if (rFood === "Any") points -= 3;
                    else if (rFood === "Veg") points -= 2;
                    else if (rFood === "Non-Veg") points -= 4;
                    else if (rFood === "Jain") points -= 2;
                    else points += 5; // Vegan-Vegan
                } else if (qFood === "Veg") {
                    if (rFood === "Any") points -= 2;
                    else if (rFood === "Veg") points += 5;
                    else if (rFood === "Jain") points += 3;
                    else if (rFood === "Non-Veg") points -= 4;
                    else if (rFood === "Vegan") points += 3;
                } else if (qFood === "Non-Veg") {
                    if (rFood === "Any") {
                        // neutral
                    } else if (rFood === "Veg") points += 3;
                    else if (rFood === "Non-Veg") points += 5;
                    else if (rFood === "Jain") points += 2;
                    else if (rFood === "Vegan") points += 3;
                } else if (qFood === "Jain") {
                    if (rFood === "Any") {
                        // neutral
                    } else if (rFood === "Veg") points -= 3;
                    else if (rFood === "Non-Veg") points -= 5;
                    else if (rFood === "Jain") points += 5;
                    else if (rFood === "Vegan") points -= 3;
                }
            }

            // ---- Religion ----
            if (query.religion && room.religion) {
                if (query.religion === "Any") {
                    // neutral
                } else if (query.religion === room.religion) {
                    points += 10;
                } else if (room.religion === "Any") {
                    // neutral
                } else {
                    points -= 5;
                }
            }

            // ---- Alcohol ----
            if (!query.alcohol) {
                // user prefers no alcohol
                if (!room.alcohol) {
                    points += 10;
                }
            }
            // if query.alcohol == true => neutral / your previous logic

            // ---- Smoking ----
            if (!query.smoking) {
                if (!room.smoking) {
                    points += 10;
                }
            }

            // ---- Hobbies ----
            if (query.hobbies && Array.isArray(query.hobbies) && Array.isArray(room.hobbies)) {
                const commonHobbies = query.hobbies.filter((hobby) =>
                    room.hobbies.includes(hobby)
                );
                points += commonHobbies.length * 3;
            }

            // ---- Nationality ----
            if (query.nationality && room.nationality) {
                if (query.nationality === room.nationality) {
                    points += 10;
                }
            }

            // ---- Night Owl / Early Bird ----
            if (typeof query.nightOwl === "boolean" && typeof room.nightOwl === "boolean") {
                if (query.nightOwl === room.nightOwl) {
                    points += 3;
                }
            }

            if (typeof query.earlybird === "boolean") {
                if (query.earlybird && room.earlybird) {
                    points += 3;
                } else if (!query.earlybird && !room.earlybird) {
                    points += 2;
                }
            }

            // ---- Pet Lover ----
            if (typeof query.Pet_lover === "boolean") {
                if (query.Pet_lover && room.Pet_lover) {
                    points += 5;
                } else if (!query.Pet_lover && room.Pet_lover) {
                    points -= 3;
                }
            }

            // ---- Professional Status ----
            if (query.professionalStatus && room.professionalStatus) {
                if (query.professionalStatus === "Any") {
                    // neutral
                } else if (query.professionalStatus === room.professionalStatus) {
                    points += 5;
                } else if (room.professionalStatus === "Any") {
                    points += 2;
                }
            }

            // ---- Marital Status ----
            if (query.maritalStatus && room.maritalStatus) {
                if (query.maritalStatus === "Any") {
                    // neutral
                } else if (query.maritalStatus === room.maritalStatus) {
                    points += 5;
                } else if (room.maritalStatus === "Any") {
                    points += 2;
                }
            }

            // ---- Family ----
            if (typeof query.family === "boolean" && typeof room.family === "boolean") {
                if (query.family === room.family) {
                    points += 5;
                }
            }

            // ---- Language ----
            if (query.language && room.language) {
                if (query.language === "Any") {
                    // neutral
                } else if (query.language === room.language) {
                    points += 10;
                } else if (room.language === "Any") {
                    // neutral
                } else {
                    points -= 3;
                }
            }

            // ---- Fitness Freak ----
            if (
                typeof query.fitness_freak === "boolean" &&
                typeof room.fitness_freak === "boolean"
            ) {
                if (query.fitness_freak && room.fitness_freak) {
                    points += 5;
                }
            }

            // ---- Studious ----
            if (typeof query.studious === "boolean" && typeof room.studious === "boolean") {
                if (query.studious && room.studious) {
                    points += 5;
                }
            }

            // ---- Party Lover ----
            if (
                typeof query.party_lover === "boolean" &&
                typeof room.party_lover === "boolean"
            ) {
                if (query.party_lover && room.party_lover) {
                    points += 5;
                }
            }

            // ---- Allergies ----
            if (query.allergies && Array.isArray(query.allergies) && Array.isArray(room.allergies)) {
                const commonAllergies = query.allergies.filter((a) =>
                    room.allergies.includes(a)
                );
                points += commonAllergies.length * 3;
            }

            // ---- Min Stay Duration ----
            if (query.minStayDuration && room.minStayDuration) {
                const qMinStay = Number(query.minStayDuration);
                if (qMinStay <= room.minStayDuration) {
                    points += 5;
                }
            }

            return points;
        }

        // ------------ HEAVY REFINEMENT (NLP etc.) ------------
        async function refinePoints(room, basePoints) {
            let points = basePoints;

            // NLP on description (same idea as filterProperties)
            if (query.description && room.description) {
                const easyScore = await getSimilaritySimple(
                    query.description,
                    room.description
                );
                let finalNlpScore = easyScore;

                if (easyScore >= 0.85) {
                    const complexScore = await getSimilarity(
                        query.description,
                        room.description
                    );
                    finalNlpScore = complexScore;
                }

                // scale like in filterProperties (18 was used there, you used 15 earlier)
                points += finalNlpScore * 18;
            }

            // If later you add coordinates/distance logic for roommates,
            // you can plug distance_Scoring here like in filterProperties.

            return points;
        }

        // ------------ BASE SCORING FOR ALL TENANTS ------------
        let baseScored = tenants.map((room) => ({
            room,
            basePoints: calculateBasicPoints(room),

        }));

        // Sort by basic points
        baseScored.sort((a, b) => b.basePoints - a.basePoints);

        // ------------ REFINE TOP N ONLY ------------
        const TOP_N = 10;
        const topForRefine = baseScored.slice(0, TOP_N);

        const refinedTop = await Promise.all(
            topForRefine.map(async (item) => {
                const finalPoints = await refinePoints(item.room, item.basePoints);
                return {
                    id: String(item.room._id),
                    points: finalPoints,
                };
            })
        );

        const refinedMap = new Map(refinedTop.map((r) => [r.id, r.points]));

        // ------------ MERGE + FINAL SORT ------------
        let scoredRoommates = baseScored.map((item) => {
            const id = String(item.room._id);
            const finalPoints = refinedMap.has(id)
                ? refinedMap.get(id)
                : item.basePoints;

            const email = item.room.email;
            const user = userMap.get(email);
            return {
                ...item.room.toObject(),
                points: finalPoints,
                imgLink: user?.profilePhoto || null
            };
        });

        scoredRoommates.sort((a, b) => b.points - a.points);

        console.log("finish");
        console.log(scoredRoommates);
        return res.status(200).json({
            success: true,
            count: scoredRoommates.length,
            data: scoredRoommates,

        });
    } catch (error) {
        console.error("Error in roommateSearch:", error);
        return res.status(500).json({
            success: false,
            message: "Error in roommate search",
            error: error.message,
        });
    }
}


async function roommateUpload(req, res) {
    try {
        const body = req.body;

        // Required fields
        if (!body.rentupper || !body.rentlower || !body.city) {
            return res
                .status(400)
                .json({ success: false, message: "Required fields not filled" });
        }

        if (!req.user?.email) {
            return res
                .status(500)
                .json({ success: false, message: "Cookie data not received" });
        }

        // Normalize city input
        const city = body.city.trim().toLowerCase();

        // Create the roommate listing
        await Roommate.create({
            email: req.user.email,
            city,
            rentlower: body.rentlower,
            rentupper: body.rentupper,
        });

        return res
            .status(200)
            .json({ success: true, message: "Roommate listing created" });

    } catch (error) {
        console.error("Roommate upload failed:", error);
        return res
            .status(500)
            .json({ success: false, message: "Could not post roommate" });
    }
}

async function getlistings(req, res) {
    if (!req.user.email) {
        return res.status(500).json({ success: false, message: 'Error while fetching cookie data' });
    }
    console.log(req.user.email)
    try {
        const listings = await Roommate.find({ email: req.user.email });
        console.log(listings)
        return res.status(200).json({ success: true, message: 'fetch successfull', data: listings });
    }
    catch (e) {
        console.log("run")
        return res.status(500).json({ success: false, error: e, message: 'error while fetching data' });
    }

}

async function updatelisting(req, res) {
    try {
        const body = req.body;

        // Required fields
        if (!body.rentupper || !body.rentlower || !body.city) {
            return res.status(400).json({ success: false, message: "Required fields not filled" });
        }

        if (!req.user?.email) {
            return res.status(500).json({ success: false, message: "Cookie data not received" });
        }

        // Normalize city input
        const city = body.city.trim().toLowerCase();

        // Create the roommate listing
        await Roommate.findOneAndUpdate({ email: req.user.email, city: body.city }, {
            email: req.user.email,
            city,
            rentlower: body.rentlower,
            rentupper: body.rentupper,
        });

        return res.status(200).json({ success: true, message: "Roommate listing updated" });

    } catch (error) {
        console.error("Roommate upload failed:", error);
        return res.status(500).json({ success: false, message: "Could not post roommate property", error: error });
    }
}
async function deletelisting(req, res) {
    try {
        const body = req.body;

        if (!req.user?.email) {
            return res.status(500).json({ success: false, message: "Cookie data not received" });
        }

        // Normalize city input
        const city = body.city.trim().toLowerCase();

        // Create the roommate listing
        await Roommate.findOneAndDelete({ email: req.user.email, city: body.city });

        return res.status(200).json({ success: true, message: "Roommate listing deleted" });

    } catch (error) {
        console.error("Roommate delete failed:", error);
        return res.status(500).json({ success: false, message: "Could not delete roommate property", error: error });
    }
}
module.exports = {
    roommateUpload,
    roommateSearch,
    getlistings,
    updatelisting,
    deletelisting,
    applyForRoommate
}