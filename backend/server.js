// FULL UPDATED CODE FOR server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const { Parser } = require('json2csv');
const User = require('./models/User');
const authRoutes = require('./routes/auth');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// --- 🚫 AUTONOMOUS SECURITY: IP BLACKLIST ---
// Real world mein ise Redis mein rakhte hain, hum yahan memory mein rakh rahe hain
let blacklistedIPs = new Set();

const securityWall = (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    if (blacklistedIPs.has(clientIP)) {
        return res.status(403).json({ 
            status: "TERMINATED", 
            error: "Security Violation", 
            msg: "Your IP has been blacklisted by AI due to critical fraud risk." 
        });
    }
    next();
};

app.use(securityWall);

// --- 📂 DB CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("🔥 AI Security Node: Connected to MongoDB");
        const adminExist = await User.findOne({ email: "admin@secure.ai" });
        if (!adminExist) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            await User.create({
                username: "admin_root",
                email: "admin@secure.ai",
                password: hashedPassword
            });
            console.log("👤 System Admin Ready");
        }
    }).catch(err => console.log("❌ DB Error: ", err));

const TxnSchema = new mongoose.Schema({
    amount: Number, freq: Number, status: String, riskScore: Number, 
    ip: String, time: { type: Date, default: Date.now }
});
const Transaction = mongoose.model('Transaction', TxnSchema);

// --- 🧠 ANALYTICS ENGINE WITH AUTO-BLOCK ---
app.post('/api/analyze-txn', async (req, res) => {
    try {
        const { amount, freq, time } = req.body;
        const clientIP = req.ip || req.connection.remoteAddress;

        const aiResponse = await axios.post('http://localhost:5001/predict', { amount, freq, time });
        
        const { status, risk_score } = aiResponse.data;

        // Save to Database
        await Transaction.create({ amount, freq, status, riskScore: risk_score, ip: clientIP });

        // 🔥 ACTION: If Risk is Critical, Auto-Block the IP
        if (risk_score >= 90) {
            blacklistedIPs.add(clientIP);
            return res.json({
                ...aiResponse.data,
                verdict: "CRITICAL: IP AUTO-BLACKLISTED",
                security_action: "CONNECTION_TERMINATED"
            });
        }

        res.json(aiResponse.data);
    } catch (err) {
        res.status(500).json({ error: "AI Engine Offline" });
    }
});

app.use('/api/auth', authRoutes);

app.get('/api/export-report', async (req, res) => {
    try {
        const transactions = await Transaction.find().lean();
        if (transactions.length === 0) return res.status(400).json({ msg: "No logs found" });
        const fields = ['_id', 'amount', 'freq', 'status', 'riskScore', 'ip', 'time'];
        const json2csvParser = new Parser({ fields });
        res.header('Content-Type', 'text/csv').attachment('security_audit.csv').send(json2csvParser.parse(transactions));
    } catch (err) { res.status(500).json({ error: "Export failed" }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 SOC Backend Active on http://localhost:${PORT}`));