# Vercel Deployment - Environment Variables Setup

## Important: Environment Variables for Vercel

The `.env.local` file is NOT uploaded to Vercel (it's in .gitignore). You need to set the environment variables in Vercel Dashboard.

## Steps to configure on Vercel:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** > **Environment Variables**
4. Add the following variables:

| Name           | Value         | Environments                     |
| -------------- | ------------- | -------------------------------- |
| ADMIN_USERNAME | admin         | Production, Preview, Development |
| ADMIN_PASSWORD | your_password | Production, Preview, Development |

5. Click **Save**
6. Redeploy your project

## To change password:

Simply update the value in Vercel Dashboard and redeploy.

## Default values (fallback):

If variables are not set, the system uses:

- Username: admin
- Password: admin123
