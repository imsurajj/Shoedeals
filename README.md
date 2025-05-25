# Shoe Deals AI Assistant

## Quick Links
- **Demo URL**: [https://shoedeals.vercel.app](https://shoedeals.vercel.app)
- **Demo Data**: [Shoe Deals Spreadsheet](https://docs.google.com/spreadsheets/d/1TtrVPNqS7Y7l3c0foXwXy6yFm9codKcZwy432rBEK6g/edit?usp=sharing)

## Test Script
`` <script id="omnidimension-web-widget" async src="https://backend.omnidim.io/web_widget.js?secret_key=e024ce438d661126ab9cd401859a8f2c" ></script>
``

## Technology
- Built with Next.js, React, and Tailwind CSS
- Uses OmniDimension API for the AI voice and chat agent
- WebRTC implementation for real-time voice communication

## Credentials
- Username: demo
- Password: shoedeals2023

## Local Development

### Environment Variables

create .env.local file and use credentials 
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bW9kZWwtc3F1aWQtMTkuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_dKIZmxs30CqkQPloCEQNUzf8lUBT3PMuGL3pGFf1Me
OMNIDIM_API_KEY=-enknnAUXVym81SrL6ZepIxU6Yjgzk9bvmI9V8Xv5eA
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Setup
```bash
git clone https://github.com/yourusername/shoedeals.git
cd shoedeals
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.
