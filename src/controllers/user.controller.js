const path = require("path");
const crypto = require("../modules/crypto.modules");
const geoip = require('geoip-lite');

const { UserSchema } = require("../models/index");
const databases = require("../services/mongo.databases");

const SharedData = require("../shared/config.json");

class controller {
    static async Login(req, res) {
        const { DeviceId, Version } = req.body;
        const headers = req.headers;
        const userAgent = headers['user-agent'] || '';
        const ip = (headers['x-forwarded-for'] || req.socket.remoteAddress).replace(/^.*:/, '');
        const DeviceToken = headers['x-stumble-device-token'];
        
        if (userAgent.includes('Postman') || userAgent.includes('axios') || userAgent.includes('curl')) {
            return res.status(403).json({ Reply: crypto.GenerateNewReply() });
        }
        
        if (!userAgent.startsWith('Unity')) {
            return res.status(403).json({ Reply: crypto.GenerateNewReply() });
        }
        
        if (!DeviceId || !Version) {
            return res.status(400).json({ Reply: crypto.GenerateNewReply() });
        }
        
        if (!DeviceToken || DeviceToken.length < 32) {
            return res.status(403).json({ Reply: crypto.GenerateNewReply() });
        }
        
        const geo = geoip.lookup(ip);
        const country = geo ? geo.country : "BR";
        
        try {
            const db = databases.stumble();
            const users = db.models.users || db.model("users", UserSchema);
            
            let userDb = await users.findOne({ DeviceId });
            
            if (!userDb) {
                const accountsWithThisDevice = await users.countDocuments({ DeviceToken, IP: ip });
                if (accountsWithThisDevice >= 2) {
                    // Limite de contas atingido para este dispositivo.
                    return res.status(403).json({ Reply: crypto.GenerateNewReply() });
                }
                
                const totalUsers = await users.countDocuments();
                const nextId = 1 + totalUsers;
                
                userDb = await users.create({
                    Id: nextId,
                    Username: `StumbleKing<sup><color=orange>#${userId}`,
                    DeviceId: DeviceId,
                    StumbleId: crypto.generateStumbleId(),
                    Country: country,
                    IP: ip,
                    DeviceToken: DeviceToken
                });
            } else if (DeviceToken && userDb.DeviceToken !== DeviceToken) {
                userDb.DeviceToken = DeviceToken;
                await userDb.save();
                console.log(`[AUTH] DeviceToken atualizado para o usuário: ${userDb.Username}`);
            }
            
            const now = new Date();
            
            const response = {
                User: {
                    Id: userDb.Id,
                    Username: userDb.Username,
                    DeviceId: userDb.DeviceId,
                    Country: userDb.Country,
                    SkillRating: userDb.SkillRating,
                    Experience: 0,
                    Crowns: userDb.Crowns,
                    Balances: [
                        { Name: "gems", Amount: userDb.Gems, secondsSince: 0, secondsPerUnit: 0, maxAmount: 0, lastGiven: now },
                        { Name: "dust", Amount: userDb.Tokens, secondsSince: 0, secondsPerUnit: 0, maxAmount: 0, lastGiven: now },
                        
                        { Name: "coins", Amount: 500000, secondsSince: 0, secondsPerUnit: 0, maxAmount: 0, lastGiven: now },
                        { Name: "stumble_coins", Amount: 0, secondsSince: 0, secondsPerUnit: 0, maxAmount: 0, lastGiven: now },
                        { Name: "remove_ads", Amount: 0, secondsSince: 0, secondsPerUnit: 0, maxAmount: 2, lastGiven: now },
                        { Name: "video", Amount: 50, secondsSince: 0, secondsPerUnit: 0, maxAmount: 5000, lastGiven: now },
                        { Name: "video_gems", Amount: 10, secondsSince: 0, secondsPerUnit: 5400, maxAmount: 10, lastGiven: now },
                        { Name: "video_coins", Amount: 8, secondsSince: 0, secondsPerUnit: 10800, maxAmount: 8, lastGiven: now },
                        { Name: "special_video", Amount: 3, secondsSince: 0, secondsPerUnit: 28800, maxAmount: 3, lastGiven: now },
                        { Name: "skin_charge", Amount: 0, secondsSince: 0, secondsPerUnit: 0, maxAmount: 5, lastGiven: now },
                        { Name: "skin_purchase", Amount: 7, secondsSince: 0, secondsPerUnit: 86400, maxAmount: 7, lastGiven: now },
                        { Name: "gem_charge", Amount: 0, secondsSince: 0, secondsPerUnit: 0, maxAmount: 3, lastGiven: now },
                        { Name: "gem_purchase", Amount: 1, secondsSince: 0, secondsPerUnit: 86400, maxAmount: 1, lastGiven: now },
                        { Name: "default_free_spins", Amount: 1, secondsSince: 0, secondsPerUnit: 0, maxAmount: 1, lastGiven: new Date(Date.now() - 86400000) },
                        { Name: "default_free_ad_spins", Amount: 16, secondsSince: 0, secondsPerUnit: 0, maxAmount: 16, lastGiven: new Date(Date.now() - 86400000) },
                        { Name: "remove_interstitial_ads", Amount: 0, secondsSince: 0, secondsPerUnit: 0, maxAmount: 2, lastGiven: now },
                        { Name: "end_of_match", Amount: 0, secondsSince: 0, secondsPerUnit: 0, maxAmount: 1, lastGiven: now },
                        { Name: "end_of_match_event", Amount: 0, secondsSince: 0, secondsPerUnit: 0, maxAmount: 1, lastGiven: now },
                        { Name: "tournament_ticket_rare", Amount: 0, secondsSince: 0, secondsPerUnit: 0, maxAmount: 0, lastGiven: now },
                        { Name: "tournament_ticket_legendary", Amount: 0, secondsSince: 0, secondsPerUnit: 0, maxAmount: 0, lastGiven: now },
                        { Name: "video_coins_02", Amount: 5, secondsSince: 0, secondsPerUnit: 28800, maxAmount: 5, lastGiven: now },
                        { Name: "aes", Amount: 0, secondsSince: 0, secondsPerUnit: 0, maxAmount: 0, lastGiven: now },
                        { Name: "aec", Amount: 0, secondsSince: 0, secondsPerUnit: 0, maxAmount: 0, lastGiven: now },
                        { Name: "ranked_friend_boost", Amount: 3, secondsSince: 0, secondsPerUnit: 86400, maxAmount: 3, lastGiven: now },
                        { Name: "dust_backup", Amount: 0, secondsSince: 0, secondsPerUnit: 0, maxAmount: 0, lastGiven: now }
                    ],
                    Skins: userDb.Skins,
                    Emotes: userDb.Emotes,
                    Animations: userDb.Animations,
                    Footsteps: userDb.Footsteps,
                    BattlePass: {
                            Level: 1,
                            Xp: 0,
                            HasPremium: true,
                            EndTime: "2030-01-01T00:00:00Z"
                    },
                    FreePassRewards: [], 
                    PremiumPassRewards: [],
                },
                PhotonJwt: await crypto.generatePhotonJwt(userDb.StumbleId, userDb.DeviceId, userDb.Username),
            };
            
            return res.json(response);
        } catch (err) {
            console.error("❌ Erro no Login:", err);
            return res.status(500).json({ error: "Erro interno no servidor" });
        }
    }
    
    static async GetShared(req, res) {
        try {
            const filePath = path.resolve(__dirname, "../shared/config.json");
            
            return res.sendFile(filePath, (err) => {
                if (err) {
                    console.error("Erro ao enviar shared.json:", err);
                    res.status(500).json({ error: "Erro ao enviar o arquivo" });
                }
            });
        } catch {
            res.sendStatus(500);
        }
    }
    
    static async UpdateUsername(req, res) {
        const { Username } = req.body;
        const deviceToken = req.headers['x-stumble-device-token'];
        
        const now = new Date();
        
        try {
            const db = databases.stumble();
            const UserModel = db.models.users || db.model("users", UserSchema);
            
            const existingUser = await UserModel.findOne({ 
                Username: { $regex: new RegExp(`^${Username}$`, 'i') } 
            });
            
            if (existingUser) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Username_Already_In_Use"
                });
            }
            
            const updatedUser = await UserModel.findOneAndUpdate(
                { DeviceToken: deviceToken },
                { $set: { Username: Username } },
                { returnDocument: 'after' }
            );
            
            if (!updatedUser) {
                return res.status(404).json({ success: false, message: "User_Not_Found" });
            }
            
            return res.status(200).json({
                User: {
                    Username: updatedUser.Username,
                    Balances: [
                        { name: "gems", amount: updatedUser.Gems, secondsSince: 0, secondsPerUnit: 0, maxAmount: 0, lastGiven: now },
                        { name: "dust", amount: updatedUser.Tokens, secondsSince: 0, secondsPerUnit: 0, maxAmount: 0, lastGiven: now }
                    ]
                }
            });
        } catch (err) {
            console.error("❌ Erro no UpdateUsername:", err);
            return res.status(500).json({ error: "Erro interno no servidor" });
        }
    }
    
    static async UserInventory(req, res) {
        const { Category, ItemId } = req.body;
        
        try {
            return res.json({ success: true });
        } catch (err) {
            console.error("❌ Erro ao atualizar inventário:", err);
            return res.status(500).json({ success: false });
        }
    }
}

module.exports = controller;
