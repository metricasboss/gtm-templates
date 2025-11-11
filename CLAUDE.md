# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a Google Tag Manager (GTM) templates repository by Métricas Boss. It contains production-ready templates for Brazilian e-commerce, analytics, and marketing automation platforms. Templates are organized into client-side (Web Container) and server-side (Server Container) implementations.

## Architecture

The repository follows a clear separation between client-side and server-side GTM templates:

- **Client-side templates** (`client/`): Execute in the user's browser
  - Tags: Send data to analytics tools, track events, inject scripts
  - Variables: Return values for use in tags and triggers

- **Server-side templates** (`server/`): Execute on GTM Server Container
  - Tags: Process and forward data server-side (better security and control)
  - Variables: Transform and clean data server-side
  - Clients: Handle incoming HTTP requests and create events

### Template Structure

Each template lives in its own folder with:
- `template.tpl` - The GTM template file (required)
- `README.md` - Complete documentation in Portuguese (required)
- `inject-script/` - For templates that inject JavaScript (optional)

### Templates with JavaScript Injection

Three templates inject external JavaScript that requires building:
1. `client/tags/behiivee-iframe-tracker/`
2. `client/tags/iframe-tracker/`
3. `client/tags/panda-video/`

Each has an `inject-script/` folder containing:
- Source JavaScript files
- `webpack.config.js` - Bundles JS and deploys to AWS S3
- `package.json` - Build scripts and dependencies
- `.env` file (gitignored) - AWS credentials for deployment

## Development Commands

### For Templates with JavaScript Injection

Navigate to the template's `inject-script/` folder:

```bash
# Install dependencies - ALWAYS use pnpm (never npm or yarn)
pnpm install

# Build JavaScript bundle for production
pnpm run build

# Deploy bundle to AWS S3 (requires .env with AWS credentials)
pnpm run deploy
```

### Environment Variables for Deployment

Create `.env` file in each `inject-script/` folder:
```
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=your_region
AWS_S3_BUCKET=your_bucket
```

## GTM Template File Format (.tpl)

All `.tpl` files follow Google's sandboxed template structure:

1. **`___INFO___`**: Metadata including displayName, brand (Métricas Boss), description, categories
2. **`___TEMPLATE_PARAMETERS___`**: Configuration fields shown in GTM UI
3. **`___SANDBOXED_JS_FOR_WEB_TEMPLATE___`** or **`___SANDBOXED_JS_FOR_SERVER___`**: Main logic using GTM's sandboxed JavaScript APIs
4. **`___WEB_PERMISSIONS___`** or **`___SERVER_PERMISSIONS___`**: Required permissions (logging, pixel sending, HTTP, etc.)
5. **`___TESTS___`**: Unit tests for the template
6. **`___NOTES___`**: Additional documentation

### Key Template Conventions

1. **Always call success/failure callbacks**: Every tag must call `data.gtmOnSuccess()` or `data.gtmOnFailure()`
2. **Conditional logging**: Use debug flags to enable/disable logs - `if (data.enableDebug) { log('...'); }`
3. **Brand consistency**: All templates use "Métricas Boss" branding in the `brand` field
4. **Bilingual descriptions**: Include Portuguese (primary) and English descriptions
5. **Minimal permissions**: Only request necessary permissions

## Platform Integrations

The templates integrate with Brazilian and international platforms:

- **GA4**: Google Analytics 4 identity management and tracking enhancements
- **VTEX IO**: Brazilian e-commerce platform data extraction (orderForm)
- **RD Station**: Marketing automation conversion API integration
- **Panda Video**: Video player event tracking
- **Behiivee**: Newsletter platform iframe event tracking

## Testing GTM Templates

1. Open GTM Web or Server Container
2. Go to Templates → Import
3. Upload the `.tpl` file
4. Create a new tag/variable using the imported template
5. Configure required fields
6. Use GTM Preview Mode to test
7. Check browser console (client-side) or server logs (server-side) for debug output

## Important Notes

- **Primary language is Portuguese**: All documentation in README files should be in Portuguese (Brazilian market focus)
- **Use pnpm**: Package manager for all JavaScript build processes
- **No credentials in code**: AWS credentials go in `.env` files (gitignored), never in source code
- **Folder naming**: Use kebab-case for all folder names (e.g., `panda-video`, not `pandaVideo`)
- **Each template is self-contained**: Dependencies and build configs are per-template, not shared

## Contributing

See `CONTRIBUTING.md` for detailed guidelines on:
- Creating new templates (tags, variables, clients)
- Template structure requirements
- Documentation standards
- Security best practices
- Pull request process
