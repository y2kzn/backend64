const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_URL;

mongoose.set("strictQuery", false);
mongoose.connect(MONGO_URL)
.then(() => console.log("✅ MongoDB conectado com sucesso!"))
.catch(err => console.error("❌ Erro ao conectar MongoDB:", err));

module.exports = mongoose;