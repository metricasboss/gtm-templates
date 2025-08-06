# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a Google Tag Manager (GTM) templates repository by Métricas Boss, organized into client-side and server-side implementations. The templates are production-ready solutions for Brazilian e-commerce, analytics, and marketing automation platforms.

## Structure

```
gtm-templates/
├── client/         # Client-side templates
│   ├── tags/       # Web container tags
│   └── variables/  # Client-side variables
├── server/         # Server-side templates
│   ├── tags/       # Server container tags
│   └── variables/  # Server-side variables
├── docs/           # Documentation
└── scripts/        # Build and utility scripts
```

## GTM Template Format

All `.tpl` files follow Google's standard template structure:
- `___INFO___`: Metadata (displayName, description, categories)
- `___TEMPLATE_PARAMETERS___`: Configuration fields
- `___SANDBOXED_JS_FOR_WEB_TEMPLATE___` or `___SANDBOXED_JS_FOR_SERVER___`: Main logic
- `___WEB_PERMISSIONS___` or `___SERVER_PERMISSIONS___`: Required permissions
- `___TESTS___`: Unit tests
- `___NOTES___`: Documentation

## Development Commands

For templates with JavaScript injection (have `inject-script` folders):
```bash
# Install dependencies (use pnpm)
pnpm install

# Build JavaScript bundle
pnpm run build

# Deploy to AWS S3 (requires .env configuration)
pnpm run deploy
```

## Key Conventions

1. **Brand Consistency**: All templates use "Métricas Boss" branding
2. **Error Handling**: Always use `data.gtmOnSuccess()` and `data.gtmOnFailure()`
3. **Logging**: Include debug flags for conditional logging
4. **Documentation**: Templates include Portuguese and English descriptions
5. **AWS Deployment**: JavaScript bundles are hosted on S3 for production use

## Platform Integrations

- **GA4**: Google Analytics 4 tracking enhancements
- **VTEX**: Brazilian e-commerce platform data extraction
- **RD Station**: Marketing automation conversions
- **Panda Video**: Video engagement tracking
- **Behiivee**: Newsletter platform tracking

## Testing GTM Templates

1. Import the `.tpl` file into GTM
2. Configure required fields in the tag/variable settings
3. Use GTM Preview mode to test functionality
4. Check browser console for debug logs (when debug mode enabled)

## Template Locations

### Client-side:
- **Tags**: `client/tags/[template-name]/`
- **Variables**: `client/variables/[template-name]/`

### Server-side:
- **Tags**: `server/tags/[template-name]/`
- **Variables**: `server/variables/[template-name]/`

## Important Notes

- Primary documentation language is Portuguese (Brazilian market focus)
- Templates with single `.tpl` files are now organized in folders named `template.tpl`
- Each template with JavaScript has its own build setup in `inject-script` folder
- Use `pnpm` as the package manager (not npm or yarn)
- Environment variables for AWS deployment should be in `.env` files within each template's inject-script folder