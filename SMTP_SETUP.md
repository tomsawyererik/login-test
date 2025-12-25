# SMTP Setup Guide for Supabase

## How SMTP Works (Important!)

**You only need ONE SMTP configuration** - this is the email service that **sends emails FROM your app**.

- ✅ **One SMTP setup** = Your app can send emails to ANY user (Gmail, Outlook, Yahoo, etc.)
- ❌ **You DON'T need** separate SMTP configs for each user's email provider
- The SMTP you configure is like your "sender email service" - it sends emails on behalf of your app
- Users receive emails in their inbox regardless of their email provider (Gmail, Outlook, etc.)

**Example:** If you configure Gmail SMTP, your app will send emails FROM your Gmail account TO any user's email address (whether they use Gmail, Outlook, Yahoo, or anything else).

---

## Quick Setup: Gmail SMTP (Free & Easy) ⭐

### Step 1: Create a Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** in the left sidebar
3. Under "How you sign in to Google", make sure **2-Step Verification** is enabled
   - If not enabled, turn it on (you'll need your phone)
4. Once 2-Step Verification is enabled, go back to **Security**
5. Scroll down and click **2-Step Verification** again
6. Scroll to the bottom and click **App passwords**
7. You might need to sign in again
8. Select:
   - **App**: Choose "Mail"
   - **Device**: Choose "Other (Custom name)" and type "Supabase"
9. Click **Generate**
10. **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)
   - ⚠️ You can only see this once! Save it somewhere safe.

### Step 2: Configure in Supabase

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Project Settings** (gear icon in the left sidebar)
4. Click on **Authentication** in the left menu
5. Scroll down to **SMTP Settings**
6. Toggle **Enable Custom SMTP** to **ON**
7. Fill in these settings:

```
Host: smtp.gmail.com
Port: 465
Username: your-email@gmail.com (your actual Gmail address)
Password: [paste the 16-character app password from Step 1]
Sender Email: your-email@gmail.com (same as username)
Sender Name: Login Bank (or whatever you want)
```

8. Click **Save**

### Step 3: Test It!

1. Go back to your app
2. Enter your email address
3. Click "Send Magic Link"
4. Check your email inbox (and spam folder)
5. You should receive either:
   - A magic link to click, OR
   - An email with a 6-digit code

---

## Alternative: One.com Webmail

If you have a One.com email account:

1. Use your One.com email credentials
2. In Supabase, use these settings:

```
Host: send.one.com
Port: 465
Username: your-email@yourdomain.com (your full One.com email address)
Password: [your One.com email password - the one you use to log into webmail]
Sender Email: your-email@yourdomain.com (same as username)
Sender Name: Your App Name
```

**Note:** Use your actual One.com email login credentials (your email address and password).

---

## Alternative: Resend (Free Tier - 3,000 emails/month)

If you prefer not to use Gmail:

1. Sign up at https://resend.com (free account)
2. Verify your email
3. Go to **API Keys** and create a new API key
4. In Supabase, use these settings:

```
Host: smtp.resend.com
Port: 465
Username: resend
Password: [your Resend API key]
Sender Email: onboarding@resend.dev (or verify your own domain)
Sender Name: Your App Name
```

---

## Troubleshooting

**"Invalid credentials" error?**
- Make sure you're using the **App Password**, not your regular Gmail password
- Check that 2-Step Verification is enabled
- Make sure there are no spaces in the app password when you paste it

**Emails not arriving?**
- Check your spam/junk folder
- Wait a minute or two (sometimes there's a delay)
- Check Supabase logs: Dashboard → Logs → Auth Logs

**Still having issues?**
- Make sure the sender email matches your Gmail address exactly
- Try using port 587 with TLS instead of 465 with SSL (though 465 should work)

---

## That's it! 🎉

Once SMTP is configured, both magic links and OTP codes will work perfectly.

