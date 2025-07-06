# Environment Variables Setup Guide

This guide will help you set up the environment variables required for the application, which uses Google's Gemini API for its AI capabilities.

## Quick Setup

1.  **Copy `env.example` to a new `.env` file:**

    ```bash
    cp env.example .env
    ```

2.  **Open the `.env` file and add your API key and other secrets.**

## Required Environment Variables

### Google Gemini API Configuration

To use the AI features of this application, you need a Google API key with access to the Gemini API.

```env
# Get your API key from Google AI Studio: https://aistudio.google.com/app/apikey
GOOGLE_API_KEY=your-google-api-key-here
```

### Flask Application Configuration

These variables are for the Python backend.

```env
# The main application file
FLASK_APP=app.py

# Set to 'production' when deploying
FLASK_ENV=development

# A secret key is required for session management and other security features.
# Generate a strong key with: python -c 'import secrets; print(secrets.token_hex(16))'
SECRET_KEY=your-super-secret-key-for-sessions
```

### For Vercel Deployment

When deploying the frontend to Vercel, you will need to add the relevant environment variables in your Vercel project dashboard.

1.  Go to your project settings.
2.  Navigate to **Environment Variables**.
3.  Add `GOOGLE_API_KEY` and any other required variables for your production environment.

## Getting a Google API Key

1.  Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Sign in with your Google account.
3.  Click on **"Create API key in new project"**.
4.  Copy the generated API key and store it securely.
5.  Add the key to your `.env` file.

## Testing Your Configuration

After setting up your environment variables:

1.  **Install dependencies for the backend:**

    ```bash
    pip install -r requirements.txt
    ```

2.  **Start the Flask development server:**

    ```bash
    flask run
    ```

3.  **In a separate terminal, install dependencies and start the frontend:**

    ```bash
    npm install
    npm run dev
    ```

4.  Test the application by interacting with an AI-powered feature.
5.  Check the terminal output for both the Flask server and the Next.js server for any errors.

## Security Best Practices

1.  **Never commit `.env` to Git** - It's already in `.gitignore`
2.  **Use different API keys** for development and production
3.  **Set spending limits** in both Google Cloud Console
4.  **Rotate keys regularly** for security

## Troubleshooting

### "Invalid API Key" Error
- Double-check your API key is copied correctly
- Ensure no extra spaces or quotes
- Verify the key hasn't been revoked

### "Rate Limit" Error
- Check your API usage limits
- Implement request throttling if needed
- Consider upgrading your API plan

## Example `.env` File

```env
# Google Gemini API
GOOGLE_API_KEY=your-actual-google-api-key-here

# Flask App
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-super-secret-key-for-sessions

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Next Steps

1. Set up your API key
2. Configure your Flask app settings
3. Test the integration
4. Deploy to production

For more details, see the [AI Integration Guide](./AI_INTEGRATION_GUIDE.md).