const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const { startEureka } = require('./eureka-client');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.AUTH_SERVICE_PORT || 5002;

app.use(cors());
app.use(express.json());

app.post('/auth/sync', async (req, res) => {
    const { clerkId, email, name, firstName, lastName, campus, contactNo, rollNo } = req.body;
    console.log('Syncing user:', { clerkId, email, name });
    try {
        let user = await prisma.user.findUnique({ where: { clerkId } });
        
        const userData = {
            email,
            name,
            firstName,
            lastName,
            campus,
            contactNo,
            rollNo
        };

        if (user) {
            user = await prisma.user.update({
                where: { clerkId },
                data: userData
            });
            console.log('User updated:', user.clerkId);
        } else {
            user = await prisma.user.create({
                data: {
                    clerkId,
                    ...userData
                }
            });
            console.log('User created:', user.clerkId);
        }
        
        res.json(user);
    } catch (error) {
        console.error('Error syncing user:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/auth/generate-otp', async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    try {
        await prisma.user.update({
            where: { email },
            data: { otp, otpExpiry: expiry }
        });
        console.log(`OTP for ${email}: ${otp}`);
        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
    }
});

app.post('/auth/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
            return res.status(401).json({ error: 'Invalid or expired OTP' });
        }
        await prisma.user.update({
            where: { email },
            data: { otp: null, otpExpiry: null }
        });
        res.json({ message: 'Login successful', userId: user.clerkId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/auth/me', ClerkExpressRequireAuth(), async (req, res) => {
    res.json({ user: req.auth });
});

app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
    startEureka();
});
