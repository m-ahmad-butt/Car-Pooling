const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

const clerkAuth = ClerkExpressRequireAuth({
    secretKey: process.env.CLERK_SECRET_KEY
});

module.exports = { clerkAuth };
