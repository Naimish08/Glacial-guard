# Fix Supabase Email Template and Redirect URLs

## The Problem
Your Supabase confirmation emails are showing the default template without proper redirect URLs. The emails should redirect to your app's callback URL after confirmation.

## Solution Steps

### 1. Configure Supabase Dashboard Settings

1. **Go to your Supabase Dashboard**
   - Visit [supabase.com](https://supabase.com)
   - Open your project

2. **Update Authentication Settings**
   - Go to **Authentication** → **Settings**
   - Under **User Signups**, make sure **Enable email confirmations** is checked

3. **Configure URL Settings**
   - Go to **Authentication** → **URL Configuration**
   - Set **Site URL** to: `http://localhost:8081` (your current dev server)
   - Add **Redirect URLs**:
     - `http://localhost:8081/auth/callback`
     - `http://localhost:8081/**` (for development)

### 2. Update Email Templates

1. **Go to Email Templates**
   - Navigate to **Authentication** → **Email Templates**
   - Click on **Confirm signup**

2. **Update the Email Template**
   Replace the default template with this custom one:

```html
<h2>Confirm your signup</h2>

<p>Follow this link to confirm your user:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your mail</a></p>

<p>You're receiving this email because you signed up for an application powered by Supabase ⚡</p>

<p>
  <a href="{{ .SiteURL }}">Opt out of these emails</a>
</p>
```

3. **Save the Template**
   - Click **Save** to update the template

### 3. Test the Configuration

1. **Clear Browser Cache**
   - Clear your browser cache and cookies
   - Or use an incognito/private window

2. **Test Signup Flow**
   - Go to `http://localhost:8081`
   - Try signing up with a new email
   - Check the confirmation email

3. **Verify the Link**
   - The confirmation link should now redirect to your app
   - It should go to `http://localhost:8081/auth/callback`

### 4. Alternative: Use Environment Variables

If the template approach doesn't work, you can also set the redirect URL in your environment:

1. **Update your `.env` file** in the `client/` directory:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SITE_URL=http://localhost:8081
```

2. **Update the Supabase client** to use the environment variable:
```typescript
export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({ 
    email, 
    password,
    options: {
      emailRedirectTo: `${import.meta.env.VITE_SITE_URL || window.location.origin}/auth/callback`
    }
  });
}
```

### 5. Troubleshooting

**If emails still don't redirect properly:**

1. **Check Supabase Logs**
   - Go to **Logs** → **Auth** in your Supabase dashboard
   - Look for any errors related to email sending

2. **Verify Redirect URLs**
   - Make sure the redirect URLs in Supabase match your app's URL
   - Check that `http://localhost:8081/auth/callback` is in the allowed list

3. **Test with Different Email**
   - Try with a different email address
   - Sometimes email providers cache old templates

4. **Check Email Provider**
   - If using custom SMTP, verify the configuration
   - If using Supabase's built-in email, check the limits

### 6. Production Deployment

When deploying to production:

1. **Update Site URL** to your production domain
2. **Add production redirect URLs**
3. **Update environment variables**
4. **Test the complete flow**

## Expected Result

After fixing the configuration:
- ✅ Confirmation emails will have proper redirect URLs
- ✅ Clicking the link will redirect to your app
- ✅ The AuthCallback page will handle the confirmation
- ✅ Users will be automatically logged in after confirmation

## Need Help?

If you're still having issues:
1. Check the browser console for errors
2. Verify your Supabase project settings
3. Make sure your development server is running on the correct port
4. Check that the callback route is working: `http://localhost:8081/auth/callback`
