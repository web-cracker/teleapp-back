require("dotenv").config();
const express = require("express");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
app.use(cors()); // Allow all origins

const BOT_TOKEN = '8054957912:AAEq2BinuoOEYXR3evTxjyrq2G2XTylQJ6o';
const SECRET_KEY = crypto.createHmac("sha256", "WebAppData").update(BOT_TOKEN).digest();

function checkTelegramAuth(query) {
    const authData = Object.entries(query)
        .filter(([key]) => key !== "hash")
        .map(([key, value]) => `${key}=${value}`)
        .sort()
        .join("\n");

    const hmac = crypto.createHmac("sha256", SECRET_KEY).update(authData).digest("hex");

    return hmac === query.hash;
}


app.get("/", (req, res) => {
    res.send("Server is running properly!");
});

app.get("/auth", (req, res) => {
    if (checkTelegramAuth(req.query)) {
        res.json({ status: "success", user: req.query });
    } else {
        res.status(401).json({ status: "error", message: "Unauthorized" });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
