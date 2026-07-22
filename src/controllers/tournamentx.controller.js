const { UserSchema } = require("../models/index");
const databases = require("../services/mongo.databases");
const { JsonDatabase } = require("wio.db");

const tours = new JsonDatabase({ databasePath: "./src/shared/tournamentx.json" });

class controller {
    static async Active(req, res) {
        try {
            const tournamentsRaw = await tours.all();
            const formattedTournaments = tournamentsRaw.map(item => item.data);
            return res.json(formattedTournaments);
        } catch (err) {
            console.error("❌ Erro no Active:", err);
            return res.status(500).json({ error: "Erro interno no servidor" });
        }
    }
    
    static async Join(req, res) {
        try {
            const deviceToken = req.headers['x-stumble-device-token'];
            const tournamentId = parseInt(req.params.tournamentId);

            if (!deviceToken) return res.status(401).json({ message: "Device token missing" });

            const db = databases.stumble();
            const UserModel = db.models.users || db.model("users", UserSchema);
            const user = await UserModel.findOne({ DeviceToken: deviceToken });

            if (!user) return res.status(404).json({ message: "User_Not_Found" });

            const stumbleId = user.StumbleId || user.Id || "0";
            const username = user.Username || "Unknown";

            const allTours = await tours.all();
            const tourData = allTours.find(t => t.data.id === tournamentId);

            if (!tourData) return res.status(404).json({ message: "torneio nao encontrado" });

            const tournament = tourData.data;
            if (!tournament.isEnabled) return res.status(400).json({ message: "torneio desativado" });


            if (!tournament.partys) tournament.partys = [];
            const maxPlayers = tournament.maxPlayers || 2;
            let selectedParty = null;

            selectedParty = tournament.partys.find(p => p.players.length < maxPlayers);

            if (selectedParty) {
                if (!selectedParty.players.includes(stumbleId)) {
                    selectedParty.players.push(stumbleId);
                }
            } else {
                const syncWindow = Math.floor(Date.now() / 5000);
                selectedParty = {
                    partyId: `tour-${tournament.id}-${syncWindow}`,
                    players: [stumbleId]
                };
                tournament.partys.push(selectedParty);
            }
            
            if (!tournament.players) tournament.players = [];
            if (!tournament.players.some(p => p.stumbleId === stumbleId)) {
                tournament.players.push({ stumbleId, username });
            }
            
            await tours.set(tourData.ID, tournament);
            
            console.log(`[JOIN] ${username} -> Party: ${selectedParty.partyId} (${selectedParty.players.length}/${maxPlayers})`);
            
            return res.status(200).json({
                entryToken: `room-${tournament.id}-${selectedParty.partyId}`,
                MatchmakerTag: selectedParty.partyId,
                requestId: stumbleId
            });
        } catch (err) {
            console.error("❌ Erro no Join:", err);
            return res.status(500).json({ message: "erro interno" });
        }
    }
    
    static async Leave(req, res) {
        try {
            const deviceToken = req.headers['x-stumble-device-token'];
            const tournamentId = parseInt(req.params.tournamentId);
            
            if (!deviceToken) return res.status(401).json({ message: "Device token missing" });
            
            const db = databases.stumble();
            const UserModel = db.models.users || db.model("users", UserSchema);
            const user = await UserModel.findOne({ DeviceToken: deviceToken });
            
            if (!user) return res.status(404).json({ message: "User_Not_Found" });
            
            const stumbleId = user.StumbleId || user.Id;
            
            const allTours = await tours.all();
            const tourData = allTours.find(t => t.data.id === tournamentId);
            
            if (tourData) {
                const tournament = tourData.data;
                tournament.players = tournament.players.filter(p => p.stumbleId !== stumbleId);
                
                tournament.partys.forEach(party => {
                    party.players = party.players.filter(p => p !== stumbleId);
                });
                
                await tours.set(tourData.ID, tournament);
            }
            
            return res.status(200).json({ message: "saiu" });
        } catch (err) {
            console.error("❌ Erro no Leave:", err);
            return res.status(500).json({ message: "erro interno" });
        }
    }
    
    static async Finish(req, res) {
        try {
            const { Round, TournamentId, EntryToken, SignedPayload } = req.body;
            const deviceToken = req.headers['x-stumble-device-token'];
            const tournamentId = parseInt(TournamentId);
            
            if (!deviceToken) return res.status(401).json({ message: "Device token missing" });
            if (typeof Round === 'undefined') return res.status(400).json({ mensagem: "precisa do round" });
            
            const db = databases.stumble();
            const UserModel = db.models.users || db.model("users", UserSchema);
            const user = await UserModel.findOne({ DeviceToken: deviceToken });
            if (!user) return res.status(404).json({ message: "User_Not_Found" });
            
            const allTours = await tours.all();
            const tourData = allTours.find(t => t.data.id === tournamentId);
            
            let updateData = { $inc: {} };
            let collectedCurrencies = [];
            
            if (tourData && parseInt(Round) === 1) {
                const tournament = tourData.data;
                
                if (Array.isArray(tournament.awards)) {
                    tournament.awards.forEach(award => {
                        if (award.placementRangeLowest === 1) {
                            const amount = award.amount || 0;
                            
                            if (award.type === "CROWNS") {
                                updateData.$inc.Crowns = amount;
                            } else if (award.type === "TROPHIES") {
                                updateData.$inc.Trophies = amount;
                            } else if (award.type === "XP") {
                                updateData.$inc.Experience = amount;
                            } else if (award.type === "GEMS") {
                                updateData.$inc.Gems = amount;
                                collectedCurrencies.push("gems", amount);
                            }
                        }
                    });
                }
                
                if (Object.keys(updateData.$inc).length > 0) {
                    await UserModel.findOneAndUpdate({ DeviceToken: deviceToken }, updateData);
                }
                
                tournament.players = tournament.players.filter(p => p.stumbleId !== (user.StumbleId || user.Id));
                await tours.set(tourData.ID, tournament);
            }
            
            return res.status(200).json({
                TournamentId,
                Round: parseInt(Round),
                EntryToken,
                SignedPayload,
                CollectedCurrencies: collectedCurrencies
            });

        } catch (err) {
            console.error("❌ Erro no Finish:", err);
            return res.status(500).json({ mensagem: "erro interno" });
        }
    }
}

module.exports = controller;