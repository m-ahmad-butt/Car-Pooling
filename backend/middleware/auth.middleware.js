const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

const clerkAuth = ClerkExpressRequireAuth({
    publishableKey: process.env.VITE_CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY
});

module.exports = { clerkAuth };
