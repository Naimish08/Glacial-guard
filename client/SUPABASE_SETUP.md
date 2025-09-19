# Supabase Email Confirmation Setup Guide

## The Problem
You're getting "email is not confirmed" errors when trying to log in. This is because Supabase requires email confirmation by default for security.

## Solution Steps

### 1. Configure Supabase Project Settings

1. **Go to your Supabase Dashboard**
   - Visit [supabase.com](https://supabase.com)
   - Open your project

2. **Update Authentication Settings**
   - Go to **Authentication** → **Settings**
   - Under **User Signups**, make sure **Enable email confirmations** is checked
   - Under **Email Templates**, customize your confirmation email if needed

3. **Configure Site URL**
   - Go to **Authentication** → **URL Configuration**
   - Set **Site URL** to: `http://localhost:5173` (for development)
   - Add **Redirect URLs**:
     - `http://localhost:5173/auth/callback`
     - `http://localhost:5173/**` (for development)

### 2. Environment Variables

Create a `.env` file in the `client/` directory:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Email Configuration (Optional)

If you want to use a custom SMTP provider:

1. Go to **Authentication** → **Settings**
2. Under **SMTP Settings**, configure your email provider
3. Or use Supabase's built-in email service (limited but free)

### 4. Testing the Flow

1. **Start your development server:**
   ```bash
   cd client
   npm run dev
   ```

2. **Test the signup flow:**
   - Go to `http://localhost:5173`
   - Click the login button
   - Switch to "Sign Up" tab
   - Create a new account
   - Check your email for confirmation link

3. **Test the login flow:**
   - Try logging in before confirming email (should show error with resend button)
   - Click the confirmation link in your email
   - Try logging in again (should work)

### 5. Troubleshooting

**If emails aren't being sent:**
- Check your spam folder
- Verify SMTP settings in Supabase dashboard
- Check Supabase logs for email delivery errors

**If confirmation link doesn't work:**
- Make sure redirect URLs are properly configured
- Check that the callback route is working: `http://localhost:5173/auth/callback`

**If you get "Email link is invalid or has expired" error:**
- This means the confirmation link has expired (usually after 24 hours)
- The app now automatically detects this error and provides a "Send New Confirmation Email" button
- Click the button to get a fresh confirmation link
- You can also go back to the login page and use the resend button there

**If you want to disable email confirmation (NOT recommended for production):**
- Go to **Authentication** → **Settings**
- Uncheck **Enable email confirmations**
- This will allow users to sign in immediately without email verification

### 6. Production Deployment

When deploying to production:

1. Update **Site URL** to your production domain
2. Add production redirect URLs
3. Update environment variables with production values
4. Consider using a proper SMTP provider for better email delivery

## Features Implemented

✅ **Email Confirmation Handling**
- Proper error messages for unconfirmed emails
- Resend confirmation email button
- Email confirmation callback page

✅ **User Experience**
- Clear instructions for users
- Loading states and success messages
- Automatic redirect after confirmation

✅ **Security**
- Proper session handling
- Secure redirect URLs
- Email verification flow

## Need Help?

If you're still having issues:
1. Check the browser console for errors
2. Check Supabase logs in the dashboard
3. Verify your environment variables are correct
4. Make sure your Supabase project is active and not paused
