const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });
const { startEureka } = require('./eureka-client');

const app = express();
const PORT = process.env.API_GATEWAY_PORT || process.env.PORT || 5000;

const allowedOrigins = [
    process.env.CLIENT_URL || '*'
].filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS not allowed"));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200,
    maxAge: 86400
};

app.use(cors(corsOptions));
app.use(express.json());

const SERVICES = {
    eureka: process.env.EUREKA_URL || process.env.EUREKA_SERVER_URL,
    auth: process.env.AUTH_SERVICE_URL
};

app.get('/', (req, res) => {
    res.json({ message: 'API Gateway Service is running' });
});

// Route: /auth* -> auth-service
app.use('/auth', async (req, res) => {
    console.log(`Gateway received ${req.method} request for ${req.url}`);
    try {
        const targetUrl = `${SERVICES.auth}/auth${req.url}`;
        console.log(`Forwarding to: ${targetUrl}`);
        const response = await axios({
            method: req.method,
            url: targetUrl,
            data: req.body,
            params: req.query,
            headers: { 'Content-Type': 'application/json' }
        });
        console.log(`Response from auth-service: ${response.status}`);
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error(`Gateway error forwarding to auth-service: ${error.message}`);
        res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
    }
});

// Route: /eureka* -> netflix-eureka-server
app.use('/eureka', async (req, res) => {
    try {
        const response = await axios({
            method: req.method,
            url: `${SERVICES.eureka}/eureka${req.url}`,
            data: req.body,
            params: req.query,
            headers: { 'Content-Type': 'application/json' }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
    startEureka();
});
