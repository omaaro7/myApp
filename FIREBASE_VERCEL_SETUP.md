# Firebase + Vercel Setup Guide

## Problem
When deploying your Next.js app to Vercel, you may encounter the error: "Firebase is unauthorized for this domain". This happens because Firebase Authentication needs to be configured to allow authentication from your Vercel domain.

## Solution

### Step 1: Get Your Vercel Domain
After deploying to Vercel, you'll get a domain like:
- `your-app.vercel.app` (default Vercel domain)
- Or your custom domain if you configure one

### Step 2: Add Your Vercel Domain to Firebase Authentication

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `quizwise-t8v1g`
3. **Navigate to Authentication**: In the left sidebar, click "Authentication"
4. **Go to Settings**: Click the "Settings" tab
5. **Add Authorized Domain**: In the "Authorized domains" section, click "Add domain"
6. **Add your Vercel domain**: 
   - If using default Vercel domain: `your-app.vercel.app`
   - If using custom domain: `your-custom-domain.com`
   - For local development: `localhost`

### Step 3: Configure Environment Variables in Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**
3. **Go to Settings**: Click "Settings" tab
4. **Environment Variables**: Click "Environment Variables"
5. **Add the following variables**:

```
NEXT_PUBLIC_FIREBASE_PROJECT_ID=quizwise-t8v1g
NEXT_PUBLIC_FIREBASE_APP_ID=1:484235234110:web:a5fe535505fe054791ba6f
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=quizwise-t8v1g.appspot.com
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCt-GLtX5HEsmlBsktEPJ-BiBg8dJusC0Y
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=quizwise-t8v1g.firebaseapp.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=484235234110
```

### Step 4: Redeploy Your App

After adding the environment variables and authorized domains:
1. **Redeploy your app** in Vercel
2. **Test authentication** on your deployed domain

## Additional Configuration

### For Custom Domains
If you're using a custom domain with Vercel:
1. Add your custom domain to Firebase authorized domains
2. Make sure your custom domain is properly configured in Vercel

### For Multiple Environments
You can set different environment variables for different environments (Production, Preview, Development) in Vercel.

## Troubleshooting

### Common Issues:
1. **Domain not added**: Make sure you've added the exact domain to Firebase authorized domains
2. **Environment variables not set**: Verify all environment variables are set in Vercel
3. **Caching issues**: Clear browser cache or try incognito mode
4. **Firebase project mismatch**: Ensure you're using the correct Firebase project

### Testing:
1. Test authentication on localhost first
2. Test on Vercel preview deployments
3. Test on production deployment

## Security Notes

- The Firebase API key is safe to expose in client-side code
- The `authDomain` should match your Firebase project's default domain
- For production, consider using Firebase App Check for additional security

## Files Modified

- `src/lib/firebase.ts` - Updated to use environment variables
- `.env.local` - Created for local development
- Environment variables configured in Vercel dashboard 