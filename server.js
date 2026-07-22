require("dotenv").config();
const app = require("./src/app");

// Start the server
const port = process.env.PORT;

app.listen(port, "0.0.0.0", () => {
    console.log(`\x1b[36m[INFO]\x1b[32m Servidor rodando na porta ${port}\x1b[0m`);
});