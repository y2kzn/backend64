const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    Id: { type: Number, unique: true },
    Username: String,
    DeviceId: { type: String, unique: true },
    StumbleId: { type: String, unique: true },
    Country: { type: String, default: "BR" },
    IP: { type: String, default: "" },
    SkillRating: { type: Number, default: 0 },
    Experience: { type: Number, default: 0 },
    Crowns: { type: Number, default: 0 },
    Gems: { type: Number, default: 5000 },
    Tokens: { type: Number, default: 0 },
    Tournaments: { type: Number, default: 0 },
    Skins: { type: [String], default: ["SKIN1", "SKIN2"] },
    Emotes: { type: [String], default: ["emote_cry", "emote_hi", "emote_gg", "emote_haha", "emote_happy"] },
    Animations: { type: [String], default: ["animation1"], },
    Footsteps: { type: [String], default: ["footsteps_smoke"] },
    CreatedAt: { type: String, default: new Date().toLocaleDateString('pt-BR') },
    LastLogin: { type: String, default: () => new Date() },
    isBanned: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    DeviceToken: { type: String, index: true, default: "" },
});

module.exports = UserSchema;