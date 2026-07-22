const { UserSchema } = require("../models/index");
const databases = require("../services/mongo.databases");

class controller {
    static async GetTrophyRanking(req, res) {
        const country = req.query.country;
        const DeviceToken = req.headers['x-stumble-device-token'];
        
        try {
            const db = databases.stumble();
            const UserModel = db.models.users || db.model("users", UserSchema);
            
            // LOCAL
            if (country && country.trim() !== "") {
                const player = await UserModel.findOne({ "DeviceToken": DeviceToken });
                
                if (!player) {
                    return res.json({ TotalConnected: 0, Scores: [] });
                }
                
                const position = await UserModel.countDocuments({
                    Country: country,
                    SkillRating: { $gt: player.SkillRating }
                }) + 1;
                
                return res.json({
                    TotalConnected: 1,
                    Scores: [{
                        User: {
                            Id: player.Id,
                            Username: player.Username,
                            Country: player.Country,
                            SkillRating: player.SkillRating,
                            Crowns: player.Crowns
                        },
                        Score: player.SkillRating,
                        Rank: position
                    }]
                });
            }
            
            // GLOBAL
            const topPlayers = await UserModel.find()
            .sort({ SkillRating: -1 })
            .limit(100);
            
            const scores = topPlayers.map((player, index) => ({
                User: {
                    Id: player.Id,
                    Username: player.Username,
                    Country: player.Country,
                    SkillRating: player.SkillRating,
                    Crowns: player.Crowns
                },
                Score: player.SkillRating,
                Rank: index + 1
            }));
            
            return res.json({
                TotalConnected: scores.length,
                Scores: scores
            });
        } catch (err) {
            console.error("❌ Erro no Ranking Local/Global:", err);
            return res.status(500).json({ error: "Erro interno" });
        }
    }
    
    static async GetCrownsRanking(req, res) {
        const country = req.query.country;
        const DeviceToken = req.headers['x-stumble-device-token'];
        
        try {
            const db = databases.stumble();
            const UserModel = db.models.users || db.model("users", UserSchema);
            
            // LOCAL
            if (country && country.trim() !== "") {
                const player = await UserModel.findOne({ "DeviceToken": DeviceToken });
                
                if (!player) {
                    return res.json({ TotalConnected: 0, Scores: [] });
                }
                
                const position = await UserModel.countDocuments({
                    Country: country,
                    Crowns: { $gt: player.Crowns }
                }) + 1;
                
                return res.json({
                    TotalConnected: 1,
                    Scores: [{
                        User: {
                            Id: player.Id,
                            Username: player.Username,
                            Country: player.Country,
                            SkillRating: player.SkillRating,
                            Crowns: player.Crowns
                        },
                        Score: player.Crowns,
                        Rank: position
                    }]
                });
            }
            
            // GLOBAL
            const topPlayers = await UserModel.find()
            .sort({ Crowns: -1 })
            .limit(100);
            
            const scores = topPlayers.map((player, index) => ({
                User: {
                    Id: player.Id,
                    Username: player.Username,
                    Country: player.Country,
                    SkillRating: player.SkillRating,
                    Crowns: player.Crowns
                },
                Score: player.Crowns,
                Rank: index + 1
            }));
            
            return res.json({
                TotalConnected: scores.length,
                Scores: scores
            });
        } catch (err) {
            console.error("❌ Erro no CrownsList:", err);
            return res.status(500).json({ error: "Erro interno no servidor" });
        }
    }
}

module.exports = controller;