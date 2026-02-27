const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

/* =========================
   CORS CONFIGURATION
========================= */

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://step-style-rho.vercel.app" // ⚠️ make sure this matches exactly
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // allow non-browser requests
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// Handle preflight requests
app.options("*", cors());

/* =========================
   SECURITY & BODY PARSER
========================= */

app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

/* =========================
   ROUTES
========================= */

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/orders', require('./routes/orders'));

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

app.get("/", (req, res) => {
    res.send("🚀 StepStyle Backend is Running");
});

/* =========================
   ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
    console.error("ERROR:", err.message);
    res.status(500).json({
        message: "Something went wrong"
    });
});

/* =========================
   SERVER START
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 StepStyle API running on port ${PORT}`);
});