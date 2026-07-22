const { UserSchema } = require("../models/index");
const databases = require("../services/mongo.databases");
const { JsonDatabase } = require("wio.db");

const tours = new JsonDatabase({ databasePath: "./src/shared/tournamentx.json" });

class controller {
    static async FinishRoundV3(req, res) {
    try {
        const { region, appId, sessionId } = req.params;
        const { Round, GameType, LevelIds } = req.body;
        
        const DeviceToken = req.headers['x-stumble-device-token'];
        
        if (!DeviceToken) {
            return res.status(400).json({ message: "Device Token is missing" });
        }
        
        const db = databases.stumble();
        const users = db.models.users || db.model("users", UserSchema);
        
        let trophiesGain = 0;
        let crownsGain = 0;
        let xpGain = 50;
        
        if (Round === 0) {
            trophiesGain = 10;
        } else if (Round === 1) {
            trophiesGain = 20;
        } else if (Round >= 2) { 
            trophiesGain = 35;
            crownsGain = 1;
            xpGain = 150;
        }
        
        const updatedUser = await users.findOneAndUpdate(
            { DeviceToken: DeviceToken }, 
            { 
                $inc: { 
                    SkillRating: trophiesGain, 
                    Crowns: crownsGain,
                    Experience: xpGain 
                } 
            },
            { new: true }
        );
        
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found with this device token" });
        }
        
        console.log(`[ROUND FINISH] Player: ${updatedUser.Username} | Round: ${Round} | Trophies: +${trophiesGain}`);
        
        return res.status(200).json({
            "User": {
                "Id": updatedUser.StumbleId,
                "Username": updatedUser.Username,
                "SkillRating": updatedUser.SkillRating,
                "Crowns": updatedUser.Crowns,
                "Experience": updatedUser.Experience,
                "Level": Math.floor(updatedUser.Experience / 1000),
                "CurrentLevel": Math.floor(updatedUser.Experience / 1000),
                "NextLevelExperience": 1000
            },
            "Rewards": [
                { "Type": "SkillRating", "Amount": trophiesGain },
                { "Type": "Crowns", "Amount": crownsGain },
                { "Type": "Experience", "Amount": xpGain }
            ],
            "ExperienceGain": xpGain,
            "SkillRatingGain": trophiesGain,
            "CrownsGain": crownsGain,
            "MissionsProgression": [],
            "FriendCount": 0
        });
    } catch (err) {
        console.error('[ERROR ROUND]:', err);
        return res.status(500).json({ message: "Internal Error" });
    }
    }
    
    static async FinishRoundV2(req, res) {
    try {
        const { TournamentId, EntryToken, Round, SignedPayload } = req.body;
        const deviceToken = req.headers['x-stumble-device-token'];

        const db = databases.stumble();
        const UserModel = db.models.users || db.model("users", UserSchema);
        const user = await UserModel.findOne({ DeviceToken: deviceToken });

        if (!user) return res.status(404).json({ message: "User_Not_Found" });

        const allTours = await tours.all();
        const tourEntry = allTours.find(t => t.data.id === TournamentId);
        
        if (!tourEntry) return res.status(404).json({ message: "Torneio não encontrado" });
        const tournament = tourEntry.data;

        let gemsAwarded = 0;
        let crownsAwarded = 0;
        let trophiesAwarded = 0;

        if (parseInt(Round) === 1) {
            gemsAwarded = 50; 
            crownsAwarded = 1;
            trophiesAwarded = 15;
            console.log(`[WINNER] ${user.Username} ganhou o X1! +1 Coroa`);
        } else {
            trophiesAwarded = 5;
            console.log(`[LOSER] ${user.Username} perdeu o X1.`);
        }

        const currentCrowns = parseInt(user.Crowns || user.userProfile?.crowns) || 0;
        const currentTrophies = parseInt(user.Trophies || user.userProfile?.trophies) || 0;

        await UserModel.findOneAndUpdate(
            { DeviceToken: deviceToken },
            { 
                $set: { 
                    Crowns: currentCrowns + crownsAwarded,
                    Trophies: currentTrophies + trophiesAwarded
                }
            }
        );

        if (gemsAwarded > 0) {
            // setar gems (nao precisa)
        }

        const partyIdInToken = EntryToken.split(`room-${TournamentId}-`)[1] || EntryToken;
        
        if (Array.isArray(tournament.partys)) {
            tournament.partys = tournament.partys.filter(p => {
                const pId = Array.isArray(p) ? p[0].partyId : p.partyId;
                return pId !== partyIdInToken;
            });
        }

        await tours.set(tourEntry.ID, tournament);

        return res.status(200).json({
            TournamentId,
            Round: parseInt(Round),
            EntryToken,
            SignedPayload,
            Awards: [
                { type: "CROWNS", amount: crownsAwarded },
                { type: "TROPHIES", amount: trophiesAwarded }
            ]
        });

    } catch (err) {
        console.error('[ERROR FINISH V2]:', err);
        return res.status(500).json({ message: "Erro interno" });
    }
}
    
    static async CustomRoundFinish(req, res) {
        try {
            const { region, appId, sessionId } = req.params;
            const { Round, GameType, LevelIds } = req.body;
            
            return res.status(200).json({ Round, GameType,  LevelIds });
        } catch (err) {
            console.error('[ERROR ROUND]:', err);
            return res.status(500).json({ message: "Internal Error" });
        }
    }
}

module.exports = controller;