# Strapi CMS Deployment Guide

This guide explains how to deploy and configure Strapi CMS for your portfolio website.

## Quick Setup Options

### Option 1: Railway (Recommended - Free Tier Available)

1. **Create Railway Account**
   - Visit [railway.app](https://railway.app)
   - Sign up with GitHub account

2. **Deploy Strapi**
   - Click "New Project"
   - Select "Deploy from GitHub repo" or "Deploy Template"
   - Choose "Strapi" from templates
   - Railway will automatically deploy Strapi with PostgreSQL

3. **Get Your API URL**
   - Once deployed, Railway will provide a URL like: `https://your-app.railway.app`
   - Update `CMS_CONFIG.strapiURL` in `js/cms-api.js`

### Option 2: Render (Free Tier Available)

1. **Create Render Account**
   - Visit [render.com](https://render.com)
   - Sign up with GitHub account

2. **Create Strapi Service**
   - Fork this Strapi starter: `https://github.com/strapi/strapi-starter-blog`
   - Connect your GitHub repo to Render
   - Deploy as a "Web Service"

3. **Configure Environment**
   - Add PostgreSQL database service
   - Set environment variables (see below)

### Option 3: Heroku (Paid)

1. **Create Heroku Account**
   - Visit [heroku.com](https://heroku.com)
   - Install Heroku CLI

2. **Deploy Strapi**
   ```bash
   git clone https://github.com/strapi/strapi-starter-blog.git
   cd strapi-starter-blog
   heroku create your-app-name
   heroku addons:create heroku-postgresql:hobby-dev
   git push heroku main
   ```

## Strapi Configuration

### 1. Initial Setup

Once your Strapi instance is running:

1. Visit `https://your-strapi-url.com/admin`
2. Create admin account (first time only)
3. You'll be redirected to the admin panel

### 2. Create Content Types

**Create Article Content Type:**

1. Go to "Content-Types Builder"
2. Click "Create new collection type"
3. Name it "Article"
4. Add these fields:

   - **title** (Text - Short text, required)
   - **slug** (UID - attached to title field)
   - **excerpt** (Text - Long text, required)
   - **content** (Rich text - Markdown, required)
   - **featured** (Boolean - default false)
   - **tags** (JSON - for storing tags array)
   - **publishedAt** (DateTime - with default value)
   - **image** (Media - Single media)

### 3. Configure Permissions

1. Go to "Settings" → "Users & Permissions Plugin" → "Roles"
2. Click "Public"
3. Under "Application", expand "Article"
4. Check: `find`, `findOne` (allow public read access)
5. Save

### 4. Add Sample Articles

1. Go to "Content Manager" → "Article"
2. Click "Create new entry"
3. Fill in article details:
   - Title: "Optimizing Spring Boot Applications for Production"
   - Excerpt: "Best practices for tuning Spring Boot applications..."
   - Content: Full article content in markdown
   - Tags: ["Java", "Spring Boot", "Performance"]
   - Featured: true
   - Upload image
4. Click "Save" then "Publish"

Repeat for 2-3 more articles to populate your blog.

## Frontend Integration

### Update API URL

In `js/cms-api.js`, update the Strapi URL:

```javascript
const CMS_CONFIG = {
    strapiURL: 'https://your-strapi-instance.railway.app', // Replace with your URL
    // ... rest of config
};
```

### Test Integration

1. Open your portfolio website
2. Check browser console for any errors
3. Verify articles load on homepage and blog page
4. Test article detail modal by clicking article links

## Environment Variables (for deployment)

Set these in your hosting platform:

```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-random-jwt-secret
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your-random-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
```

## CORS Configuration

If you encounter CORS issues, update `config/middleware.js` in your Strapi project:

```javascript
module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'https://res.cloudinary.com'],
          'media-src': ["'self'", 'data:', 'blob:'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*',
      origin: ['http://localhost:3000', 'https://your-portfolio-domain.com']
    }
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

## Troubleshooting

### Common Issues

1. **Articles not loading**
   - Check browser console for CORS errors
   - Verify Strapi URL in `cms-api.js`
   - Ensure public permissions are set for Article content type

2. **Images not showing**
   - Upload images through Strapi admin panel
   - Check image URLs in API response
   - Verify media permissions

3. **API endpoints not working**
   - Ensure content type is published
   - Check Strapi is running and accessible
   - Verify API endpoint URLs match Strapi v4 format

### Development Mode

For local development:

1. Clone Strapi starter locally
2. Run `npm install && npm run develop`
3. Strapi will be available at `http://localhost:1337`
4. Use this URL in `CMS_CONFIG.strapiURL`

## Next Steps

1. **Custom Styling**: Customize the admin panel colors in Strapi settings
2. **Rich Media**: Add more media types (videos, galleries)
3. **SEO**: Add meta description and keywords fields
4. **Categories**: Create separate Category content type for better organization
5. **Comments**: Integrate comment system (Disqus, custom)
6. **Analytics**: Add Google Analytics to track article views

## Support

- Strapi Documentation: [docs.strapi.io](https://docs.strapi.io)
- Railway Support: [railway.app/help](https://railway.app/help)
- Community Forums: [forum.strapi.io](https://forum.strapi.io)

Your portfolio now has a professional CMS backend that you can use to manage articles through a user-friendly interface!